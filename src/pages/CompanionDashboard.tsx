import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, User, Settings, Filter, Shield, Activity, Calendar, MessageSquare, ChevronRight, MapPin, Star, Laptop, Heart, Globe, BookOpen, AlertCircle, CheckCircle2, Clock, Send, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, YAxis } from 'recharts';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

function ComplianceIndicator({ label, status, variant = 'success' }: any) {
  const colors: Record<string, string> = {
    success: "text-success",
    warning: "text-warning",
    info: "text-primary",
    danger: "text-danger"
  };

  return (
    <div className="flex items-center justify-between group/comp">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/comp:text-white transition-colors">{label}</span>
       <div className="flex items-center gap-2">
          <span className={cn("text-[9px] font-mono uppercase font-black", colors[variant] || colors.success)}>{status}</span>
          <CheckCircle2 className={cn("w-3.5 h-3.5", colors[variant] || colors.success)} />
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

function StatusCard({ label, status, variant = 'success', icon: Icon, desc }: any) {
  const colors: Record<string, string> = {
    success: "text-success border-success/20 bg-success/5",
    warning: "text-warning border-warning/20 bg-warning/5",
    info: "text-primary border-primary/20 bg-primary/5",
    danger: "text-danger border-danger/20 bg-danger/5"
  };

  return (
    <div className={cn("p-4 rounded-2xl border flex flex-col gap-3 transition-all hover:scale-[1.02]", colors[variant])}>
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Icon className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full">
             <span className="text-[8px] font-black uppercase tracking-widest">{status}</span>
             <CheckCircle2 className="w-2.5 h-2.5" />
          </div>
       </div>
       <p className="text-[9px] opacity-60 font-medium uppercase tracking-widest leading-tight">{desc}</p>
    </div>
  );
}

export default function CompanionDashboard() {
  const { jobs, seniors } = useStore();
  const [activeTab, setActiveTab] = useState<'mission' | 'profile' | 'schedule' | 'comms'>('mission');
  const [isAvailable, setIsAvailable] = useState(true);
  const [filterPriority, setFilterPriority] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Ongoing Trainings
  const trainings = [
    { id: 1, title: 'Advanced Dementia Protocol', status: 'available', hours: 4, points: 200 },
    { id: 2, title: 'Incident De-escalation', status: 'in-progress', hours: 2, progress: 65 },
    { id: 3, title: 'Advanced Medication Management', status: 'available', hours: 6, points: 350 },
  ];

  // Feedback State
  const [familyReviews] = useState([
    { id: 1, family: 'The Smiths', senior: 'Eleanor', rating: 5, comment: 'Sarah was incredible. She really connected with Eleanor and helped us feel at ease during the transition.', date: '2026-04-28' },
    { id: 2, family: 'Johnson Unit', senior: 'Harold', rating: 4, comment: 'Very professional. Sarah handled the mobility exercises perfectly.', date: '2026-04-15' }
  ]);
  const [myFeedback, setMyFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Profile Image State
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop");

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);

  // Simulation: Push priority notification every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const priorityJob = jobs.find(j => j.priority && j.status === 'pending');
      if (priorityJob) {
        const senior = seniors.find(s => s.id === priorityJob.seniorId);
        const id = Date.now();
        setNotifications(prev => [...prev, {
          id,
          title: 'PRIORITY ASSIGNMENT',
          message: `Mission for ${senior?.name || 'Senior'} available now. Payout: $${priorityJob.payout}`,
          type: 'priority'
        }]);
        // Auto-remove after 8 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, 8000);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [jobs, seniors]);

  // Risk Score History (Sparkline Data)
  const riskHistory = [
    { week: 1, score: 2.1 },
    { week: 2, score: 1.8 },
    { week: 3, score: 1.5 },
    { week: 4, score: 1.2 },
  ];

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
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'family', text: 'Hi Sarah, just checking if you saw the note about the new medication schedule?', time: '09:40 AM' },
    { id: 2, sender: 'companion', text: 'Hi! Yes, I reviewed the Daily Care Plan update. I will ensure the 10 AM dose is administered as requested.', time: '09:45 AM' },
    { id: 3, sender: 'family', text: 'Great, thank you so much. Eleanor really appreciates your help.', time: '09:47 AM' }
  ]);

  // Simulated Real-time Comms Loop
  useEffect(() => {
    if (activeTab !== 'comms') return;

    const messages = [
      "Just checking in, is Eleanor awake?",
      "We've added a few items to the grocery list for the next mission.",
      "The primary physician called, everything looks good on the telemetry.",
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 45s
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const reply = {
            id: Date.now(),
            sender: 'family' as const,
            text: messages[Math.floor(Math.random() * messages.length)],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setChatHistory(prev => [...prev, reply]);
        }, 3000);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const availableJobs = jobs
    .filter(j => j.status === 'pending')
    .filter(j => filterPriority ? j.priority : true)
    .sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));

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
    
    const newMessage = {
      id: Date.now(),
      sender: 'companion' as const,
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulate real-time family reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply = {
          id: Date.now() + 1,
          sender: 'family' as const,
          text: "Received! We'll be ready for your visit.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, reply]);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Dynamic Notification Stack */}
      <div className="fixed top-24 right-6 z-[60] flex flex-col gap-4 max-w-sm w-full">
         <AnimatePresence>
            {notifications.map(n => (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-slate-900 border-l-4 border-primary p-4 rounded-xl shadow-2xl ring-1 ring-white/10 flex gap-4"
              >
                 <div className="bg-primary/20 p-2 rounded-lg h-fit">
                    <AlertCircle className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{n.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{n.message}</p>
                 </div>
                 <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))} className="text-slate-600 hover:text-white transition-colors">
                    <AlertCircle className="w-4 h-4 rotate-45" />
                 </button>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Dynamic Status Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
             <img src={profileImage} className="w-16 h-16 rounded-2xl grayscale hover:grayscale-0 transition-all cursor-pointer object-cover" alt="Avatar" />
             <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-slate-950", isAvailable ? "bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-slate-700")} />
             
             {/* Hidden file input for avatar update */}
             <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <Laptop className="w-6 h-6 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setProfileImage(url);
                    }
                  }}
                />
             </label>
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
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-6">
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
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       {availableJobs.map(job => {
                         const senior = seniors.find(s => s.id === job.seniorId);
                         return (
                           <div key={job.id} onClick={() => setSelectedJob(job)} className="glass-card p-6 group hover:translate-x-1 transition-all cursor-pointer relative overflow-hidden">
                              {job.priority && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary animate-pulse"></div>
                              )}
                              <div className="flex items-start justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:border-primary/50 transition-colors">
                                       <MapPin className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div>
                                       <div className="flex items-center gap-3 mb-1">
                                          <h4 className="text-lg font-bold text-white">{senior?.name}</h4>
                                          <div className="group/score relative">
                                            <span 
                                              className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-500 font-mono cursor-help hover:text-primary transition-all border border-transparent hover:border-primary/30"
                                            >
                                              Match {job.aiMatchScore}%
                                            </span>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/score:opacity-100 transition-opacity pointer-events-none z-10 w-32 bg-slate-950 border border-slate-800 p-2 rounded-lg text-center shadow-2xl">
                                               <p className="text-[9px] font-bold text-slate-400 leading-tight">Match precision based on skill validation and proximity.</p>
                                               <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-950"></div>
                                            </div>
                                          </div>
                                          <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-500 font-mono">{job.distance} mi</span>
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

                <div className="pt-8 border-t border-slate-800 space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">History & Wellbeing Feedback</h3>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-slate-600">Cycle Average:</span>
                         <div className="flex items-center gap-1 text-warning">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-mono font-black">4.92</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                      {familyReviews.map(review => (
                        <div key={review.id} className="p-6 bg-slate-950/40 border border-slate-800/60 rounded-3xl group transition-all hover:bg-slate-900/40">
                           <div className="flex items-center justify-between mb-4">
                              <div>
                                 <h4 className="text-sm font-bold text-white mb-1">{review.family}</h4>
                                 <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium">Mission Host &bull; {review.date}</p>
                              </div>
                              <div className="flex gap-0.5">
                                 {Array.from({ length: 5 }).map((_, i) => (
                                   <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-warning text-warning" : "text-slate-700")} />
                                 ))}
                              </div>
                           </div>
                           <p className="text-xs text-slate-400 italic leading-relaxed">"{review.comment}"</p>
                        </div>
                      ))}
                   </div>

                   <div className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-3xl border-dashed">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Internal Wellbeing Report</h4>
                      <div className="space-y-4">
                         <textarea 
                           value={myFeedback}
                           onChange={(e) => setMyFeedback(e.target.value)}
                           placeholder="Submit anonymous feedback regarding mission hosts or protocol safety concerns..."
                           className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-primary transition-all min-h-[100px]"
                         />
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-600 uppercase font-medium max-w-[60%]">Reports are encrypted and reviewed by network safety leads manually.</span>
                            <button 
                              onClick={() => {
                                if (myFeedback.trim()) {
                                  setIsSubmittingFeedback(true);
                                  setTimeout(() => {
                                    setIsSubmittingFeedback(false);
                                    setMyFeedback('');
                                    alert("Integrity report logged with system admin.");
                                  }, 1500);
                                }
                              }}
                              disabled={isSubmittingFeedback}
                              className="px-6 py-2 bg-slate-800 text-[10px] font-bold text-white uppercase tracking-widest rounded-xl hover:bg-primary transition-all disabled:opacity-50"
                            >
                               {isSubmittingFeedback ? 'Processing...' : 'Submit Report'}
                            </button>
                         </div>
                      </div>
                   </div>
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
                      <ComplianceIndicator label="Checkr Verified" status="current" variant="success" />
                      <ComplianceIndicator label="Mask Protocol" status="active" variant="warning" />
                      <ComplianceIndicator label="Credential Sync" status="synced" variant="info" />
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
                      
                      <div className="pt-4 border-t border-slate-800/50">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Risk Index Trend</span>
                           <div className="flex items-center gap-1.5 text-success">
                              <TrendingDown className="w-3 h-3" />
                              <span className="text-[10px] font-mono font-bold">-0.9</span>
                           </div>
                        </div>
                        <div className="h-16 w-full flex items-end">
                           <LineChart width={240} height={64} data={riskHistory}>
                              <YAxis hide domain={[0, 'auto']} />
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#22c55e" 
                                strokeWidth={3} 
                                dot={{ fill: '#22c55e', r: 4, strokeWidth: 2, stroke: '#020617' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                           </LineChart>
                        </div>
                        <p className="mt-2 text-[9px] text-slate-600 font-medium uppercase tracking-widest text-center">4 Week Operational Baseline</p>
                      </div>
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

                    <div className="pt-12 border-t border-slate-800">
                       <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Training Academy</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Enhance matching protocols through validated coursework</p>
                          </div>
                          <button className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">View All Modules &rarr;</button>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {trainings.map(t => (
                            <div key={t.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col justify-between group hover:border-primary/30 transition-all">
                               <div>
                                  <div className="flex items-center justify-between mb-4">
                                     <BookOpen className="w-4 h-4 text-slate-600" />
                                     {t.status === 'in-progress' ? (
                                       <span className="text-[9px] px-2 py-0.5 rounded bg-warning/10 text-warning font-bold uppercase tracking-widest border border-warning/20">In Progress</span>
                                     ) : (
                                       <span className="text-[9px] px-2 py-0.5 rounded bg-success/10 text-success font-bold uppercase tracking-widest border border-success/20">Available</span>
                                     )}
                                  </div>
                                  <h4 className="text-xs font-bold text-white mb-2 leading-relaxed">{t.title}</h4>
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium mb-6">Duration: {t.hours} hrs &bull; {t.points} XP</p>
                               </div>
                               
                               {t.status === 'in-progress' ? (
                                 <div className="space-y-2">
                                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-warning" style={{ width: `${t.progress}%` }}></div>
                                   </div>
                                   <button className="w-full py-2 bg-slate-800 text-[10px] font-bold text-white uppercase tracking-widest rounded-lg hover:bg-slate-700">Resume Unit</button>
                                 </div>
                               ) : (
                                 <button className="w-full py-2 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-lg group-hover:border-primary group-hover:text-primary transition-all">Initialize Unit</button>
                               )}
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-12 border-t border-slate-800">
                       <div className="flex justify-between items-center mb-6">
                         <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-500">Security & Gear Compliance</h3>
                         <button className="text-[9px] text-primary font-bold uppercase tracking-widest hover:underline flex items-center gap-1.5">
                            Certification Review Queue <ChevronRight className="w-3 h-3" />
                         </button>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <StatusCard 
                            label="Checkr Verified" 
                            status="Active" 
                            variant="success" 
                            icon={Shield} 
                            desc="Identity & Background Scrubbed"
                          />
                          <StatusCard 
                            label="Mask Protocol" 
                            status="Mandatory" 
                            variant="warning" 
                            icon={Activity} 
                            desc="PPE Compliance Active"
                          />
                          <StatusCard 
                            label="Credential Sync" 
                            status="Synced" 
                            variant="info" 
                            icon={Globe} 
                            desc="Global License Repository"
                          />
                          <StatusCard 
                            label="Audit Status" 
                            status="Clear" 
                            variant="success" 
                            icon={AlertCircle} 
                            desc="Post-Mission Review Pass"
                          />
                       </div>
                    </div>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Cycle Management</h2>
                   <div className="flex gap-2">
                      <span className="text-[10px] px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold uppercase">Live Availability Protocol</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-7 gap-3 mb-8">
                   {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                     <div key={d} className="text-center text-[9px] font-black text-slate-600 uppercase tracking-widest">{d}</div>
                   ))}
                   {Array.from({ length: 31 }).map((_, i) => {
                     const dateKey = `2026-05-${(i+1).toString().padStart(2, '0')}`;
                     const isBlocked = blockedDates.includes(dateKey);
                     return (
                       <button 
                         key={dateKey} 
                         onClick={() => toggleDate(dateKey)}
                         className={cn(
                           "aspect-square rounded-xl border flex flex-col items-center justify-center text-[10px] font-mono transition-all group relative overflow-hidden",
                           isBlocked 
                            ? "bg-danger border-danger text-white shadow-lg shadow-danger/20" 
                            : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-primary/50"
                         )}
                       >
                          <span>{(i + 1).toString().padStart(2, '0')}</span>
                          {isBlocked && <span className="text-[7px] font-black uppercase mt-1">Locked</span>}
                          {!isBlocked && <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-success opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                       </button>
                     )
                   })}
                </div>
                
                <div className="pt-8 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-danger"></div> Conflict (Unavailable)</div>
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></div> Open Slot</div>
                   </div>
                   <span className="text-slate-600">Protocol: Auto-Decline Active</span>
                </div>
             </div>

             <div className="space-y-6">
                <div className="glass-card p-6 border-danger/20 bg-danger/5 ring-1 ring-danger/10">
                   <div className="flex items-center gap-3 mb-4 text-danger">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="text-xs uppercase tracking-widest font-black">Conflict Manager</h3>
                   </div>
                   <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">System will automatically hide your profile for dates marked as <span className="text-danger font-bold">LOCKED</span>. This overrides AI match priority.</p>
                   
                   <div className="space-y-3">
                      {blockedDates.slice(0, 4).map(date => (
                        <div key={date} className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                           <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">{date}</span>
                           <button onClick={() => toggleDate(date)} className="text-[9px] text-danger font-bold uppercase hover:underline">Unlock</button>
                        </div>
                      ))}
                      {blockedDates.length > 4 && (
                        <p className="text-center text-[9px] text-slate-600 font-bold uppercase">+{blockedDates.length - 4} more locked cycles</p>
                      )}
                   </div>
                </div>

                <div className="glass-card p-6">
                   <h3 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-6 font-display">Sync Externals</h3>
                   <div className="space-y-4">
                      <button className="w-full py-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-3 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                         <Globe className="w-4 h-4 text-blue-500" />
                         Sync Google Calendar
                      </button>
                      <button className="w-full py-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-3 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                         <Info className="w-4 h-4 text-purple-500" />
                         Sync Apple Health Schedule
                      </button>
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

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                   {chatHistory.map(msg => (
                     <div key={msg.id} className={cn(
                       "flex flex-col max-w-[80%]",
                       msg.sender === 'companion' ? "ml-auto items-end" : "mr-auto items-start"
                     )}>
                        <div className={cn(
                           "p-4 rounded-2xl text-xs leading-relaxed",
                           msg.sender === 'companion' 
                             ? "bg-primary text-white shadow-lg shadow-primary/20" 
                             : "bg-slate-900 border border-slate-800 text-slate-300"
                        )}>
                           {msg.text}
                        </div>
                        <span className="mt-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">{msg.time}</span>
                     </div>
                   ))}
                   {isTyping && (
                     <div className="flex flex-col items-start mr-auto max-w-[80%]">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex gap-1">
                           <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                           <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                           <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"></div>
                        </div>
                     </div>
                   )}
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
                         <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 ring-4 ring-slate-950">
                            <User className="w-10 h-10 text-slate-600" />
                         </div>
                         <div>
                            <div className="flex items-center gap-4 mb-1">
                               <h2 className="text-2xl font-bold text-white">{seniors.find(s => s.id === selectedJob.seniorId)?.name}</h2>
                               <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded font-bold uppercase tracking-widest">Priority ALPHA</span>
                            </div>
                            <div className="flex gap-4">
                               <p className="text-xs text-slate-400 font-medium">Family: <span className="text-primary">The Smiths</span></p>
                               <p className="text-xs text-slate-400 font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> <span className="text-primary">{selectedJob.distance} miles away</span></p>
                            </div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2">Detailed Geodata</h4>
                            <p className="text-xs text-white font-mono leading-relaxed">442 Protocol Ave, Site B-12<br/>San Francisco, CA 94105</p>
                         </div>
                         <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2">Emergency Uplink</h4>
                            <p className="text-xs text-white font-mono leading-relaxed">DR. JONATHAN REED<br/>+1 (555) 092-2281</p>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-3">Electronic Medical Dossier</h4>
                            <div className="space-y-2">
                               <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Diagnosis:</span>
                                  <span className="text-white font-bold">{seniors.find(s => s.id === selectedJob.seniorId)?.condition}</span>
                               </div>
                               <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">DNR Status:</span>
                                  <span className="text-success font-black">ACTIVE / VALID</span>
                               </div>
                               <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Mobility Class:</span>
                                  <span className="text-warning font-bold">ASSISTED (LEVEL 2)</span>
                               </div>
                            </div>
                         </div>

                         <div>
                            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Requirement Protocol</h4>
                            <div className="flex flex-wrap gap-2">
                               {selectedJob.reqSkills.map((s: string) => (
                                 <span key={s} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s}</span>
                               ))}
                            </div>
                         </div>
                         
                         <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                            <h4 className="text-[10px] uppercase font-black text-primary mb-2">Engagement Directives</h4>
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                               "Senior requires support with morning mobility and memory recall exercises. Preference for companions who can discuss gardening or history. Note: Eleanor has a scheduled medication cycle at 10:15 AM."
                            </p>
                         </div>
                      </div>

                      <div className="mt-12 flex gap-4">
                         <button onClick={() => setSelectedJob(null)} className="flex-1 py-4 bg-slate-900 text-slate-400 text-xs font-bold rounded-2xl uppercase tracking-widest transition-all hover:bg-slate-800">Close Dossier</button>
                         <button className="flex-2 py-4 bg-primary text-white text-xs font-bold rounded-2xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20">Initialize Mission</button>
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
