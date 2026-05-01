import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Download, Search, Filter, ChevronDown, ChevronUp, Plus, X, UserSearch, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CompanionHistoryModal from '../components/CompanionHistoryModal';

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [seniors, setSeniors] = useState<any[]>([]);
  
  // Search state for visits
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(window.location.search).get('q') || '');
  const [statusFilter, setStatusFilter] = useState(new URLSearchParams(window.location.search).get('status') || '');
  const [startDate, setStartDate] = useState(new URLSearchParams(window.location.search).get('start') || '');
  const [endDate, setEndDate] = useState(new URLSearchParams(window.location.search).get('end') || '');

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    
    const newPath = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newPath);
    
    // Also update our local state to trigger re-render
    if (key === 'q') setSearchQuery(value);
    if (key === 'status') setStatusFilter(value);
    if (key === 'start') setStartDate(value);
    if (key === 'end') setEndDate(value);
  };

  // Search state for seniors
  const [seniorSearchQuery, setSeniorSearchQuery] = useState('');
  const [debouncedSeniorSearchQuery, setDebouncedSeniorSearchQuery] = useState('');
  const [seniorLanguageFilter, setSeniorLanguageFilter] = useState('');
  const [seniorConditionFilter, setSeniorConditionFilter] = useState('');
  const [seniorLastVisitFilter, setSeniorLastVisitFilter] = useState('');

  const [seniorFamilyAdminFilter, setSeniorFamilyAdminFilter] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSeniorSearchQuery(seniorSearchQuery), 300);
    return () => clearTimeout(handler);
  }, [seniorSearchQuery]);

  // Incident state
  const [incidentStatusFilter, setIncidentStatusFilter] = useState('');

  // Modal states
  const [showAddSeniorModal, setShowAddSeniorModal] = useState(false);
  const [historyCompanionId, setHistoryCompanionId] = useState<string | null>(null);
  const [historySeniorId, setHistorySeniorId] = useState<string | null>(null);
  const [seniorHistoryData, setSeniorHistoryData] = useState<any>(null);
  
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [riskThreshold, setRiskThreshold] = useState(70);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // New senior form state
  const [newSenior, setNewSenior] = useState({
    name: '', dob: '', address: '', conditions: '', specializedCare: [] as string[], primaryLanguage: 'English', familyAdmin: ''
  });

  const fetchData = () => {
    fetch('/api/incidents').then(res => res.json()).then(setIncidents).catch(err => console.log('Network err', err.message));
    fetch('/api/admin/companions-metrics').then(res => res.json()).then(setMetrics).catch(err => console.log('Network err', err.message));
    fetch('/api/visits').then(res => res.json()).then(setVisits).catch(err => console.log('Network err', err.message));
    fetch('/api/seniors').then(res => res.json()).then(setSeniors).catch(err => console.log('Network err', err.message));
  };

  useEffect(() => {
    fetchData();
    const int = setInterval(fetchData, 10000); // Polling every 10s
    return () => clearInterval(int);
  }, []);

  const exportAuditLogs = () => {
    const csvContent = "timestamp,actor_id,action,target_id,severity\n" + 
      incidents.map(i => `${i.createdAt},${i.companionId},Reported_Incident,${i.visitId},${i.severity}`).join("\n");
      
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = `carecompana_audit_logs_${new Date().toISOString().split('T')[0]}.csv`; 
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddSenior = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/seniors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newSenior,
        conditions: newSenior.conditions.split(',').map(s => s.trim())
      })
    }).catch(err => console.log(err.message));
    setShowAddSeniorModal(false);
    fetchData();
  };

  const viewCompanionHistory = (id: string) => {
    setHistoryCompanionId(id);
  };

  const viewSeniorHistory = async (id: string) => {
    const res = await fetch(`/api/seniors/${id}/visits`).catch(err => { console.log(err.message); return null; });
    if (!res) return;
    const data = await res.json();
    setSeniorHistoryData(data);
    setHistorySeniorId(id);
  };

  const atRiskCompanions = metrics.filter(m => m.riskScore < riskThreshold);
  const hasCriticalAlerts = atRiskCompanions.length > 0;

  const filteredIncidents = incidents.filter(inc => {
    return incidentStatusFilter === '' || inc.status === incidentStatusFilter;
  });

  const filteredVisits = visits.filter(v => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = (v.companionName.toLowerCase().includes(term) || 
                          v.seniorName.toLowerCase().includes(term) ||
                          (v.companionId || '').toLowerCase().includes(term) ||
                          (v.seniorId || '').toLowerCase().includes(term));
    const matchesStatus = statusFilter === '' || v.status === statusFilter;
    
    let matchesDate = true;
    if (startDate || endDate) {
      const vDate = new Date(v.scheduledFor);
      if (startDate && new Date(startDate) > vDate) matchesDate = false;
      if (endDate) {
        const endD = new Date(endDate);
        endD.setHours(23, 59, 59, 999);
        if (endD < vDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredSeniors = seniors.filter(s => {
    const term = debouncedSeniorSearchQuery.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(term) || 
           s.address.toLowerCase().includes(term);
           
    const matchesLanguage = seniorLanguageFilter === '' || s.primaryLanguage === seniorLanguageFilter;
    const matchesFamilyAdmin = seniorFamilyAdminFilter === '' || s.familyAdmin === seniorFamilyAdminFilter;
    
    // For conditions, we assume s.conditions is an array of strings. If the filter is "Dementia", we check if the person has "Dementia".
    let matchesCondition = true;
    if (seniorConditionFilter) {
      if (!s.conditions || !Array.isArray(s.conditions)) {
        matchesCondition = false;
      } else {
        matchesCondition = s.conditions.some((c: string) => c.toLowerCase().includes(seniorConditionFilter.toLowerCase().replace(/ \/ alzheimer's/g, '')));
      }
    }
    
    // For last visit date: finding seniors whose LATEST visit is BEFORE the filter date
    let matchesLastVisit = true;
    if (seniorLastVisitFilter) {
      const seniorVisits = visits.filter(v => v.seniorName.toLowerCase() === s.name.toLowerCase() || v.seniorName.includes(s.name.split(' ')[0]));
      if (seniorVisits.length === 0) {
        // If they have NO visits, they definitely haven't had one recently
        matchesLastVisit = true;
      } else {
        const latestVisit = seniorVisits.sort((a,b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime())[0];
        // If their latest visit was BEFORE the threshold date, they are "neglected"
        if (new Date(latestVisit.scheduledFor) > new Date(seniorLastVisitFilter)) {
          matchesLastVisit = false;
        }
      }
    }

    return matchesSearch && matchesLanguage && matchesCondition && matchesLastVisit && matchesFamilyAdmin;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {hasCriticalAlerts && !isAlertDismissed && (
        <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.15)] relative">
           <button onClick={() => setIsAlertDismissed(true)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">
             <X className="w-4 h-4" />
           </button>
           <div className="flex items-center gap-3 mt-2 sm:mt-0">
             <AlertTriangle className="text-red-500 w-6 h-6 animate-pulse" />
             <div className="text-sm text-red-100 font-medium">
                <strong>Critical Alert:</strong> The following companions have dropped below the risk threshold ({riskThreshold}):
                <ul className="list-disc ml-5 mt-1">
                  {atRiskCompanions.map(c => <li key={c.id}>{c.name} (Score: {c.riskScore})</li>)}
                </ul>
             </div>
           </div>
           <button onClick={() => viewCompanionHistory(atRiskCompanions[0].id)} className="bg-red-500/20 text-red-400 font-bold text-xs px-4 py-2 mt-4 sm:mt-0 rounded border border-red-500/30 hover:bg-red-500/30 transition uppercase tracking-wider shrink-0">Review Profile</button>
        </div>
      )}

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C0C0D] border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setShowConfigModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-light text-white">Configure Dashboard</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Risk Score Threshold</label>
                <input type="number" min="0" max="100" value={riskThreshold} onChange={e => setRiskThreshold(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                <p className="text-xs text-slate-400 mt-2">Companions with a score below this will throw an alert.</p>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyCompanionId && (
        <CompanionHistoryModal companionId={historyCompanionId} onClose={() => setHistoryCompanionId(null)} />
      )}

      {/* Senior History Modal */}
      {historySeniorId && seniorHistoryData && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C0C0D] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setHistorySeniorId(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-2xl font-light text-white">Senior Visit History</h2>
              <p className="text-sm text-slate-400">{seniorHistoryData.senior.name} ({seniorHistoryData.senior.id})</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Past Visits</h3>
                {seniorHistoryData.visits.length === 0 ? (
                  <p className="text-sm text-slate-500">No past visits recorded.</p>
                ) : (
                  <div className="space-y-3">
                    {seniorHistoryData.visits.map((vis: any) => (
                      <div key={vis.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-white mb-1">{new Date(vis.scheduledFor).toLocaleString()}</p>
                          <p className="text-xs text-slate-400">Companion: <span className="text-slate-300 font-medium">{vis.companionName}</span></p>
                        </div>
                        <div className="text-right">
                           <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border ${vis.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : vis.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                             {vis.status.replace('_', ' ')}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Senior Modal */}
      {showAddSeniorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C0C0D] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowAddSeniorModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-light text-white">Add Senior Profile</h2>
            </div>
            <form onSubmit={handleAddSenior} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Full Name</label>
                <input required type="text" value={newSenior.name} onChange={e => setNewSenior({ ...newSenior, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Date of Birth</label>
                  <input required type="date" value={newSenior.dob} onChange={e => setNewSenior({ ...newSenior, dob: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Primary Language</label>
                  <input required type="text" value={newSenior.primaryLanguage} onChange={e => setNewSenior({ ...newSenior, primaryLanguage: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Address</label>
                <input required type="text" value={newSenior.address} onChange={e => setNewSenior({ ...newSenior, address: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Conditions</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newSenior.conditions.split(',').filter(c => c.trim()).map((cond, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                      {cond.trim()}
                      <button type="button" onClick={() => setNewSenior({ ...newSenior, conditions: newSenior.conditions.split(',').filter(c => c.trim() !== cond.trim()).join(', ') })} className="text-slate-500 hover:text-white">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                   {['Dementia', 'Diabetes', 'Mobility Impaired', 'Hearing Loss'].map(c => (
                     <button type="button" key={c} onClick={() => {
                       const current = newSenior.conditions.split(',').map(s => s.trim()).filter(s => s);
                       if (!current.includes(c)) setNewSenior({ ...newSenior, conditions: [...current, c].join(', ') });
                     }} className="text-[10px] border border-slate-700 bg-slate-900 text-slate-400 px-2 py-1 rounded font-bold uppercase tracking-wider hover:bg-slate-800">+ {c}</button>
                   ))}
                </div>
                <input type="text" onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val) {
                      const current = newSenior.conditions.split(',').map(s => s.trim()).filter(s => s);
                      if (!current.includes(val)) setNewSenior({ ...newSenior, conditions: [...current, val].join(', ') });
                      e.currentTarget.value = '';
                    }
                  }
                }} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="Type custom condition & press Enter" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Specialized Care Needs</label>
                <div className="flex flex-wrap gap-2 mb-2">
                   {['Dementia Care', 'Physical Therapy Assistance', 'Palliative Care', 'Post-Op Recovery', 'Mobility Training'].map(type => (
                     <button 
                       type="button" 
                       key={type} 
                       onClick={() => {
                         const current = newSenior.specializedCare;
                         if (current.includes(type)) {
                           setNewSenior({ ...newSenior, specializedCare: current.filter(t => t !== type) });
                         } else {
                           setNewSenior({ ...newSenior, specializedCare: [...current, type] });
                         }
                       }} 
                       className={`text-[10px] border px-2 py-1 rounded font-bold uppercase tracking-wider transition ${newSenior.specializedCare.includes(type) ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                     >
                       {type}
                     </button>
                   ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Family Admin Name</label>
                <input required type="text" value={newSenior.familyAdmin} onChange={e => setNewSenior({ ...newSenior, familyAdmin: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" />
              </div>
              <button type="submit" className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">
                Create Profile
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-3xl font-light text-white leading-tight">Trust & Safety Operations</h1>
          <p className="text-slate-500 mt-2">Monitor platform integrity, incidents, and mandatory reporting alerts.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowConfigModal(true)} className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg shadow-sm text-xs font-bold hover:bg-slate-700 uppercase tracking-widest flex items-center gap-2 transition-colors">
            Configure Alerts
          </button>
          <button onClick={exportAuditLogs} className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg shadow-sm text-xs font-bold hover:bg-slate-700 uppercase tracking-widest flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export CSV Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Active Incident Reports" value="3" icon={AlertTriangle} color="text-red-500" bg="bg-red-500/10" />
        <StatCard title="Background Checks Pending" value="12" icon={Clock} color="text-yellow-500" bg="bg-yellow-500/10" />
        <StatCard title="Cleared Companions" value="1,248" icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard title="Risk Scores < 70" value="5" icon={Shield} color="text-red-500" bg="bg-red-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-white">Priority Incident Queue</h2>
              <select 
                value={incidentStatusFilter}
                onChange={e => setIncidentStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_review">In Review</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="space-y-4">
                {filteredIncidents.slice().reverse().map(inc => (
                    <div key={inc.id}>
                   <IncidentRow 
                    incident={inc}
                  />
                 </div>
              ))}

            </div>
          </section>


          {/* New Metrics Section */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Companion Performance Metrics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-widest">
                    <th className="pb-3 px-2 font-medium">Companion</th>
                    <th className="pb-3 px-2 font-medium">Risk Score</th>
                    <th className="pb-3 px-2 font-medium">Rating</th>
                    <th className="pb-3 px-2 font-medium">Punctuality</th>
                    <th className="pb-3 px-2 font-medium">Skills</th>
                    <th className="pb-3 px-2 font-medium">Incidents</th>
                    <th className="pb-3 px-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-300">
                  {metrics.map(comp => (
                    <tr key={comp.id} className={`border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors ${comp.riskScore < riskThreshold ? 'bg-red-500/5 border-l-2 border-l-red-500' : ''}`}>
                      <td className="py-4 px-2 font-medium text-white">{comp.name} <span className="text-[10px] text-slate-500 ml-1 font-mono">{comp.id}</span></td>
                      <td className="py-4 px-2">
                        <span className={`font-mono font-bold ${comp.riskScore < 40 ? 'text-red-500' : comp.riskScore < 70 ? 'text-orange-500' : 'text-emerald-500'}`}>
                          {comp.riskScore}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-mono">{comp.avgRating} ★</td>
                      <td className="py-4 px-2 font-mono">{comp.punctualityRate}%</td>
                      <td className="py-4 px-2">
                         <div className="flex flex-wrap gap-1">
                           {comp.skills && comp.skills.map((skill: string, i: number) => (
                             <span key={i} className="bg-slate-800 text-slate-300 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                               {skill}
                             </span>
                           ))}
                         </div>
                      </td>
                      <td className="py-4 px-2 font-mono">{comp.incidentsCount}</td>
                      <td className="py-4 px-2 flex items-center justify-between gap-3">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${comp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : comp.status === 'Probation' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                          {comp.status}
                        </span>
                        <button onClick={() => viewCompanionHistory(comp.id)} className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest flex items-center gap-1">
                          <History className="w-3 h-3" /> History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* New Senior Directory Section */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Senior Directory</h2>
                <button onClick={() => setShowAddSeniorModal(true)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg uppercase tracking-widest flex items-center gap-1 transition">
                  <Plus className="w-3 h-3" /> Add Senior
                </button>
             </div>
             
             <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
               <div className="relative w-full sm:flex-1">
                  <UserSearch className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Find by Name or Address..." 
                    value={seniorSearchQuery}
                    onChange={e => setSeniorSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
               </div>

               <div className="w-full sm:w-auto">
                  <select 
                    value={seniorFamilyAdminFilter}
                    onChange={e => setSeniorFamilyAdminFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Admins</option>
                    {[...new Set(seniors.map(s => s.familyAdmin).filter(Boolean))].map(admin => (
                      <option key={admin} value={admin as string}>{admin as string}</option>
                    ))}
                  </select>
               </div>
               
               <div className="w-full sm:w-auto">
                  <select 
                    value={seniorLanguageFilter}
                    onChange={e => setSeniorLanguageFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Languages</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="French">French</option>
                  </select>
               </div>

               <div className="w-full sm:w-auto">
                  <select 
                    value={seniorConditionFilter}
                    onChange={e => setSeniorConditionFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Conditions</option>
                    <option value="Dementia">Dementia / Alzheimer's</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Mobility Impaired">Mobility Impaired</option>
                    <option value="Hearing Loss">Hearing Loss</option>
                  </select>
               </div>

                <div className="w-full sm:w-auto flex items-center gap-2">
                   <span className="text-xs text-slate-400">No Visit Since:</span>
                   <input 
                     type="date"
                     value={seniorLastVisitFilter}
                     onChange={e => setSeniorLastVisitFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSeniors.map(senior => (
                  <div key={senior.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition">
                     <div className="flex justify-between items-start">
                        <div>
                         <h3 className="text-sm font-bold text-white">{senior.name} <span className="text-[10px] text-slate-500 font-mono font-normal ml-2">{senior.id}</span></h3>
                         <p className="text-xs text-slate-400 mt-1">{senior.address} &bull; DOB: {senior.dob}</p>
                         <p className="text-xs text-slate-500 mt-1">
                           <span className="font-semibold text-slate-400">Language:</span> {senior.primaryLanguage || 'English'} &bull; 
                           <span className="font-semibold text-slate-400 ml-1">Conditions:</span> {senior.conditions?.join(', ') || 'None'}
                         </p>
                        </div>
                        <button onClick={() => viewSeniorHistory(senior.id)} className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest flex items-center gap-1 shrink-0">
                          <History className="w-3 h-3" /> View History
                        </button>
                     </div>
                     <div className="mt-3 flex items-center justify-between">
                       <div className="flex gap-1 flex-wrap">
                         {senior.conditions.map((cond: string, idx: number) => (
                           <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium uppercase tracking-wider">{cond}</span>
                         ))}
                       </div>
                       <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Family: {senior.familyAdmin}</span>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* Search & Filter Visits Section */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Visit Directory</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search by Companion or Senior name..." 
                  value={searchQuery}
                  onChange={e => updateSearchParams('q', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-full sm:w-48 relative">
                <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                  value={statusFilter}
                  onChange={e => updateSearchParams('status', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="en_route">En Route</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex gap-2 w-full sm:w-auto items-center">
                <input type="date" value={startDate} onChange={e => updateSearchParams('start', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                <span className="text-slate-500 text-sm">to</span>
                <input type="date" value={endDate} onChange={e => updateSearchParams('end', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="space-y-3">
              {filteredVisits.map(visit => (
                <div key={visit.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition">
                  <div>
                    <h4 className="text-sm font-bold text-white">Visit: {visit.id} <span className={`ml-2 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest border ${visit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : visit.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>{visit.status.replace('_', ' ')}</span></h4>
                    <p className="text-xs text-slate-400 mt-1">Companion: <span className="text-slate-300 font-medium">{visit.companionName}</span> &bull; Senior: <span className="text-slate-300 font-medium">{visit.seniorName}</span></p>
                    <p className="text-[10px] text-slate-500 mt-1">{new Date(visit.scheduledFor).toLocaleString()}</p>
                  </div>
                  <button className="mt-3 sm:mt-0 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded uppercase tracking-wider transition-colors">View Details</button>
                </div>
              ))}
              {filteredVisits.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">No visits found matching your criteria.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
            <h2 className="text-sm font-bold text-white mb-4">Background FCRA Queue</h2>
            <div className="text-xs text-slate-400 space-y-4">
              <p>2 companions flagged for manual review based on Checkr/Persona return status.</p>
              
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">Maria S.</span>
                  <span className="text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md font-bold uppercase tracking-wider">Review</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Target: Motor vehicle hit on county search.</p>
                <div className="flex gap-2">
                    <button className="text-[10px] px-3 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-md shadow-sm hover:bg-slate-700 font-bold uppercase tracking-widest">Clear</button>
                    <button className="text-[10px] px-3 py-1.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-md shadow-sm hover:bg-red-600/20 font-bold uppercase tracking-widest">Pre-Adverse Action</button>
                </div>
              </div>

               <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">David L.</span>
                  <span className="text-[10px] px-2 py-1 bg-red-500/20 text-red-500 rounded-md font-bold uppercase tracking-wider">Failed</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Target: Persona ID mismatch.</p>
                <button className="text-[10px] w-full px-3 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-md shadow-sm hover:bg-slate-700 font-bold uppercase tracking-widest">Reject Account</button>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
      <div className={`p-4 rounded-full ${bg} ${color} mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-light text-white">{value}</p>
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
