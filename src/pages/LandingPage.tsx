import React from 'react';
import { motion } from 'motion/react';
import { Shield, Heart, Users, ArrowRight, CheckCircle2, Terminal, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary/30">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl z-[100] px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight font-display uppercase tracking-widest">Compana</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Connect v2.0</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#solutions" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Solutions</a>
            <a href="#trust" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Trust & Safety</a>
            <Link to="/auth" className="btn-primary py-2 px-6 text-[10px]">Access Portal</Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[120px] rounded-full -mt-24 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-8 relative">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-8"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Next-Gen Care Infrastructure</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-display font-bold text-white leading-[0.9] tracking-tight mb-8"
              >
                Care, <span className="text-slate-800">Coded with</span> Integrity.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-400 leading-relaxed max-w-xl mb-12"
              >
                The primary network connecting families, professional companions, and enterprise administrators through verified trust protocols.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/family" className="btn-primary py-5 px-10 text-xs uppercase tracking-widest flex items-center justify-center gap-3 group">
                   Found a Family Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/companion" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white py-5 px-10 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-3">
                   Apply as Companion <Globe className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stakeholder Grid */}
        <section id="solutions" className="py-24 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/admin" className="group glass-card p-10 hover:border-primary/50 transition-all">
                <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                  <Shield className="w-7 h-7 text-slate-600 group-hover:text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Command Unit</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Enterprise dashboard for platform admins to monitor safety, manage incidents, and verify companion certifications at scale.
                </p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary group-hover:underline flex items-center gap-1">Enter HQ <ChevronRight className="w-3 h-3" /></span>
              </Link>

              <Link to="/family" className="group glass-card p-10 hover:border-success/50 transition-all bg-success/5">
                <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-success/10 group-hover:border-success/30 transition-all">
                  <Heart className="w-7 h-7 text-slate-600 group-hover:text-success" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Family Hub</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  A sanctuary for families to monitor senior wellbeing, communicate with verified companions, and manage sessions in real-time.
                </p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-success group-hover:underline flex items-center gap-1">Launch Hub <ChevronRight className="w-3 h-3" /></span>
              </Link>

              <Link to="/companion" className="group glass-card p-10 hover:border-warning/50 transition-all">
                <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-warning/10 group-hover:border-warning/30 transition-all">
                  <Users className="w-7 h-7 text-slate-600 group-hover:text-warning" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Portal</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Dedicated interface for professional companions to manage assignments, certifications, and high-fidelity communication with families.
                </p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-warning group-hover:underline flex items-center gap-1">Access Portal <ChevronRight className="w-3 h-3" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-24 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
               <h2 className="text-4xl font-display font-bold text-white mb-8">Designed for <span className="text-primary italic">Extreme Reliability</span></h2>
               <div className="space-y-6">
                 <Feature label="Biometric ID Verification" description="Every companion undergoes rigorous identity scrubbing via Persona/FCRA standards." />
                 <Feature label="Live Wellness Sync" description="Real-time vital and emotional state monitoring through the Family Control Deck." />
                 <Feature label="Incident Response" description="Direct line to Trust & Safety Command Unit for all emergency protocols." />
               </div>
            </div>
            <div className="flex-1 glass-card p-1 bg-slate-800/20 overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80" className="rounded-3xl opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Interface" />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-8 text-center text-slate-600">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-4">Compana Connect &bull; Trust Infrastructure &bull; 2026</p>
          <div className="flex justify-center gap-8 text-[10px] uppercase font-bold tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Security Audit</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Ops</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ label, description }: any) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 mt-1">
        <CheckCircle2 className="w-5 h-5 text-success" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">{label}</h4>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return <ArrowRight {...props} />;
}
