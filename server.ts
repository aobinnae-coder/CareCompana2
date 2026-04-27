import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import Stripe from 'stripe';

const PORT = 3000;

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

async function startServer() {
  const app = express();
  app.use(express.json());

  // In-memory state for prototype
  const state = {
    companions: [
      {
        id: 'CMP-001',
        name: 'Maria Gonzalez',
        isCertified: false,
        certificationScore: null,
        consents: [] as string[],
        riskScore: 100,
        totalVisits: 24,
        completedVisits: 23,
        punctualVisits: 23,
        cancellations: 0,
        incidentsCount: 0,
        ratings: [5, 4.8, 5],
        skills: ['Dementia Care', 'Mobility Assistance', 'Conversational Spanish'],
        bio: 'Compassionate caregiver with 5 years of experience.'
      },
      {
        id: 'CMP-002',
        name: 'David L.',
        isCertified: true,
        certificationScore: 90,
        consents: ['TOS', 'HIPAA', 'LIABILITY', 'BACKGROUND', 'CERTIFICATION_AGREEMENT'],
        riskScore: 65,
        totalVisits: 14,
        completedVisits: 10,
        punctualVisits: 8,
        cancellations: 2,
        incidentsCount: 1,
        ratings: [4.0, 3.5, 4.2],
        skills: ['First Aid', 'Meal Prep'],
        bio: 'Friendly student ready to help.'
      }
    ],
    incidents: [
      {
        id: 'INC-1001',
        visitId: 'Multiple',
        companionId: 'CMP-002',
        companionName: 'David L.',
        seniorName: 'Various',
        severity: '2_behavioral',
        incidentTypes: ['Repeated Late Arrivals'],
        narrative: 'Companion has been >15m late for 3 consecutive visits. Risk score downgraded.',
        status: 'open',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    visits: [
      {
        id: 'VST-8821',
        companionId: 'CMP-001',
        companionName: 'Maria Gonzalez',
        seniorName: 'Eleanor R.',
        status: 'pending', // en_route, arrived, in_progress, completed, cancelled
        logs: [] as { time: string; type: string; content: string }[],
        summary: '',
        rating: null as number | null,
        scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
      },
      {
        id: 'VST-8842',
        companionId: 'CMP-002',
        companionName: 'David L.',
        seniorName: 'Arthur Miller',
        status: 'completed',
        logs: [{ time: new Date().toISOString(), type: 'note', content: 'Visit ended abruptly' }],
        summary: 'David visited Arthur. The visit was brief and lacked engagement.',
        rating: 3,
        scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      }
    ],
    seniors: [
      {
        id: 'SEN-001',
        name: 'Eleanor R.',
        dob: '1942-05-14',
        address: '123 Oak St, NY',
        conditions: ['Mild Dementia', 'Mobility Issues'],
        primaryLanguage: 'English',
        familyAdmin: 'David R.'
      },
      {
        id: 'SEN-002',
        name: 'Arthur Miller',
        dob: '1938-11-02',
        address: '456 Pine Ave, NY',
        conditions: ['Hearing Loss'],
        primaryLanguage: 'English',
        familyAdmin: 'Sarah M.'
      }
    ]
  };

  const updateRiskScore = (compId: string) => {
    const comp = state.companions.find(c => c.id === compId);
    if (!comp) return;

    const previousScore = comp.riskScore;
    let score = 100;
    // Calculate rating
    const avgRating = comp.ratings.length ? comp.ratings.reduce((a,b)=>a+b,0) / comp.ratings.length : 5.0;
    if (avgRating < 4.0) score -= 10;
    
    // Calculate incidents
    const compIncidents = state.incidents.filter(i => i.companionId === compId);
    for (const inc of compIncidents) {
      if (inc.severity === '4_emergency' || inc.severity === '3_safety') {
        score = 0; // Immediate failure
        break;
      }
      if (inc.severity === '2_behavioral' || inc.severity === '1_minor') {
        score -= 15;
      }
    }

    // Cancellations
    score -= (comp.cancellations * 5);

    // Late penalty (implied by punctuality rate < 100%)
    const lates = comp.totalVisits - comp.punctualVisits;
    if (lates > 0) score -= Math.min(lates * 2, 20);

    const newScore = Math.max(0, score);
    comp.riskScore = newScore;

    if (newScore < 70 && previousScore >= 70) {
      state.incidents.unshift({
        id: `INC-${Math.floor(Math.random() * 10000)}`,
        visitId: 'SYSTEM',
        companionId: comp.id,
        companionName: comp.name,
        seniorName: 'N/A',
        severity: '3_safety',
        incidentTypes: ['Risk Score Alert'],
        narrative: `Companion risk score dropped to ${newScore}. Immediate review required.`,
        status: 'open',
        createdAt: new Date().toISOString()
      });
    }
  };

  // API Routes
  app.get('/api/visits', (req, res) => {
    res.json(state.visits);
  });

  app.post('/api/visits/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const visit = state.visits.find(v => v.id === id);
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    visit.status = status;
    res.json(visit);
  });

  app.post('/api/visits/:id/log', (req, res) => {
    const { id } = req.params;
    const { type, content, time } = req.body;
    const visit = state.visits.find(v => v.id === id);
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    visit.logs.push({ type, content, time });
    res.json(visit);
  });

  app.post('/api/visits/:id/rate', (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const visit = state.visits.find(v => v.id === id);
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    visit.rating = rating;
    
    // Update Companion
    const comp = state.companions.find(c => c.id === visit.companionId);
    if (comp) {
      comp.ratings.push(rating);
      updateRiskScore(comp.id);
    }
    
    res.json(visit);
  });

  app.post('/api/visits/:id/cancel', (req, res) => {
    const { id } = req.params;
    const visit = state.visits.find(v => v.id === id);
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    
    // 24hr check
    const scheduled = new Date(visit.scheduledFor);
    const now = new Date();
    const isLateCancellation = (scheduled.getTime() - now.getTime()) < 24 * 60 * 60 * 1000;
    
    visit.status = 'cancelled';
    
    const comp = state.companions.find(c => c.id === visit.companionId);
    if (comp && isLateCancellation) {
      comp.cancellations++;
      updateRiskScore(comp.id);
    }

    res.json({ visit, isLateCancellation, penaltyApplied: isLateCancellation });
  });

  app.post('/api/visits/:id/checkout', async (req, res) => {
    const { id } = req.params;
    const { note, mood } = req.body;
    const visit = state.visits.find(v => v.id === id);
    if (!visit) return res.status(404).json({ error: 'Visit not found' });
    
    visit.logs.push({ type: 'mood', content: mood, time: new Date().toISOString() });
    if (note) visit.logs.push({ type: 'note', content: note, time: new Date().toISOString() });
    
    visit.status = 'completed';
    
    const comp = state.companions.find(c => c.id === visit.companionId);
    if (comp) {
       comp.completedVisits++;
    }

    // Generate summary via Anthropic
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (apiKey) {
        const anthropic = new Anthropic({ apiKey });
        const systemPrompt = `You are an AI assistant for CareCompana, an elderly companionship platform.
Your task is to write a compassionate, brief, and professional visit summary for the family based on the companion's raw logs. Ensure the tone is reassuring.`;
        
        const contentStr = visit.logs.map(l => `[${l.type.toUpperCase()}] ${l.content}`).join('\\n');
        
        const msg = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 300,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
             {
               role: 'user',
               content: `Here are the logs from the visit with ${visit.seniorName} by companion ${visit.companionName}:\n\n${contentStr}\n\nPlease generate the summary for the family.`
             }
          ]
        });
        if (msg.content[0].type === 'text') {
           visit.summary = msg.content[0].text;
        }
      } else {
        visit.summary = `(Mock Summary) ${visit.companionName}'s visit with ${visit.seniorName} went well today. They reported a ${mood} mood. Note: ${note}`;
      }
    } catch (e) {
      console.error("LLM Error", e);
      visit.summary = `Error generating summary. Raw note: ${note}`;
    }

    res.json(visit);
  });

  // Compliance & Safety Routes
  app.get('/api/companions/:id', (req, res) => {
    const comp = state.companions.find(c => c.id === req.params.id);
    if (!comp) return res.status(404).json({ error: "Companion not found" });
    res.json(comp);
  });

  app.post('/api/companions/:id/certify', (req, res) => {
    const { score, passed, signature } = req.body;
    const comp = state.companions.find(c => c.id === req.params.id);
    if (!comp) return res.status(404).json({ error: "Companion not found" });
    comp.isCertified = passed;
    comp.certificationScore = score;
    comp.consents.push('CERTIFICATION_AGREEMENT');
    res.json(comp);
  });

  app.post('/api/companions/:id/consent', (req, res) => {
    const { documentType } = req.body;
    const comp = state.companions.find(c => c.id === req.params.id);
    if (!comp) return res.status(404).json({ error: "Companion not found" });
    if (!comp.consents.includes(documentType)) {
      comp.consents.push(documentType);
    }
    res.json(comp);
  });

  app.post('/api/companions/:id/profile', (req, res) => {
    const comp = state.companions.find(c => c.id === req.params.id);
    if (!comp) return res.status(404).json({ error: 'Companion not found' });
    if (req.body.bio !== undefined) comp.bio = req.body.bio;
    if (req.body.skills !== undefined) comp.skills = req.body.skills;
    res.json({ success: true, companion: comp });
  });

  app.get('/api/admin/companions-metrics', (req, res) => {
    const metrics = state.companions.map(c => {
      const completionRate = c.totalVisits > 0 ? (c.completedVisits / c.totalVisits) * 100 : 0;
      const punctualityRate = c.completedVisits > 0 ? (c.punctualVisits / c.completedVisits) * 100 : 0;
      const avgRating = c.ratings.length ? c.ratings.reduce((a,b)=>a+b,0) / c.ratings.length : 0;
      
      return {
        id: c.id,
        name: c.name,
        riskScore: c.riskScore,
        incidentsCount: c.incidentsCount,
        completionRate: completionRate.toFixed(1),
        punctualityRate: punctualityRate.toFixed(1),
        avgRating: avgRating.toFixed(1),
        status: c.riskScore < 40 ? 'Suspended' : c.riskScore < 70 ? 'Probation' : 'Active',
        skills: c.skills || []
      };
    });
    res.json(metrics);
  });

  app.get('/api/admin/companions/:id/history', (req, res) => {
    const comp = state.companions.find(c => c.id === req.params.id);
    if (!comp) return res.status(404).json({ error: 'Companion not found' });
    const compIncidents = state.incidents.filter(i => i.companionId === req.params.id);
    res.json({ companion: comp, incidents: compIncidents });
  });

  app.get('/api/seniors', (req, res) => {
    res.json(state.seniors);
  });

  app.get('/api/seniors/:id/visits', (req, res) => {
    const sr = state.seniors.find(s => s.id === req.params.id);
    if (!sr) return res.status(404).json({ error: 'Senior not found' });
    const prevVisits = state.visits.filter(v => 
      v.seniorName === sr.name || v.seniorName.includes(sr.name.split(' ')[0])
    );
    res.json({ senior: sr, visits: prevVisits });
  });

  app.post('/api/seniors', (req, res) => {
    const newSenior = {
      id: `SEN-${Math.floor(Math.random()*10000)}`,
      ...req.body
    };
    state.seniors.push(newSenior);
    res.json(newSenior);
  });

  app.get('/api/incidents', (req, res) => {
    res.json(state.incidents);
  });

  app.post('/api/incidents', (req, res) => {
    const newIncident = {
      id: `INC-${Math.floor(Math.random()*10000)}`,
      companionId: req.body.companionId || 'Unknown',
      companionName: req.body.companionName || 'Unknown',
      seniorName: req.body.seniorName || 'Unknown',
      visitId: req.body.visitId || 'Unlinked',
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'open'
    };
    state.incidents.push(newIncident);
    
    const comp = state.companions.find(c => c.id === req.body.companionId);
    if (comp) {
      comp.incidentsCount++;
      updateRiskScore(comp.id);
    }

    res.json(newIncident);
  });

  // Payments & Billing Endpoints
  // Family onboarding (fee to set up the family profile, e.g. $10 onboarding fee + maybe subscription)
  app.post('/api/payments/family/subscribe', async (req, res) => {
    const { tier, yearly } = req.body;
    if (!stripe) {
      return res.json({ url: '/family?mock_subscribe_success=true' });
    }
    try {
      // Determine plan pricing based on tier (Care+ or Family Pro)
      let amount = 0;
      let name = '';
      if (tier === 'care-plus') {
        amount = yearly ? 10800 : 1000;
        name = `Care+ ${yearly ? '(Yearly - 10% off)' : '(Monthly)'}`;
      } else if (tier === 'family-pro') {
        amount = yearly ? 32400 : 3000;
        name = `Family Pro ${yearly ? '(Yearly - 10% off)' : '(Monthly)'}`;
      } else {
         return res.status(400).json({ error: 'Invalid plan selected' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: name },
              unit_amount: amount,
              recurring: { interval: yearly ? 'year' : 'month' },
            },
            quantity: 1,
          },
          // One-time onboarding fee for new families
          {
            price_data: {
              currency: 'usd',
              product_data: { name: `Family Onboarding Fee` },
              unit_amount: 1000, // $10
            },
            quantity: 1,
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}/family?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/family`,
      });
      res.json({ url: session.url });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Family Subscription portal
  app.post('/api/payments/family/portal', async (req, res) => {
    const { sessionId } = req.body;
    if (!stripe) {
      return res.json({ url: '/family?mock_portal=true' });
    }
    try {
      // For demo, we are doing an ad-hoc session because we don't have authenticated customers set up
      // In a real app we'd look up the Stripe customer ID from our DB
      if (sessionId) {
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
        if (checkoutSession.customer) {
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: checkoutSession.customer as string,
            return_url: `${process.env.APP_URL || 'http://localhost:3000'}/family`,
          });
          return res.json({ url: portalSession.url });
        }
      }
      return res.status(400).json({ error: 'No active customer found to launch portal.' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Booking a visit
  app.post('/api/payments/family/book', async (req, res) => {
     const { hours, specialized } = req.body;
     if (!stripe) {
       return res.json({ url: '/family?mock_book_success=true' });
     }
     try {
       const rate = specialized ? 4500 : 3500; // $45 or $35 / hr
       const total = hours * rate;
       const trustFee = Math.round(total * 0.05); // 5% trust & support fee
       const companionCutRate = specialized ? 3000 : 2500; // $30 or $25 / hr
       const companionTotal = hours * companionCutRate;

       const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: [
            {
               price_data: { currency: 'usd', product_data: { name: `CareCompana Visit (${hours} hrs${specialized ? ' - Tier 2 Premium/Specialized Care' : ' - Standard Care'})` }, unit_amount: total },
               quantity: 1,
            },
            {
               price_data: { currency: 'usd', product_data: { name: "Trust & Support Fee (5%)" }, unit_amount: trustFee },
               quantity: 1,
            }
         ],
         mode: 'payment',
         // NOTE: For fully implemented Stripe Connect (Destination charges), we would provide:
         // payment_intent_data: { transfer_data: { destination: 'acct_1OuXXXXXX' }, application_fee_amount: total - companionTotal + trustFee },
         // Since we don't have a real Stripe connected account ID in this mock environment, we comment it out
         // to avoid failing the session creation with "invalid destination".
         success_url: `${process.env.APP_URL || 'http://localhost:3000'}/family?booking_success=true`,
         cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/family`,
       });
       res.json({ url: session.url });
     } catch(e: any) {
       res.status(500).json({ error: e.message });
     }
  });

  // Companion Onboarding Fee and Stripe Connect Link
  app.post('/api/payments/companion/onboarding', async (req, res) => {
    if (!stripe) {
       return res.json({ url: '/companion?mock_onboard_success=true' });
    }
    try {
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: { name: "Background Check (Checkr) & Certification Review Fee" },
                unit_amount: 2500, // $25
              },
              quantity: 1
            }
         ],
         mode: 'payment',
         success_url: `${process.env.APP_URL || 'http://localhost:3000'}/companion?onboarding_paid=true`,
         cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/companion`,
      });
      res.json({ url: session.url });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/payments/companion/connect', async (req, res) => {
    if (!stripe) {
      return res.json({ url: '/companion?mock_connect_success=true' });
    }
    try {
      // In reality, this would create an account: await stripe.accounts.create({ type: 'express' })
      // and then create an accountLink.
      // We will pretend we generated the connect onboarding link
      res.json({ url: '/companion?connect_success=true' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

const appPromise = startServer();

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  app(req, res);
}
