import React, { useEffect, useState } from 'react';
import { MapPin, Clock, DollarSign, ChevronRight, ShieldCheck, Star } from 'lucide-react';

export default function CompanionDashboard() {
  const [visit, setVisit] = useState<any>(null);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [companion, setCompanion] = useState<any>(null);
  
  const [editMode, setEditMode] = useState(false);
  
  const toggleEditMode = async () => {
    if (editMode) {
      // Save changes
      try {
        await fetch('/api/companions/CMP-001/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bio, skills: skillsList })
        });
      } catch (err) {
        console.error("Failed to save profile", err);
      }
    }
    setEditMode(!editMode);
  };
  const [bio, setBio] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetch('/api/companions/CMP-001')
      .then(res => res.json())
      .then(data => {
         setCompanion(data);
         setBio(data.bio || 'Compassionate caregiver with 5 years of experience.');
         if (data.skills && Array.isArray(data.skills)) {
           setSkillsList(data.skills);
         } else if (typeof data.skills === 'string') {
           setSkillsList(data.skills.split(',').map((s:string) => s.trim()).filter((s:string) => s));
         } else {
           setSkillsList(['Dementia Care', 'Mobility Assistance', 'Conversational Spanish']);
         }
      });

    fetch('/api/visits')
      .then(res => res.json())
      .then(data => {
        // Find Maria's visit
        const active = data.find((v: any) => v.id === 'VST-8821');
        if (active) setVisit(active);
      });

    const params = new URLSearchParams(window.location.search);
    if (params.get('onboarding_paid')) {
      alert("Background check fee paid! Checkr processing initiated.");
      window.history.replaceState({}, '', '/companion');
    }
    if (params.get('connect_success')) {
      alert("Stripe Connect setup successful! You can now receive automatic payouts.");
      window.history.replaceState({}, '', '/companion');
    }

  }, []);

  const updateStatus = async (status: string) => {
    if (!visit) return;
    const res = await fetch(`/api/visits/${visit.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const updated = await res.json();
    setVisit(updated);
  };

  const completeVisit = async () => {
    if (!visit) return;
    const res = await fetch(`/api/visits/${visit.id}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note })
    });
    const updated = await res.json();
    setVisit(updated);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border-x border-slate-800 min-h-screen pb-20 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Mobile App Simulator Header */}
      <div className="bg-blue-600 text-white pt-12 pb-6 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Companion`} alt="Profile" className="w-12 h-12 rounded-full bg-slate-800 border-2 border-white/20" />
               <div>
                 <h2 className="font-bold text-lg leading-tight">Maria S.</h2>
                 <div className="flex items-center gap-1 text-blue-100 text-xs font-bold uppercase tracking-wider">
                   <Star className="w-3 h-3 fill-current" /> 4.9 Rating
                 </div>
               </div>
            </div>
            <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Details Block */}
        <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 relative">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-white text-sm uppercase tracking-wider">My Profile</h3>
             <button onClick={toggleEditMode} className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1 rounded font-bold uppercase tracking-wider hover:bg-slate-700">
               {editMode ? 'Save' : 'Edit Profile'}
             </button>
          </div>
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs h-20"></textarea>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Skills</label>
                <div className="flex flex-wrap gap-2 mt-1 mb-2">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      {skill}
                      <button onClick={() => setSkillsList(skillsList.filter((_, i) => i !== idx))} className="hover:text-red-400 ml-1">&times;</button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newSkill.trim()) {
                      e.preventDefault();
                      if (!skillsList.includes(newSkill.trim())) {
                        setSkillsList([...skillsList, newSkill.trim()]);
                      }
                      setNewSkill('');
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs" 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed"><span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Bio</span>{bio}</p>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Skills</span>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Training Modules Block */}
        <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 relative">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Training Modules</h3>
          <p className="text-xs text-slate-400 mb-4">Complete required safety training and certifications.</p>
          <button onClick={() => window.location.href = '/companion/certification'} className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex justify-between items-center transition-colors">
            Safety Certification Quiz <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Compliance Block */}
        {companion && !companion.isCertified && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <ShieldCheck className="w-16 h-16 text-yellow-500" />
             </div>
             <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-2">Registration Incomplete</h3>
             <p className="text-xs text-yellow-400 mb-4 leading-relaxed">You must complete Legal Onboarding, Safety Certification, and pay the $25 Background Check (Checkr) fee to accept new visits.</p>
             <div className="flex flex-col sm:flex-row gap-2">
               <button onClick={async () => {
                 const res = await fetch('/api/payments/companion/onboarding', { method: 'POST' });
                 const data = await res.json();
                 if (data.url) window.location.href = data.url;
               }} className="bg-yellow-500/20 text-yellow-400 text-xs font-bold py-2.5 px-4 rounded-xl uppercase tracking-widest border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors text-center w-full">
                 Pay $25 Fee & Verify
               </button>
               <button onClick={() => window.location.href = '/companion/certify'} className="bg-slate-800 text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-colors text-center w-full">
                 Start Training
               </button>
             </div>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden mt-6">
           <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Payout Settings</h3>
           <p className="text-xs text-slate-400 mb-4 leading-relaxed">
             Link your bank account via Stripe Connect to receive automatic payments after each completed visit.
           </p>
           <button onClick={async () => {
             const res = await fetch('/api/payments/companion/connect', { method: 'POST' });
             const data = await res.json();
             if (data.url) window.location.href = data.url;
           }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl uppercase tracking-widest transition-colors w-full">
             Set up Bank Payouts
           </button>
        </div>

        {/* Emergency Block */}
        <button onClick={() => window.location.href = '/companion/emergency-report'} className="w-full flex items-center justify-between bg-red-600/10 border border-red-500/20 p-4 rounded-2xl hover:bg-red-600/20 transition-colors group">
           <div className="flex flex-col text-left">
             <span className="text-red-500 font-bold uppercase tracking-widest text-xs mb-1">File Emergency Report</span>
             <span className="text-[10px] text-red-500/70 font-medium">L3/L4 Mandatory Reporting</span>
           </div>
           <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
        </button>

        {visit && visit.status !== 'completed' && visit.status !== 'cancelled' ? (
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Current Visit</h3>
            <div className="bg-slate-950 rounded-[2rem] p-5 shadow-sm border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-white text-base">Companionship <span className="text-slate-400 font-normal">with</span> {visit.seniorName}</h4>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mt-1">{visit.status.replace('_', ' ')}</p>
                </div>
              </div>

              {visit.status === 'pending' && (
                <button onClick={() => updateStatus('en_route')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors mb-2">
                  Start GPS & Head to Senior
                </button>
              )}
              {visit.status === 'en_route' && (
                <button onClick={() => updateStatus('arrived')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors mb-2">
                  Confirm Arrival (GPS Verify)
                </button>
              )}
              {visit.status === 'arrived' && (
                <button onClick={() => updateStatus('in_progress')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors mb-2">
                  Check In & Start Visit
                </button>
              )}
              {visit.status === 'in_progress' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Mood</label>
                    <select value={mood} onChange={e => setMood(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-sm">
                      <option value="">Select mood...</option>
                      <option value="Joyful">Joyful</option>
                      <option value="Calm">Calm</option>
                      <option value="Anxious">Anxious</option>
                      <option value="Lethargic">Lethargic</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Visit Notes / Photos</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How did the visit go?" className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-sm h-24"></textarea>
                    
                    <div className="mt-2 flex gap-2">
                       <button className="flex-1 border border-slate-700 text-slate-300 rounded-lg p-2 text-xs font-bold uppercase tracking-wider text-center">Add Photo</button>
                    </div>
                  </div>
                  <button onClick={completeVisit} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors">
                    Complete Visit
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
             <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Nearby Requests</h3>
             {/* Fallback mock job */}
             <div className="bg-slate-950 rounded-[2rem] p-5 shadow-sm border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-white text-base">Companionship <span className="text-slate-400 font-normal">with</span> Eleanor R.</h4>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mt-1">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
                <button className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest border border-slate-700">
                  Accept Visit
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Mock Mobile Tab Bar */}
      <div className="absolute bottom-0 w-full max-w-md bg-slate-950 border-t border-slate-800 flex justify-around py-4 px-6 z-50 rounded-t-3xl backdrop-blur-xl bg-opacity-90">
        <div className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-400 cursor-pointer">
          <MapPin className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Find</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-blue-500">
          <Clock className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Schedule</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-400 cursor-pointer">
          <DollarSign className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Earnings</span>
        </div>
      </div>
    </div>
  );
}
