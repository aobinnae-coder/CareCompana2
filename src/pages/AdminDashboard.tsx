import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Search, Filter, Plus, History, Activity, Users, FileText, Settings, Bell, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

function ConfigToggle({ label, enabled = false }: { label: string, enabled?: boolean }) {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
       <button 
         onClick={() => setIsOn(!isOn)}
         className={cn(
           "w-8 h-4 rounded-full relative transition-all",
           isOn ? "bg-primary" : "bg-slate-800"
         )}
       >
          <div className={cn(
            "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
            isOn ? "right-0.5" : "left-0.5"
          )} />
       </button>
    </div>
  );
}

function StatusCard({ title, value, sub, trend, icon: Icon, color }: any) {
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/20",
    success: "text-success bg-success/10 border-success/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    danger: "text-danger bg-danger/10 border-danger/20",
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group">
      <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", colorMap[color as keyof typeof colorMap])}>
        <Icon className="w-12 h-12" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 mb-4">{title}</p>
        <p className="text-4xl font-display font-light text-white mb-2">{value}</p>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">{sub}</p>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", colorMap[color as keyof typeof colorMap].split(' ')[0])}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function IncidentItem({ id, type, senior, companion, time, severity }: any) {
  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between hover:bg-slate-900 transition-all cursor-pointer group">
       <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-danger rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="text-[10px] font-mono text-slate-600 font-bold tracking-widest uppercase">{id}</span>
               <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/10 text-danger font-bold uppercase tracking-widest border border-danger/20">{severity}</span>
            </div>
            <h4 className="text-sm font-bold text-white">{type}</h4>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
               {senior} <span className="mx-2 text-slate-700">&mdash;</span> {companion}
            </p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">{time}</p>
          <button className="text-xs text-primary font-bold hover:underline">Investigate</button>
       </div>
    </div>
  );
}

function SearchInput({ value, onChange }: any) {
  return (
    <div className="relative">
      <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter records..." 
        className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-primary transition-all outline-none w-48"
      />
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

function IncidentRow({ incident }: { incident: any }) {
  const [expanded, setExpanded] = useState(false);

  // Map severity string to a number
  let level = 1;
  if (incident?.severity) {
    if (incident.severity.includes('4')) level = 4;
    else if (incident.severity.includes('3')) level = 3;
    else if (incident.severity.includes('2')) level = 2;
  }

  const getBadge = () => {
    switch(level) {
      case 4: return <span className="px-2 py-1 rounded-md bg-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-wider">L4 Emergency</span>;
      case 3: return <span className="px-2 py-1 rounded-md bg-orange-600/20 text-orange-500 text-[10px] font-bold uppercase tracking-wider">L3 Safety</span>;
      case 2: return <span className="px-2 py-1 rounded-md bg-yellow-600/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">L2 Behavioral</span>;
      default: return null;
    }
  }

  const time = incident.createdAt ? new Date(incident.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now';
  const title = `${incident.incidentTypes && incident.incidentTypes[0] ? incident.incidentTypes[0] : 'Reported Incident'} by ${incident.companionName || 'Unknown'}`;

  return (
    <div className="bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors overflow-hidden cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {getBadge()}
            {incident.visitId && incident.visitId !== 'Multiple' ? (
              <a href={`/visit/${incident.visitId}`} onClick={(e) => e.stopPropagation()} className="text-[10px] font-mono text-blue-400 hover:text-blue-300 hover:underline uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">
                Visit Details: {incident.visitId}
              </a>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">Visit: {incident.visitId || 'N/A'}</span>
            )}
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono" title={incident.companionName}>CMP: {incident.companionId || 'N/A'}</span>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">&bull; {time}</span>
          </div>
          <h3 className="text-sm font-medium text-white">{title} <span className="text-xs text-slate-400 font-normal">w/ <strong className="text-slate-300">{incident.seniorName || 'Unknown'}</strong></span></h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-1">{incident.narrative}</p>
        </div>
        <div className="flex flex-row md:flex-col gap-2 shrink-0 md:ml-4 mt-4 md:mt-0 items-center md:items-end justify-between">
          <button className="px-3 py-1 bg-slate-800 text-[10px] text-white font-bold rounded-md hover:bg-slate-700 transition-colors uppercase tracking-widest border border-slate-700" onClick={(e) => e.stopPropagation()}>Investigate</button>
          <div className="text-slate-400 p-1">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-slate-900/50" onClick={(e) => e.stopPropagation()}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Full Narrative</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{incident.narrative || 'N/A'}</p>
                 </div>
                 <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Exact Location</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{incident.location || 'Not specified'}</p>
                 </div>
                 <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Injuries / Observations</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{incident.injuries || 'None logged.'}</p>
                 </div>
                 <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Emergency Notifications</h4>
                    <div className="flex gap-3 mt-1">
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${incident.was911Called ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>911 Called</span>
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${incident.apsReported ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-500'}`}>APS Notified</span>
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${incident.policeReported ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>Police Notified</span>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Medical Follow-up</h4>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${incident.clientTransported ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                       {incident.clientTransported ? 'Client Transported to Hospital' : 'No Hospital Transport'}
                    </span>
                 </div>
                 <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-800/50">
                    <a href={`/visit/${incident.visitId}`} className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-bold transition-colors uppercase tracking-wider">
                       View Relevant Visit ({incident.visitId || 'N/A'}) &rarr;
                    </a>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard() {
  const { seniors, jobs, companions, addSenior } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'seniors' | 'companions' | 'incidents'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSenior, setShowAddSenior] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // New Senior Form State
  const [newSenior, setNewSenior] = useState({
    name: '',
    age: '',
    condition: '',
    careType: ''
  });

  const handleAddSenior = (e: React.FormEvent) => {
    e.preventDefault();
    addSenior({
      id: `SNR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: newSenior.name,
      age: parseInt(newSenior.age),
      condition: newSenior.condition,
      specializedCare: newSenior.careType.split(',').map(s => s.trim()),
      rating: 5.0,
      familyAdmin: 'The Smiths' // Mock as same family for demo
    });
    setShowAddSenior(false);
    setNewSenior({ name: '', age: '', condition: '', careType: '' });
  };

  // Derived stats
  const activeJobs = jobs.filter(j => j.status === 'in_progress').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const safetyAlerts = 2; // Mock

  return (
    <div className="space-y-8 pb-20">
      {/* Header section with contextual actions */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Shield className="w-5 h-5 text-primary" />
             <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Platform Integrity Engine</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white leading-none">Trust & Safety <span className="text-slate-700">/ Command Center</span></h1>
          <p className="text-slate-400 mt-4 max-w-xl text-sm leading-relaxed">
            Real-time monitoring of companion performance, senior welfare, and mission-critical care incidents across the primary network.
          </p>
        </div>
        
        <div className="flex gap-3">
           <button 
             onClick={() => setShowConfig(true)}
             className="btn-secondary group flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all"
           >
              <Settings className="w-4 h-4" /> Config
           </button>
           <button 
             onClick={() => setShowAddSenior(true)}
             className="btn-primary flex items-center gap-2"
           >
              <Plus className="w-4 h-4" /> Register Senior
           </button>
        </div>
      </header>

      {/* High-fidelity summary deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="Critical Incidents" value="03" sub="Requires immediate action" trend="+1 from yesterday" icon={AlertTriangle} color="danger" />
        <StatusCard title="Active Protocols" value={activeJobs.toString().padStart(2, '0')} sub="Active care sessions" trend="Live stream" icon={Activity} color="success" />
        <StatusCard title="Platform Trust" value="98.2%" sub="Verified companion rate" trend="+0.4% baseline" icon={CheckCircle} color="primary" />
        <StatusCard title="Pending Checks" value="12" sub="Background/ID verification" trend="8h avg response" icon={Clock} color="warning" />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 gap-8 px-2">
         {['Overview', 'Seniors', 'Companions', 'Incidents'].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab.toLowerCase() as any)}
             className={cn(
               "pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative",
               activeTab === tab.toLowerCase() ? "text-primary" : "text-slate-500 hover:text-slate-300"
             )}
           >
             {tab}
             {activeTab === tab.toLowerCase() && (
               <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
             )}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Operational Feed */}
            <div className="lg:col-span-2 space-y-6">
               <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xs uppercase tracking-widest font-black text-slate-500">Emergency Response Queue</h3>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-danger animate-ping"></span>
                        <span className="text-[10px] font-bold text-danger uppercase tracking-widest">Priority 1</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                    <IncidentItem 
                      id="INC-492"
                      type="Behavioral Outburst"
                      senior="Eleanor Riggs"
                      companion="Sarah Chen"
                      time="12 mins ago"
                      severity="Level 2"
                    />
                    <IncidentItem 
                      id="INC-491"
                      type="Medication Refusal"
                      senior="Arthur Dent"
                      companion="Unassigned"
                      time="42 mins ago"
                      severity="Level 1"
                    />
                  </div>
               </div>

               <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xs uppercase tracking-widest font-black text-slate-500">Live Care Assignments</h3>
                     <SearchInput value={searchQuery} onChange={setSearchQuery} />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-800">
                          <th className="text-left pb-4">Job ID</th>
                          <th className="text-left pb-4">Senior / Protocol</th>
                          <th className="text-left pb-4">Status</th>
                          <th className="text-left pb-4">Timestamp</th>
                          <th className="text-right pb-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {jobs.map(job => (
                          <tr key={job.id} className="group hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 text-[10px] font-mono text-slate-500">{job.id}</td>
                            <td className="py-4">
                               <p className="text-xs font-bold text-white">{seniors.find(s => s.id === job.seniorId)?.name}</p>
                               <p className="text-[9px] text-slate-500 uppercase tracking-wider">{job.reqSkills[0]}</p>
                            </td>
                            <td className="py-4">
                               <span className={cn(
                                 "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border",
                                 job.status === 'in_progress' ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                               )}>
                                 {job.status.replace('_', ' ')}
                               </span>
                            </td>
                            <td className="py-4 text-[10px] font-mono text-slate-400">{job.date}</td>
                            <td className="py-4 text-right">
                               <button className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">Monitor</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>

            {/* Side Intelligence Panel */}
            <div className="space-y-6">
               <div className="glass-card p-6 bg-primary/5 border-primary/10">
                  <h3 className="text-xs uppercase tracking-widest font-black text-primary mb-6">Network Intelligence</h3>
                  <div className="space-y-6">
                    <IntelligenceItem label="Avg Match Latency" value="4.2m" trend="-12%" icon={Activity} />
                    <IntelligenceItem label="Risk Compliance" value="99.4%" trend="+0.1%" icon={Shield} />
                    <IntelligenceItem label="Total Pool Size" value={companions.length.toString()} trend="Active" icon={Users} />
                  </div>
                  <button className="w-full mt-8 py-3 bg-primary text-white text-[10px] font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                     View Global Metrics
                  </button>
               </div>

               <div className="glass-card p-6">
                  <h3 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-6">Recent Verifications</h3>
                  <div className="space-y-4">
                    {companions.map(c => (
                      <div key={c.id} className="flex items-center gap-3">
                         <img src={c.avatar} className="w-8 h-8 rounded-lg" alt="" />
                         <div className="flex-1">
                            <p className="text-xs font-bold text-white">{c.name}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Cleared &bull; FCRA+</p>
                         </div>
                         <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'seniors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-lg font-display font-bold text-white uppercase tracking-widest">Active Senior Registry</h2>
                   <div className="flex gap-4">
                      <SearchInput value={searchQuery} onChange={setSearchQuery} />
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {seniors.map(senior => (
                     <div key={senior.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-primary/50 transition-all group flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                             <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                                <Users className="w-6 h-6 text-slate-500" />
                             </div>
                             <span className="text-[10px] font-mono text-slate-600 tracking-widest">{senior.id}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{senior.name}</h3>
                          <p className="text-xs text-slate-400 mb-4">{senior.age} years old &bull; {senior.condition}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                             {senior.specializedCare.map(care => (
                               <span key={care} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 font-bold uppercase tracking-wider">{care}</span>
                             ))}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                           <div className="flex items-center gap-1.5 text-warning font-black text-xs">
                              {senior.rating} <span className="text-[10px] uppercase font-bold text-slate-600 ml-1">Rating</span>
                           </div>
                           <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Full History</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Senior Modal */}
      <AnimatePresence>
        {showAddSenior && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSenior(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-card bg-slate-900 p-8 shadow-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">Register New Senior</h2>
              </div>

              <form onSubmit={handleAddSenior} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Legal Name</label>
                  <input 
                    required
                    type="text" 
                    value={newSenior.name}
                    onChange={e => setNewSenior({...newSenior, name: e.target.value})}
                    placeholder="Enter full name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Age</label>
                    <input 
                      required
                      type="number" 
                      value={newSenior.age}
                      onChange={e => setNewSenior({...newSenior, age: e.target.value})}
                      placeholder="Years"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Primary Condition</label>
                    <input 
                      required
                      type="text" 
                      value={newSenior.condition}
                      onChange={e => setNewSenior({...newSenior, condition: e.target.value})}
                      placeholder="e.g. Dementia"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Specialized Care Protocol (comma separated)</label>
                  <input 
                    required
                    type="text" 
                    value={newSenior.careType}
                    onChange={e => setNewSenior({...newSenior, careType: e.target.value})}
                    placeholder="Memory Care, Mobility, etc."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                   <button 
                     type="button"
                     onClick={() => setShowAddSenior(false)}
                     className="flex-1 py-4 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-xl uppercase tracking-widest transition-all hover:bg-slate-700"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="flex-[2] py-4 bg-primary text-white text-[10px] font-bold rounded-xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                   >
                     Complete Registration
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Config Modal */}
      <AnimatePresence>
        {showConfig && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowConfig(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.95, opacity: 0, x: 50 }}
              className="relative w-full max-w-sm glass-card bg-slate-900 p-8 shadow-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-8">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">System Config</h2>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4 block">Platform Thresholds</label>
                   <div className="space-y-4">
                      <ConfigToggle label="Auto-Flag Low Risk" enabled />
                      <ConfigToggle label="FCRA Mandatory" enabled />
                      <ConfigToggle label="2FA Requirement" />
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Risk Sensitivity</label>
                  <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary" />
                  <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                     <span>Conservative</span>
                     <span>Aggressive</span>
                  </div>
                </div>

                <div className="pt-8">
                   <button 
                     onClick={() => setShowConfig(false)}
                     className="w-full py-4 bg-primary text-white text-[10px] font-bold rounded-xl uppercase tracking-widest transition-all"
                   >
                     Apply Parameters
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
