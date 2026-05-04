import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, User, Settings, Filter, Shield, Activity, Calendar, MessageSquare, ChevronRight, MapPin, Star, Laptop, Heart, Globe, BookOpen, AlertCircle, CheckCircle2, Clock, Send, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

export default function CompanionDashboard() {
  const { jobs, companions, currentUser, seniors } = useStore();
  const [activeTab, setActiveTab] = useState<'mission' | 'profile' | 'schedule' | 'comms'>('mission');
  const [isAvailable, setIsAvailable] = useState(true);
  const [filterPriority, setFilterPriority] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: 'Dedicated professional caregiver with a focus on cognitive support and empathetic companionship. Standardized protocol adherence certified.',
    skills: ['Dementia Care', 'Medication Management', 'Mobility Assistance'],
    languages: ['English', 'Spanish'],
    certifications: ['CNA', 'BLS', 'Alzheimer\'s Association Specialist']
  });

  // Calendar State
  const [blockedDates, setBlockedDates] = useState(['2026-05-12', '2026-05-15']);

  // Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'family', text: 'Hi Sarah, just checking if you saw the note about the new medication schedule?', time: '09:40 AM' },
    { id: 2, sender: 'companion', text: 'Hi! Yes, I reviewed the Daily Care Plan update. I will ensure the 10 AM dose is administered as requested.', time: '09:45 AM' },
    { id: 3, sender: 'family', text: 'Great, thank you so much. Eleanor really appreciates your help.', time: '09:47 AM' }
  ]);

  const availableJobs = jobs.filter(j => j.status === 'pending');

  const toggleDate = (dateStr: string) => {
    if (blockedDates.includes(dateStr)) {
      setBlockedDates(blockedDates.filter(d => d !== dateStr));
    } else {
      setBlockedDates([...blockedDates, dateStr]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, {
      id: Date.now(),
      sender: 'companion',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatMessage('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Dynamic Status Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
             <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-16 h-16 rounded-2xl grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Avatar" />
             <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-slate-950", isAvailable ? "bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-slate-700")} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Sarah Chen <span className="text-slate-700">/ Senior Associate</span></h1>
            <div className="flex items-center gap-4 mt-1">
               <div className="flex items-center gap-1.5 text-warning font-mono text-[11px] font-bold">
                  4.9 <Star className="w-3 h-3 fill-current" />
               </div>
               <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Protocol ID: COMP-7729</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
           <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-2">Broadcast Status</span>
           <button 
             onClick={() => setIsAvailable(!isAvailable)}
             className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
               isAvailable ? "bg-success text-white shadow-lg shadow-success/20" : "bg-slate-800 text-slate-500"
             )}
           >
             {isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
             {isAvailable ? 'Available' : 'Invisible'}
           </button>
        </div>
      </header>

      {/* High-priority Alert (Simulated Push) */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
             <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center justify-between shadow-2xl relative group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center animate-pulse">
                      <AlertCircle className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Priority Matching Protocol</h4>
                      <p className="text-xs text-primary font-medium mt-0.5">Urgent: Dementia support requested within 1.2 miles of your current location.</p>
                   </div>
                </div>
                <button onClick={() => setShowNotification(false)} className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors">Dismiss</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Matrix */}
      <div className="flex border-b border-slate-800 gap-8 px-2 overflow-x-auto whitespace-nowrap">
         {[
           { id: 'mission', label: 'Active Missions', icon: Activity },
           { id: 'profile', label: 'Identity & Gear', icon: User },
           { id: 'schedule', label: 'Cycle Protocol', icon: Calendar },
           { id: 'comms', label: 'Comms Uplink', icon: MessageSquare }
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
               <motion.div layoutId="tab-active-comp" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
             )}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'mission' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Nearby Assignments</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-400 font-bold">{availableJobs.length} Live</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setFilterPriority(!filterPriority)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                          filterPriority ? "bg-primary/20 text-primary border border-primary/30" : "bg-slate-900 border border-slate-800 text-slate-500"
                        )}
                      >
                         Priority Only
                      </button>
                      <button className="bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-slate-500 hover:text-white">
                         <Filter className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {availableJobs.map(job => {
                     const senior = seniors.find(s => s.id === job.seniorId);
                     return (
                       <div key={job.id} onClick={() => setSelectedJob(job)} className="glass-card p-6 group hover:translate-x-1 transition-all cursor-pointer">
                          <div className="flex items-start justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:border-primary/50 transition-colors">
                                   <MapPin className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                   <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-lg font-bold text-white">{senior?.name}</h4>
                                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-500 font-mono">{job.distance}</span>
                                   </div>
                                   <p className="text-xs text-slate-400">{senior?.condition}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-1">$28.50/hr</p>
                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Network standard</p>
                             </div>
                          </div>
                          <div className="mt-6 flex items-center justify-between border-t border-slate-800/50 pt-6">
                             <div className="flex gap-2">
                                {job.reqSkills.map(skill => (
                                  <span key={skill} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary font-bold uppercase tracking-wider">{skill}</span>
                                ))}
                             </div>
                             <div className="flex items-center gap-3">
                               <button className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white">View Intel</button>
                               <button className="btn-primary px-6 py-2 text-[10px] font-bold uppercase tracking-widest">Accept Mission</button>
                             </div>
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>

             {/* Side Panel: Active Engagement */}
             <div className="space-y-6">
                <div className="glass-card p-6 bg-primary/5 border-primary/20 ring-1 ring-primary/20">
                   <div className="flex items-center gap-3 mb-6">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="text-xs uppercase tracking-widest font-black text-primary">Compliance Status</h3>
                   </div>
                   <div className="space-y-4">
                      <ComplianceIndicator label="Checkr Verified" status="current" />
                      <ComplianceIndicator label="Mask Protocol" status="active" />
                      <ComplianceIndicator label="Credential Sync" status="synced" />
                   </div>
                   <button className="w-full mt-6 py-3 border border-primary text-primary text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10">
                      Sync Credentials
                   </button>
                </div>

                <div className="glass-card p-6">
                   <h3 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-6">Cycle Performance</h3>
                   <div className="space-y-6">
                      <PerformanceStat label="Match Acceptance" value="92%" />
                      <PerformanceStat label="Avg Response" value="1.4m" />
                      <PerformanceStat label="Trust Score" value="99.8" />
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto w-full">
             <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Protocol Metadata</h2>
                   <button 
                     onClick={() => {
                       if (isEditing) {
                         if (window.confirm("Confirm identity data update?")) {
                           setIsEditing(false);
                         }
                       } else {
                         setIsEditing(true);
                       }
                     }}
                     className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", isEditing ? "bg-success text-white" : "border border-slate-800 text-slate-400 hover:text-white")}
                   >
                      {isEditing ? 'Commit Changes' : 'Modify Identity'}
                   </button>
                </div>

                <div className="space-y-8">
                   <ProfileField 
                     label="Operational Bio" 
                     icon={BookOpen}
                     value={profileData.bio}
                     isEditing={isEditing}
                     onChange={(v) => setProfileData({...profileData, bio: v})}
                   />
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ProfileTagField 
                        label="Validated Skillset" 
                        icon={Heart}
                        tags={profileData.skills}
                        isEditing={isEditing}
                        onChange={(v) => setProfileData({...profileData, skills: v})}
                      />
                      <ProfileTagField 
                        label="Linguistic Capability" 
                        icon={Globe}
                        tags={profileData.languages}
                        isEditing={isEditing}
                        onChange={(v) => setProfileData({...profileData, languages: v})}
                      />
                   </div>

                   <ProfileTagField 
                      label="Active Certifications" 
                      icon={Shield}
                      tags={profileData.certifications}
                      isEditing={isEditing}
                      onChange={(v) => setProfileData({...profileData, certifications: v})}
                      fullWidth
                   />
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto w-full">
             <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Cycle Management</h2>
                   <div className="flex gap-2">
                      <span className="text-[10px] px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold">UTC-8</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-7 gap-4">
                   {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                     <div key={d} className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">{d}</div>
                   ))}
                   {Array.from({ length: 31 }).map((_, i) => {
                     const isBlocked = blockedDates.includes(`2026-05-${(i+1).toString().padStart(2, '0')}`);
                     return (
                       <button 
                         key={i} 
                         onClick={() => toggleDate(`2026-05-${(i+1).toString().padStart(2, '0')}`)}
                         className={cn(
                           "aspect-square rounded-2xl border flex items-center justify-center text-xs font-mono transition-all",
                           isBlocked 
                            ? "bg-danger/10 border-danger/30 text-danger" 
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-primary/50"
                         )}
                       >
                          {(i + 1).toString().padStart(2, '0')}
                       </button>
                     )
                   })}
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500 uppercase font-bold tracking-widest">
                   <span>Blocked Dates Intensity: High</span>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-danger"></div> Unavailable</div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-800"></div> System Baseline</div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'comms' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto w-full h-[600px] flex flex-col">
             <div className="glass-card flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                         <User className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-sm font-bold text-white">Smith Family Admin</h3>
                         <p className="text-[10px] text-success uppercase font-bold tracking-widest">Secure Uplink Alpha</p>
                      </div>
                   </div>
                   <button className="text-slate-500 hover:text-white transition-colors">
                      <Info className="w-5 h-5" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   {chatHistory.map(msg => (
                     <div key={msg.id} className={cn(
                       "flex flex-col max-w-[80%]",
                       msg.sender === 'companion' ? "ml-auto items-end" : "mr-auto items-start"
                     )}>
                        <div className={cn(
                           "p-4 rounded-2xl text-xs leading-relaxed",
                           msg.sender === 'companion' 
                             ? "bg-primary text-white" 
                             : "bg-slate-900 border border-slate-800 text-slate-300"
                        )}>
                           {msg.text}
                        </div>
                        <span className="mt-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">{msg.time}</span>
                     </div>
                   ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800">
                   <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type secure message..." 
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-primary outline-none transition-all shadow-inner"
                      />
                      <button type="submit" className="bg-primary hover:bg-primary-dark p-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                         <Send className="w-5 h-5 text-white" />
                      </button>
                   </div>
                </form>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal (Simulated) */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedJob(null)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative glass-card w-full max-w-2xl bg-slate-900 overflow-hidden shadow-2xl ring-1 ring-white/10"
             >
                <div className="h-32 bg-gradient-to-r from-primary/20 to-success/20 relative">
                   <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                      <AlertCircle className="w-8 h-8 rotate-45" />
                   </button>
                </div>
                <div className="p-8 -mt-12">
                   <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
                      <div className="flex items-center gap-6 mb-8">
                         <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800">
                            <User className="w-10 h-10 text-slate-600" />
                         </div>
                         <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{seniors.find(s => s.id === selectedJob.seniorId)?.name}</h2>
                            <div className="flex gap-4">
                               <p className="text-xs text-slate-400 font-medium">Family: <span className="text-primary">The Smiths</span></p>
                               <p className="text-xs text-slate-400 font-medium">Location: <span className="text-primary">{selectedJob.distance}</span></p>
                            </div>
                         </div>
                      </div>
                      
                      <div className="space-y-6">
                         <div>
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Requirement Protocol</h4>
                            <div className="flex flex-wrap gap-2">
                               {selectedJob.reqSkills.map((s: string) => (
                                 <span key={s} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s}</span>
                               ))}
                            </div>
                         </div>
                         
                         <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                               "Senior requires support with morning mobility and memory recall exercises. Preference for companions who can discuss gardening or history."
                            </p>
                         </div>
                      </div>

                      <div className="mt-12 flex gap-4">
                         <button onClick={() => setSelectedJob(null)} className="flex-1 py-4 bg-slate-900 text-slate-400 text-xs font-bold rounded-2xl uppercase tracking-widest transition-all hover:bg-slate-800">Close Dossier</button>
                         <button className="flex-2 py-4 bg-primary text-white text-xs font-bold rounded-2xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20">Accept Assignment</button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComplianceIndicator({ label, status }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
       <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-success uppercase font-black">{status}</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
       </div>
    </div>
  );
}

function PerformanceStat({ label, value }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
       <span className="text-sm font-mono font-bold text-white">{value}</span>
    </div>
  );
}

function ProfileField({ label, icon: Icon, value, isEditing, onChange }: any) {
  return (
    <div className="space-y-3">
       <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-600" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
       </div>
       {isEditing ? (
         <textarea 
           value={value}
           onChange={(e) => onChange(e.target.value)}
           className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:border-primary outline-none min-h-[100px] transition-all"
         />
       ) : (
         <div className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-2xl text-xs text-slate-400 leading-relaxed italic">
            "{value}"
         </div>
       )}
    </div>
  );
}

function ProfileTagField({ label, icon: Icon, tags, isEditing, onChange, fullWidth }: any) {
  return (
    <div className={cn("space-y-3", fullWidth ? "col-span-full" : "")}>
       <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-600" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
       </div>
       <div className="flex flex-wrap gap-2">
          {tags.map((tag: string, i: number) => (
            <div key={i} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-400">
               {tag}
               {isEditing && (
                 <button onClick={() => onChange(tags.filter((_: any, idx: any) => idx !== i))} className="text-slate-600 hover:text-danger">&times;</button>
               )}
            </div>
          ))}
          {isEditing && (
            <button className="px-3 py-1.5 rounded-full border border-dashed border-slate-700 text-slate-600 text-[10px] font-bold uppercase hover:border-primary hover:text-primary transition-all">+ Add New</button>
          )}
       </div>
    </div>
  );
}
