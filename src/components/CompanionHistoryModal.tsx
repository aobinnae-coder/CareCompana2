import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompanionHistoryModalProps {
  companionId: string;
  onClose: () => void;
}

export default function CompanionHistoryModal({ companionId, onClose }: CompanionHistoryModalProps) {
  const [historyData, setHistoryData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/companions/${companionId}/history`)
      .then(res => res.json())
      .then(data => setHistoryData(data))
      .catch(err => console.error("Error fetching companion history:", err));
  }, [companionId]);

  if (!historyData) return null;

  // Mocking risk score timeline data based on current score
  const mockRiskScoreTimeline = Array.from({ length: 6 }).map((_, i) => ({
    name: `Week ${i + 1}`,
    score: Math.min(100, Math.max(0, historyData.companion.riskScore + (5 - i) * (Math.random() > 0.5 ? 5 : -5))),
  })).reverse();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0C0C0D] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-light text-white">Companion Profile & History</h2>
          <p className="text-sm text-slate-400">{historyData.companion.name} ({historyData.companion.id})</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
               <p className="text-[10px] uppercase font-bold text-slate-500">Risk Score</p>
               <p className={`text-2xl font-bold font-mono ${historyData.companion.riskScore < 70 ? 'text-red-500' : 'text-emerald-500'}`}>{historyData.companion.riskScore}</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
               <p className="text-[10px] uppercase font-bold text-slate-500">Visits</p>
               <p className="text-2xl font-bold font-mono text-white">{historyData.companion.completedVisits} / {historyData.companion.totalVisits}</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
               <p className="text-[10px] uppercase font-bold text-slate-500">Cancellations</p>
               <p className="text-2xl font-bold font-mono text-white">{historyData.companion.cancellations}</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
               <p className="text-[10px] uppercase font-bold text-slate-500">Avg Rating</p>
               <p className="text-2xl font-bold font-mono text-white">
                 {historyData.companion.ratings.length ? (historyData.companion.ratings.reduce((a:number,b:number)=>a+b,0)/historyData.companion.ratings.length).toFixed(1) : 'N/A'}
               </p>
             </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Risk Score Timeline</h3>
            <div className="h-48 w-full bg-slate-900/50 rounded-xl p-4 border border-slate-800">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={mockRiskScoreTimeline}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                   <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                   <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} axisLine={false} width={30} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                     itemStyle={{ color: '#60a5fa' }}
                   />
                   <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 6 }} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Recent Incidents</h3>
            {historyData.incidents.length === 0 ? (
              <p className="text-sm text-slate-500">No recorded incidents.</p>
            ) : (
              <div className="space-y-3">
                {historyData.incidents.map((inc: any) => (
                  <div key={inc.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-red-400">{inc.severity} - {inc.incidentTypes && inc.incidentTypes[0] ? inc.incidentTypes[0] : 'Reported'}</span>
                      <span className="text-[10px] text-slate-500">{new Date(inc.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{inc.narrative}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
