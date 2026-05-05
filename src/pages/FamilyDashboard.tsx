import React, { useState } from 'react';
import { Shield, Activity, Heart, Calendar, Plus, MessageSquare, Star, ArrowRight, Clock, FileText, ChevronRight, User, AlertTriangle, CheckCircle2, MapPin, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

export default function FamilyDashboard() {
  const { seniors, jobs, companions, currentUser, setRole } = useStore();
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'sessions' | 'network' | 'profile'>('wellbeing');
  const [showBooking, setShowBooking] = useState(false);

  // Derived stats
  const familySeniors = seniors.filter(s => s.familyAdmin === 'The Smiths' || s.id.startsWith('SNR'));
  const familyJobs = jobs.filter(j => familySeniors.some(s => s.id === j.seniorId));

  return (
    <div className="space-y-8 pb-20">
      {/* Header section with contextual actions */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Heart className="w-5 h-5 text-primary" />
             <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Care Stewardship Terminal</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white leading-none">Family <span className="text-slate-700">/ Control Deck</span></h1>
          <p className="text-slate-400 mt-4 max-w-xl text-sm leading-relaxed">
            Managing holistic care for <span className="text-primary font-bold">Eleanor</span> and <span className="text-primary font-bold">Arthur</span>. Secure gateway to companion networks and health intelligence.
          </p>
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={() => setShowBooking(true)}
             className="btn-primary flex items-center gap-2"
           >
              <Plus className="w-4 h-4" /> Request Visit
           </button>
        </div>
      </header>

      {/* Wellness Insight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {familySeniors.map(senior => (
           <div key={senior.id} className="glass-card p-6 bg-primary/5 border-primary/10 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-12 h-12" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800">
                    <User className="w-6 h-6 text-slate-600" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-white">{senior.name}</h3>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                       <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Normal Vitals</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <WellnessStat label="Engagement Level" value="94%" />
                 <WellnessStat label="Medication Adherence" value="100%" />
                 <WellnessStat label="Network Readiness" value="Optimal" />
              </div>

              <button className="w-full mt-8 py-3 bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold rounded-xl uppercase tracking-widest hover:text-white transition-all">
                 View Wellness History
              </button>
           </div>
         ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 gap-8 px-2">
         {[
           { id: 'wellbeing', label: 'Wellness Intelligence', icon: Activity },
           { id: 'sessions', label: 'Care Operations', icon: Clock },
           { id: 'network', label: 'Companion Network', icon: Shield },
           { id: 'profile', label: 'Family Protocol', icon: FileText }
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={cn(
               "pb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative",
               activeTab === tab.id ? "text-primary" : "text-slate-500 hover:text-slate-300"
             )}
           >
             <tab.icon className="w-3 h-3" />
             {tab.label}
             {activeTab === tab.id && (
               <motion.div layoutId="tab-active-family" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
             )}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'sessions' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
             <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-6">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xs uppercase tracking-widest font-black text-slate-500">Live & Upcoming Sessions</h3>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{familyJobs.length} Operations</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                     {familyJobs.map(job => (
                       <SessionItem key={job.id} job={job} senior={seniors.find(s => s.id === job.seniorId)?.name} />
                     ))}
                   </div>
                </div>

                <div className="glass-card p-6">
                   <h3 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-8">Historical Archive</h3>
                   <div className="space-y-4">
                      <ArchiveItem date="Yesterday" type="Dementia Protocol" senior="Eleanor" companion="Sarah Chen" />
                      <ArchiveItem date="May 12, 2026" type="Mobility Assist" senior="Arthur" companion="David Miller" />
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="glass-card p-6">
                   <h3 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-6">Resource Allocation</h3>
                   <div className="space-y-6">
                      <IntelligenceItem label="Total Hours (Month)" value="42.5h" trend="+12%" icon={Clock} />
                      <IntelligenceItem label="Avg Match Speed" value="1.2m" trend="-4%" icon={Activity} />
                      <IntelligenceItem label="Total Spend (Est)" value="$1,450" trend="Stable" icon={Shield} />
                   </div>
                   <button className="w-full mt-8 py-3 bg-primary text-white text-[10px] font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                      Review Billing Cycle
                   </button>
                </div>

                <div className="glass-card p-6 bg-warning/5 border-warning/20">
                   <div className="flex items-center gap-3 mb-6">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <h3 className="text-xs uppercase tracking-widest font-black text-warning">Security Advisories</h3>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed font-medium">No active security protocols breached. Network remains operating under 256-bit encryption standards.</p>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'network' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Verified Companions</h2>
                   <div className="flex gap-4">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search network..." className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-primary transition-all outline-none" />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {companions.map(companion => (
                     <div key={companion.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-primary/50 transition-all group flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                             <img src={companion.avatar} className="w-12 h-12 rounded-xl grayscale group-hover:grayscale-0 transition-all" alt="" />
                             <span className="text-[10px] font-mono text-slate-600 tracking-widest">{companion.id}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{companion.name}</h3>
                          <div className="flex items-center gap-2 mb-4">
                             <div className="flex items-center gap-1 text-warning text-xs font-bold">
                                {companion.avgRating} <Star className="w-3 h-3 fill-current" />
                             </div>
                             <span className="text-slate-700">&bull;</span>
                             <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{companion.status}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                             {companion.skills.slice(0, 2).map(skill => (
                               <span key={skill} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 font-bold uppercase tracking-wider">{skill}</span>
                             ))}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                           <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Secure Message</button>
                           <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Full Dossier</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal Mock */}
      <AnimatePresence>
        {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowBooking(false)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative glass-card w-full max-w-lg bg-slate-900 overflow-hidden shadow-2xl p-8"
             >
                <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-widest">Session Request</h2>
                <p className="text-sm text-slate-500 mb-8">Initialize new care parameters for matching across the primary network.</p>

                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Protocol Target</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all">
                         {familySeniors.map(s => <option key={s.id}>{s.name}</option>)}
                      </select>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Cycle Date</label>
                         <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all" />
                      </div>
                      <div>
                         <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Duration</label>
                         <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all">
                            <option>2 Hours</option>
                            <option>4 Hours</option>
                            <option>8 Hours</option>
                         </select>
                      </div>
                   </div>

                   <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Specialized Protocol</label>
                      <label className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl cursor-pointer hover:bg-primary/10 transition-all">
                         <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900" />
                         <div>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest">Activate Dementia Care</p>
                            <p className="text-[10px] text-primary/70 mt-0.5">Increases match priority and selects for Level 2 verification.</p>
                         </div>
                      </label>
                   </div>
                </div>

                <div className="mt-12 flex gap-4">
                   <button onClick={() => setShowBooking(false)} className="flex-1 py-4 bg-slate-900 text-slate-400 text-xs font-bold rounded-2xl uppercase tracking-widest transition-all">Abort Request</button>
                   <button className="flex-2 py-4 bg-primary text-white text-xs font-bold rounded-2xl uppercase tracking-widest transition-all shadow-lg shadow-primary/20">Submit to Network</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WellnessStat({ label, value }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
       <span className="text-sm font-mono font-bold text-white">{value}</span>
    </div>
  );
}

function IntelligenceItem({ label, value, trend, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-slate-600" />
          <span className="text-xs text-slate-300 font-medium">{label}</span>
       </div>
       <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-success uppercase tracking-widest">{trend}</span>
          <span className="text-sm font-bold text-white font-mono">{value}</span>
       </div>
    </div>
  );
}

function SessionItem({ job, senior }: any) {
  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group hover:bg-slate-900 transition-all">
       <div className="flex items-center gap-4">
          <div className={cn("w-1.5 h-8 rounded-full", job.status === 'in_progress' ? "bg-success" : "bg-primary")}></div>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="text-[10px] font-mono text-slate-600 font-bold tracking-widest uppercase">{job.id}</span>
               <span className={cn(
                 "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border",
                 job.status === 'in_progress' ? "bg-success/10 text-success border-success/20" : "bg-primary/10 text-primary border-primary/20"
               )}>
                 {job.status.replace('_', ' ')}
               </span>
            </div>
            <h4 className="text-sm font-bold text-white">{senior} &mdash; {job.reqSkills[0]}</h4>
            <div className="flex items-center gap-4 mt-1">
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                  <Calendar className="w-2.5 h-2.5" /> {job.date}
               </div>
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                  <MapPin className="w-2.5 h-2.5" /> 1.2 miles
               </div>
            </div>
          </div>
       </div>
       <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Monitor Live</button>
    </div>
  );
}

function ArchiveItem({ date, type, senior, companion }: any) {
  return (
    <div className="flex items-center justify-between text-xs p-2 hover:bg-slate-800/50 rounded-lg transition-colors border-l border-transparent hover:border-slate-700">
       <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{date}</span>
          <span className="text-white font-bold">{senior} &bull; {type}</span>
       </div>
       <div className="text-right">
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block">Companion</span>
          <span className="text-slate-400 font-medium">{companion}</span>
       </div>
    </div>
  );
}
