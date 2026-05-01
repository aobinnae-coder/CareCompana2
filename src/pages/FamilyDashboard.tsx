import React, { useEffect, useState } from 'react';
import { Calendar, User, Clock, Heart, AlertCircle, ArrowRight, Star, MapPin, CreditCard, Check, X, MessageSquare, Bell, FileText, Upload, Brain, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FamilyDashboard() {
  const [visit, setVisit] = useState<any>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingHours, setBookingHours] = useState(2);
  const [bookingSpecialized, setBookingSpecialized] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'basic' | 'care-plus' | 'family-pro'>('basic');
  const [isYearly, setIsYearly] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed mind');
  const [showChat, setShowChat] = useState(false);
  const [chatType, setChatType] = useState<'companion' | 'support'>('companion');
  const [companionMessages, setCompanionMessages] = useState([
    { id: 1, sender: 'companion', text: 'Hi! I am en route and should be there in 15 mins.', time: '09:45 AM' },
    { id: 2, sender: 'family', text: 'Great, thanks for letting me know. The door is unlocked.', time: '09:47 AM' }
  ]);
  const [supportMessages, setSupportMessages] = useState([
    { id: 1, sender: 'support', text: 'Hi there! How can CompanaConnect support you today?', time: '08:00 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadedFiles] = useState([
    { name: 'Daily Care Plan.pdf', size: '2.4 MB', date: 'Oct 12' },
    { name: 'Medical Directives.pdf', size: '1.1 MB', date: 'Oct 10' }
  ]);

  const fetchVisits = () => {
    fetch('/api/visits')
      .then(res => res.json())
      .then(data => {
        const active = data.find((v: any) => v.id === 'VST-8821');
        if (active) setVisit(active);
      })
      .catch(err => console.log('Network error fetching visits:', err.message));
  };

  useEffect(() => {
    fetchVisits();
    // Check URL for stripe success
    const params = new URLSearchParams(window.location.search);
    if (params.get('booking_success') || params.get('mock_booking_success')) {
      alert("Payment successful! Your visit has been booked.");
      window.history.replaceState({}, '', '/family');
    }
    if (params.get('session_id') || params.get('mock_subscribe_success')) {
      alert("Subscription activated successfully!");
      setSubscriptionTier('care-plus'); // Simple mock upgrade
      window.history.replaceState({}, '', '/family');
    }
    if (params.get('mock_portal')) {
      alert("Mock Billing Portal opened. (Stripe is not configured)");
      window.history.replaceState({}, '', '/family');
    }
    const int = setInterval(fetchVisits, 3000);
    return () => clearInterval(int);
  }, []);

  const handleCancelClick = () => {
    if (!visit) return;
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!visit) return;
    const res = await fetch(`/api/visits/${visit.id}/cancel`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: cancelReason })
    }).catch(err => { console.log(err.message); return null; });
    if (!res) return;
    const data = await res.json();
    setShowCancelModal(false);
    if (data.penaltyApplied) alert("Late cancellation penalty applied (24h policy).");
    fetchVisits();
  };

  const submitRating = async (r: number) => {
    setRating(r);
    await fetch(`/api/visits/${visit.id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: r })
    }).catch(err => console.log(err.message));
    fetchVisits();
  };

  const handleBookVisit = async () => {
    const res = await fetch('/api/payments/family/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours: bookingHours, specialized: bookingSpecialized })
    }).catch(err => { console.log(err.message); return null; });
    if (!res) return;
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const handleSubscribe = async (tier: string, yearly: boolean) => {
    const res = await fetch('/api/payments/family/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, yearly })
    }).catch(err => { console.log(err.message); return null; });
    if (!res) return;
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const handleManageBilling = async () => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id') || 'mock_session_123'; // In real app, derived from DB
    const res = await fetch('/api/payments/family/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    }).catch(err => { console.log(err.message); return null; });
    if (!res) return;
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
       {/* Booking Modal */}
       {showBookingModal && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
              <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              <h2 className="text-xl font-bold text-white mb-2">Book New Visit</h2>
              <p className="text-slate-400 text-sm mb-6">Select duration and care type.</p>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                 <Brain className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">AI Matchmaking Enabled</h4>
                    <p className="text-[10px] text-blue-200/70">Our engine uses your senior's profile, language preference, and personality traits to automatically match with the perfect companion.</p>
                 </div>
              </div>
              
              <div className="space-y-4 mb-6">
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Duration (Hours)</label>
                   <input type="number" min="1" max="12" value={bookingHours} onChange={e => setBookingHours(parseInt(e.target.value) || 1)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                 </div>
                 <div>
                   <label className="flex items-center gap-3 p-3 border border-slate-800 rounded-xl bg-slate-950 cursor-pointer hover:border-slate-700 transition-colors">
                     <input type="checkbox" checked={bookingSpecialized} onChange={e => setBookingSpecialized(e.target.checked)} className="w-5 h-5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900" />
                     <div>
                       <p className="text-sm font-bold text-white">Tier 2 Specialized Care</p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-wider">For Dementia, Alzheimer's, etc.</p>
                     </div>
                   </label>
                 </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 mb-6 space-y-2 text-sm text-slate-300">
                 <div className="flex justify-between">
                   <span>Hourly Rate ({bookingSpecialized ? 'Specialized' : 'Standard'})</span>
                   <span>${bookingSpecialized ? '45' : '35'}/hr</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Hours</span>
                   <span>x {bookingHours}</span>
                 </div>
                 <div className="flex justify-between text-slate-500 border-b border-slate-800 pb-2">
                   <span>Trust & Support Fee (10%)</span>
                   <span>${(bookingHours * (bookingSpecialized ? 45 : 35) * 0.10).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between font-bold text-white pt-2">
                   <span>Total</span>
                   <span>${(bookingHours * (bookingSpecialized ? 45 : 35) * 1.10).toFixed(2)}</span>
                 </div>
              </div>

              <button onClick={handleBookVisit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> Check out with Stripe
              </button>
           </div>
         </div>
       )}

       {/* Cancel Modal */}
       {showCancelModal && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative">
             <button onClick={() => setShowCancelModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
             <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-white mb-2">Cancel Visit?</h2>
             <p className="text-slate-400 text-sm mb-6">Cancellations under 24 hours may incur a penalty.</p>
             
             <div className="text-left mb-6">
               <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider">Reason for Cancellation</label>
               <select 
                 value={cancelReason} 
                 onChange={e => setCancelReason(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
               >
                 <option value="Changed mind">Changed mind</option>
                 <option value="No longer needed">No longer needed / Schedule changed</option>
                 <option value="Found alternative care">Found alternative care</option>
                 <option value="Senior is unwell/hospitalized">Senior is unwell/hospitalized</option>
                 <option value="Other">Other</option>
               </select>
             </div>

             <div className="flex gap-4">
               <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">
                 Keep Visit
               </button>
               <button onClick={confirmCancel} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">
                 Confirm Cancel
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Rating Modal */}
       {visit && visit.status === 'completed' && visit.rating === null && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-2">Rate Your Visit</h2>
              <p className="text-slate-400 text-sm mb-6">How was {visit.companionName}'s visit with {visit.seniorName} today?</p>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} onClick={() => submitRating(r)} disabled={rating !== null} className={`p-2 rounded-full ${rating === r ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'} transition-colors`}>
                    <Star className={`w-8 h-8 ${rating && r <= rating ? 'fill-white text-white' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>
              {rating !== null && <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider">Rating submitted!</p>}
           </div>
         </div>
       )}

       <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-light text-white">Family Dashboard</h1>
          <p className="text-slate-500 mt-1">Managing care for <span className="text-blue-400">{visit ? visit.seniorName : 'Eleanor'}</span>. Subscription: <span className="text-blue-400">Care+</span></p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="text-right">
             <p className="text-[10px] uppercase text-slate-500 tracking-wider mb-1">Safety Posture</p>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-sm font-bold text-emerald-500">SECURE & VERIFIED</span>
             </div>
          </div>
          <button onClick={() => setShowBookingModal(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow font-bold hover:bg-blue-700 transition-all text-xs ms-4 uppercase tracking-widest">
            Book New Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative flex flex-col overflow-hidden">
            <h4 className="text-sm font-bold text-white mb-6 flex justify-between items-center z-10 uppercase tracking-wider">
              {visit && ['en_route', 'arrived', 'in_progress'].includes(visit.status) ? 'Active Live Visit' : 'Upcoming Visit'}
              <span onClick={() => alert("Calendar view is coming soon!")} className="text-blue-500 text-[10px] uppercase cursor-pointer tracking-wider font-bold hover:text-blue-400">View Calendar</span>
            </h4>
            
            {visit ? (
              <div className="relative z-10">
                <div className="flex items-start gap-4 p-4 border border-white/5 bg-slate-950 rounded-2xl relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${visit.status === 'in_progress' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Companion`} alt="Companion" className="w-16 h-16 rounded-full bg-slate-800 border border-white/10" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-white text-lg">Companionship</h3>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-md tracking-wider border uppercase ${visit.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'bg-blue-600/20 text-blue-400 border-blue-500/20'}`}>
                        {visit.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-400 font-bold mt-1">{visit.companionName} <span className="text-slate-400 font-normal ml-1">(★ 4.9)</span></p>
                    <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-2 font-mono">
                      <Clock className="w-3 h-3" /> Scheduled for {new Date(visit.scheduledFor).toLocaleDateString()}
                    </p>
                    
                    {visit.status === 'pending' && (
                      <button onClick={handleCancelClick} className="mt-4 px-4 py-2 bg-red-600/10 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-red-500/20 hover:bg-red-600/20 transition-colors">
                        Cancel Visit
                      </button>
                    )}
                  </div>
                </div>
                {/* Live Tracking map mock if active */}
                {['en_route', 'arrived', 'in_progress'].includes(visit.status) && (
                  <div className="mt-4 h-48 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 bg-[#0f172a] opacity-50">
                       <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                       {/* Mock Route Line */}
                       <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <path d="M 50,150 Q 150,50 350,100 T 600,80" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 4" className="animate-pulse" />
                       </svg>
                    </div>
                    
                    <div className="z-10 flex flex-col items-center gap-3 bg-slate-800/90 p-4 rounded-xl border border-slate-700 backdrop-blur-md shadow-xl w-3/4 text-center">
                       <MapPin className="text-blue-400 w-8 h-8 animate-bounce mb-1" />
                       <div className="flex flex-col">
                         <span className="text-xs font-bold text-white uppercase tracking-widest">Live GPS Routing active</span>
                         <span className="text-[10px] text-slate-400 font-mono mt-1">Companion is en route • ETA: 12 mins (1.4 mi)</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
               <p className="text-slate-500 text-sm">No upcoming visits found.</p>
            )}
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <FileText className="w-4 h-4" />
                   </div>
                   <h4 className="text-sm font-bold text-white uppercase tracking-wider">Secure File Hub</h4>
                </div>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2">
                   <Upload className="w-3 h-3" /> Upload
                </button>
             </div>
             <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">HIPAA-compliant document storage for medical directives, daily care plans, and emergency contacts. Shared securely with assigned companions.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {uploadedFiles.map((file, i) => (
                   <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex justify-between items-center group hover:border-slate-600 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white truncate max-w-[120px]">{file.name}</p>
                            <p className="text-[10px] text-slate-500">{file.size} • {file.date}</p>
                         </div>
                      </div>
                      <button className="text-purple-500 text-[10px] uppercase font-bold tracking-wider hover:text-purple-400">View</button>
                   </div>
                ))}
             </div>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 overflow-hidden">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Recent Visit AI Summary
            </h4>
            {visit && visit.status === 'completed' && visit.summary ? (
              <div>
                <div className="space-y-4 text-slate-400">
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{visit.summary}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Summary will appear here after the visit is completed.</p>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col text-center items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4">7-Day Wellness Score</p>
             {subscriptionTier === 'basic' ? (
                <div className="flex flex-col items-center justify-center py-6">
                   <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 opacity-50">
                     <Heart className="w-8 h-8 text-slate-500" />
                   </div>
                   <p className="text-xs text-slate-400">Available on Care+ and Pro plans.</p>
                   <button onClick={() => setSubscriptionTier('care-plus')} className="mt-3 text-[10px] uppercase font-bold tracking-wider text-blue-500 hover:text-blue-400">Mock Upgrade</button>
                </div>
             ) : (
                <>
                  <div className="relative flex items-center justify-center">
                     <svg className="w-32 h-32 transform -rotate-90">
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset="65.5" className="text-blue-500" />
                     </svg>
                     <span className="absolute text-4xl font-light text-white">82</span>
                  </div>
                  <p className="mt-4 text-xs font-medium text-white">OPTIMAL CONDITION</p>
                  <p className="text-[11px] text-green-500 mt-1">↑ 4 pts this week</p>
                </>
             )}
           </section>

           <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                 <AlertCircle className="w-4 h-4" />
               </div>
               <h4 className="text-sm font-bold text-white uppercase tracking-wider">Emergency</h4>
             </div>
             <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">Trigger an immediate welfare check or contact emergency services directly through the platform.</p>
             <button onClick={() => alert("Welfare check triggered. We have dispatched local emergency services or care managers to the senior's location.")} className="w-full mt-auto py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-xs font-bold rounded-xl border border-red-500/30 transition-all uppercase tracking-widest">
               Trigger Welfare Check
             </button>
           </section>

           <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <CreditCard className="w-4 h-4" />
               </div>
               <h4 className="text-sm font-bold text-white uppercase tracking-wider">Subscription & Billing</h4>
             </div>
             <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
               You are currently on the <strong className="text-white">Basic</strong> tier. Upgrade for lower fees and premium priority support.
             </p>
             <div className="flex items-center justify-center mb-4 gap-2">
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${!isYearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                 <button 
                  onClick={() => setIsYearly(!isYearly)} 
                  className={`w-10 h-5 rounded-full p-1 transition-colors relative ${isYearly ? 'bg-blue-600' : 'bg-slate-700'}`}
                 >
                   <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isYearly ? 'translate-x-5' : 'translate-x-0'}`} />
                 </button>
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${isYearly ? 'text-white' : 'text-slate-500'}`}>Yearly (-20%)</span>
              </div>
             <div className="space-y-2 mt-auto">
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => handleSubscribe('care-plus', isYearly)} className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg border border-blue-500/30 transition-all uppercase tracking-widest">
                   Care+ ({isYearly ? '$96/yr' : '$10/mo'})
                 </button>
                 <button onClick={() => handleSubscribe('family-pro', isYearly)} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest">
                   Pro ({isYearly ? '$288/yr' : '$30/mo'})
                 </button>
               </div>
               <button onClick={handleManageBilling} className="w-full mt-2 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all uppercase tracking-widest">
                 Manage Billing Portal
               </button>
             </div>
           </section>
        </div>
      </div>
      {/* Real-time Chat Floating Widget */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-80 bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden">
          <div className="bg-blue-600 p-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30">
                  {chatType === 'companion' ? <User className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                   <p className="text-white font-bold text-sm leading-tight">{chatType === 'companion' ? 'Companion Chat' : 'Support Team'}</p>
                   <p className="text-blue-100/80 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 mt-0.5"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Online</p>
                </div>
             </div>
             <button onClick={() => setShowChat(false)} className="text-blue-200 hover:text-white transition-colors p-1"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex bg-slate-800 border-b border-slate-700">
             <button 
                onClick={() => setChatType('companion')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${chatType === 'companion' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
                Companion
             </button>
             <button 
                onClick={() => setChatType('support')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${chatType === 'support' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
                Support
             </button>
          </div>

          <div className="p-4 h-64 overflow-y-auto space-y-4 bg-slate-950 flex flex-col">
             <div className="text-center">
                <span className="bg-slate-900 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Today</span>
             </div>
             {(chatType === 'companion' ? companionMessages : supportMessages).map(m => (
                <div key={m.id} className={`max-w-[85%] p-3 text-xs ${m.sender === 'family' ? 'bg-blue-600 text-white self-end rounded-2xl rounded-br-sm' : 'bg-slate-800 border border-slate-700 text-slate-300 self-start rounded-2xl rounded-bl-sm'}`}>
                   <p className="leading-relaxed">{m.text}</p>
                   <p className={`text-[8px] mt-1.5 font-bold tracking-wider ${m.sender === 'family' ? 'text-blue-200/70 text-right' : 'text-slate-500 text-left'}`}>{m.time}</p>
                </div>
             ))}
          </div>
          <div className="p-3 bg-slate-900 border-t border-slate-800">
             <div className="relative">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)} 
                  onKeyDown={(e) => { 
                    if(e.key === 'Enter' && newMessage) { 
                      const msg = {id: Date.now(), sender:'family', text: newMessage, time: 'Just now'};
                      if (chatType === 'companion') setCompanionMessages([...companionMessages, msg]);
                      else setSupportMessages([...supportMessages, msg]);
                      setNewMessage(''); 
                    } 
                  }} 
                  placeholder={`Message ${chatType}...`} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-white text-xs outline-none focus:border-blue-500 shadow-inner" 
                />
                <button onClick={() => {
                   if(newMessage) {
                    const msg = {id: Date.now(), sender:'family', text: newMessage, time: 'Just now'};
                    if (chatType === 'companion') setCompanionMessages([...companionMessages, msg]);
                    else setSupportMessages([...supportMessages, msg]);
                    setNewMessage('');
                   }
                }} className="absolute right-2 top-2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                  <svg className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
             </div>
          </div>
        </div>
      )}
      
      {/* Floating Chat Button */}
      {!showChat && (
        <button onClick={() => setShowChat(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-[0_10px_25px_rgba(37,99,235,0.5)] flex items-center justify-center text-white transition-all hover:scale-105 z-40 border border-blue-400/30">
           <MessageSquare className="w-6 h-6" />
           <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">1</span>
        </button>
      )}

    </div>
  );
}
