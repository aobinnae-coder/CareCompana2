import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldAlert, ArrowLeft, CheckSquare, Square } from 'lucide-react';

export default function EmergencyReport() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    incidentTypes: [] as string[],
    date: '',
    time: '',
    location: '',
    was911Called: false,
    clientTransported: false,
    narrative: '',
    injuries: '',
    apsReported: false,
    policeReported: false,
    signature: ''
  });

  const incidentTypesList = [
    'Medical Emergency', 'Physical Abuse', 'Emotional / Verbal Abuse',
    'Financial Exploitation', 'Sexual Misconduct', 'Neglect / Self-Neglect',
    'Property Damage or Loss', 'Elopement / Missing Client',
    'Behavioral / Mental Health Crisis', 'Environmental / Safety Hazard'
  ];

  const handleToggleType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      incidentTypes: prev.incidentTypes.includes(type)
        ? prev.incidentTypes.filter(t => t !== type)
        : [...prev.incidentTypes, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        severity: '4_emergency',
        companionId: 'CMP-001',
        companionName: 'Maria Gonzalez',
        seniorName: 'Eleanor R.',
        visitId: 'VST-8821'
      })
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-slate-900 border-x border-slate-800 min-h-screen p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-light text-white mb-2">Report Submitted</h2>
        <p className="text-slate-400 text-sm mb-8">The CareCircle Trust & Safety team has been immediately notified. If this is a life-threatening emergency, ensure 911 has been called.</p>
        <button onClick={() => navigate('/companion')} className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 uppercase tracking-widest text-xs">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-[#0C0C0D] border-x border-slate-800 min-h-screen relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="bg-red-600/10 border-b border-red-500/20 p-4 sticky top-0 z-50 backdrop-blur-md flex items-center gap-4">
        <button onClick={() => navigate('/companion')} className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-full border border-slate-700 text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-red-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Emergency Report
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto pb-32">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <p className="text-xs text-red-400 mb-4 font-bold uppercase tracking-wider">⚠ COMPLETE WITHIN 2 HOURS OF INCIDENT</p>
          
          <h3 className="text-white font-bold text-sm mb-3">Incident Classification (Select all that apply)</h3>
          <div className="space-y-2 mb-4">
            {incidentTypesList.map(type => (
              <div key={type} onClick={() => handleToggleType(type)} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                {formData.incidentTypes.includes(type) ? <CheckSquare className="w-5 h-5 text-blue-500" /> : <Square className="w-5 h-5 text-slate-600" />}
                <span className="text-sm text-slate-300 font-medium">{type}</span>
              </div>
            ))}
          </div>

          <h3 className="text-white font-bold text-sm mb-3">Exact Location</h3>
          <input required type="text" value={formData.location} onChange={e => setFormData(p => ({...p, location: e.target.value}))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 mb-4" placeholder="e.g. Living room near the stairs" />
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-white font-bold text-sm">Emergency Response</h3>
          
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
             <span className="text-sm text-slate-300 font-medium">Was 911 Called?</span>
             <input type="checkbox" checked={formData.was911Called} onChange={e => setFormData(p => ({...p, was911Called: e.target.checked}))} className="w-5 h-5 accent-blue-600 bg-slate-800" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
             <span className="text-sm text-slate-300 font-medium">Client Transported?</span>
             <input type="checkbox" checked={formData.clientTransported} onChange={e => setFormData(p => ({...p, clientTransported: e.target.checked}))} className="w-5 h-5 accent-blue-600 bg-slate-800" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-white font-bold text-sm">Incident Narrative</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Describe exactly what happened (factual, objective).</p>
          <textarea required value={formData.narrative} onChange={e => setFormData(p => ({...p, narrative: e.target.value}))} className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Who was involved, what was observed, actions taken..."></textarea>
          
          <h3 className="text-white font-bold text-sm mt-6">Injuries & Physical Observations</h3>
          <textarea required value={formData.injuries} onChange={e => setFormData(p => ({...p, injuries: e.target.value}))} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Describe any visible injuries or symptoms..."></textarea>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-white font-bold text-sm">Mandatory Reporting Checklist</h3>
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
             <span className="text-sm text-slate-300 font-medium">Reported to Adult Protective Services (APS)</span>
             <input type="checkbox" checked={formData.apsReported} onChange={e => setFormData(p => ({...p, apsReported: e.target.checked}))} className="w-5 h-5 accent-blue-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
             <span className="text-sm text-slate-300 font-medium">Reported to Local Law Enforcement</span>
             <input type="checkbox" checked={formData.policeReported} onChange={e => setFormData(p => ({...p, policeReported: e.target.checked}))} className="w-5 h-5 accent-blue-600" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-white font-bold text-sm">Certification</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">I certify that this report is accurate to the best of my knowledge.</p>
          <input required type="text" value={formData.signature} onChange={e => setFormData(p => ({...p, signature: e.target.value}))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Type full legal name to sign" />
        </div>

        <button type="submit" className="w-full py-4 bg-red-600/10 text-red-500 font-bold rounded-xl border border-red-500/50 hover:bg-red-600/20 uppercase tracking-widest text-xs transition-colors">
          Submit Emergency Report
        </button>
      </form>
    </div>
  );
}
