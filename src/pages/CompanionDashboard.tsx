import React, { useEffect, useState } from 'react';
import { MapPin, Clock, DollarSign, ChevronRight, ShieldCheck, Star, MessageSquare, Navigation, User, X, FileText, Upload, Brain } from 'lucide-react';

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
          body: JSON.stringify({ 
            bio, 
            skills: skillsList,
            languages: languagesList,
            certifications: certificationsList,
            avatarUrl
          })
        }).catch(err => console.log(err.message));
      } catch (err) {
        console.error("Failed to save profile", err);
      }
    }
    setEditMode(!editMode);
  };
  const [bio, setBio] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [languagesList, setLanguagesList] = useState<string[]>(['English']);
  const [certificationsList, setCertificationsList] = useState<string[]>(['CPR Certified']);
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Companion');
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [nearbyJobs] = useState([
    { id: 'JOB-001', name: 'Eleanor R.', type: 'senior', date: 'Tomorrow, 10:00 AM', priority: false, location: '2.5 miles away', distance: 2.5, rating: 4.8, payout: '$35.00', reqSkills: ['Dementia Care'], aiMatchScore: 98 },
    { id: 'JOB-002', name: 'Arthur D.', type: 'senior', date: 'Today, 4:00 PM', priority: true, location: '1.1 miles away', distance: 1.1, rating: 4.5, payout: '$45.00', reqSkills: ['Physical Therapy Assist'], aiMatchScore: 85 },
    { id: 'JOB-003', name: 'Martha S.', type: 'senior', date: 'Friday, 1:00 PM', priority: false, location: '3.8 miles away', distance: 3.8, rating: 4.2, payout: '$30.00', reqSkills: ['Medication Reminders'], aiMatchScore: 92 },
    { id: 'JOB-004', name: 'John K.', type: 'senior', date: 'Monday, 9:00 AM', priority: false, location: '1.5 miles away', distance: 1.5, rating: 4.9, payout: '$40.00', reqSkills: ['Alzheimer\'s Care'], aiMatchScore: 78 },
    { id: 'JOB-005', name: 'Smith Family', type: 'family_admin', date: 'Flexible', priority: false, location: 'Remote', distance: 0, rating: 5.0, payout: '$25.00', reqSkills: ['Care Scheduling'], aiMatchScore: 60 }
  ]);
  const [filterSkill, setFilterSkill] = useState('');
  const [filterDistance, setFilterDistance] = useState<number>(10);
  const [filterMinRating, setFilterMinRating] = useState<number>(0);
  const [filterPriorityOnly, setFilterPriorityOnly] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'senior' | 'family_admin'>('senior');
  const [bgStatus] = useState('pending');
  const [idStatus] = useState('verified');
  const [showCalendar, setShowCalendar] = useState(false);
  const [blockedDates, setBlockedDates] = useState(['2026-05-01', '2026-05-02']);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'family', text: 'Hi! Just making sure you know where the spare key is.', time: '09:40 AM' },
    { id: 2, sender: 'companion', text: 'Yes, it is under the flower pot. See you soon!', time: '09:45 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [matchingJob, setMatchingJob] = useState<any>(null);
  const [uploadedFiles] = useState([
    { name: 'Daily Care Plan.pdf', size: '2.4 MB', date: 'Oct 12' },
    { name: 'Medical Directives.pdf', size: '1.1 MB', date: 'Oct 10' }
  ]);
  
  const toggleDate = (dateStr: string) => {
     if (blockedDates.includes(dateStr)) {
        setBlockedDates(blockedDates.filter(d => d !== dateStr));
     } else {
        setBlockedDates([...blockedDates, dateStr]);
     }
  };
  
  const ratingHistory = [
    { month: 'Jan', rating: 4.8 },
    { month: 'Feb', rating: 4.9 },
    { month: 'Mar', rating: 4.7 },
    { month: 'Apr', rating: 4.9 },
    { month: 'May', rating: 5.0 },
  ];

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
      })
      .catch(err => console.log('Network err', err.message));

    fetch('/api/visits')
      .then(res => res.json())
      .then(data => {
        // Find Maria's visit
        const active = data.find((v: any) => v.id === 'VST-8821');
        if (active) setVisit(active);
      })
      .catch(err => console.log('Network err', err.message));

    const params = new URLSearchParams(window.location.search);
    if (params.get('onboarding_paid')) {
      alert("Background check fee paid! Checkr processing initiated.");
      window.history.replaceState({}, '', '/companion');
    }
    if (params.get('connect_success')) {
      alert("Stripe Connect setup successful! You can now receive automatic payouts.");
      window.history.replaceState({}, '', '/companion');
    }

    if (isAvailable) {
       const mJob = nearbyJobs.find(j => j.priority && j.reqSkills.some(s => skillsList.includes(s)));
       if (mJob) {
          setMatchingJob(mJob);
          const timer = setTimeout(() => setShowNotification(true), 3000);
          return () => clearTimeout(timer);
       }
    }
  }, [isAvailable, nearbyJobs, skillsList]);

  const updateStatus = async (status: string) => {
    if (!visit) return;
    const res = await fetch(`/api/visits/${visit.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => { console.log(err.message); return null; });
    if (!res) return;
    const updated = await res.json();
    setVisit(updated);
  };

  const completeVisit = async () => {
    if (!visit) return;
    const res = await fetch(`/api/visits/${visit.id}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note })
    }).catch(err => { console.log(err.message); return null; });
    if (!res) return;
    const updated = await res.json();
    setVisit(updated);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border-x border-slate-800 min-h-screen pb-20 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {showNotification && matchingJob && (
         <div className="absolute top-4 left-4 right-4 bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl z-50 animate-bounce flex justify-between items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1">New High-Priority Match!</p>
              <p className="text-sm">{matchingJob.name} matches your skills. Starts {matchingJob.date.toLowerCase()}.</p>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-emerald-200 hover:text-white">&times;</button>
         </div>
      )}

      {/* Mobile App Simulator Header */}
      <div className="bg-blue-600 text-white pt-12 pb-6 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
               <img src={avatarUrl} alt="Profile" className="w-12 h-12 rounded-full bg-slate-800 border-2 border-white/20 object-cover" />
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
          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Current Status</span>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isAvailable} 
                    onChange={() => setIsAvailable(!isAvailable)} 
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${isAvailable ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAvailable ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-xs font-bold uppercase tracking-wider text-white w-20">
                  {isAvailable ? 'Available' : 'Invisible'}
                </div>
              </label>
            </div>
            
            <button 
               onClick={() => setShowCalendar(!showCalendar)}
               className="bg-blue-700/50 hover:bg-blue-700 text-[10px] font-bold uppercase tracking-wider text-white py-2 px-3 rounded-lg border border-blue-500/50 transition-colors self-end"
            >
               {showCalendar ? 'Hide Calendar' : 'Manage Availability Calendar'}
            </button>
            
            {showCalendar && (
               <div className="bg-slate-900/50 rounded-xl p-3 border border-white/10 mt-2">
                  <p className="text-[10px] text-blue-200 mb-2 uppercase font-bold tracking-wider">Select Dates to Block Out</p>
                  <div className="grid grid-cols-5 gap-2">
                    {['2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08', '2026-05-09', '2026-05-10'].map((date) => {
                       const d = new Date(date);
                       const isBlocked = blockedDates.includes(date);
                       return (
                          <div 
                             key={date}
                             onClick={() => toggleDate(date)}
                             className={`p-2 rounded-lg text-center cursor-pointer border flex flex-col items-center justify-center transition-all ${isBlocked ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                          >
                             <span className="text-[8px] uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                             <span className="text-xs font-bold">{d.getDate()}</span>
                          </div>
                       )
                    })}
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Alerts for Verification */}
        { (bgStatus === 'pending' || idStatus === 'pending' || bgStatus === 'failed' || idStatus === 'failed') && (
           <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex flex-col items-center justify-center text-center relative">
             <ShieldCheck className="w-8 h-8 text-red-500/50 mb-2" />
             <p className="text-xs font-bold uppercase tracking-widest mb-1">Action Required</p>
             <p className="text-[10px] uppercase font-bold text-red-500/70">
                Your ID or Background Check is {bgStatus === 'failed' || idStatus === 'failed' ? 'Failed' : 'Pending'}. You cannot accept visits.
             </p>
           </div>
        )}

         {/* Verification Status */}
        <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 relative">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Verification Status</h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3 text-emerald-400" />
                     Stripe Identity
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Government ID API limits</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${idStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : idStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                   {idStatus}
                </span>
             </div>
             <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3 text-emerald-400" />
                     Checkr BG Check
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">SSN tracing API sync</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${bgStatus === 'clear' ? 'bg-emerald-500/20 text-emerald-400' : bgStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                   {bgStatus}
                </span>
             </div>
          </div>
        </div>

        {/* Profile Details Block */}
        <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 relative">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-white text-sm uppercase tracking-wider">My Profile</h3>
             <div className="flex gap-2">
               <button 
                 onClick={() => setShowCalendar(!showCalendar)} 
                 className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1 rounded font-bold uppercase tracking-wider hover:bg-slate-700"
               >
                 {showCalendar ? 'Close Calendar' : 'Schedule Availability'}
               </button>
               <button onClick={toggleEditMode} className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1 rounded font-bold uppercase tracking-wider hover:bg-slate-700">
                 {editMode ? 'Save' : 'Edit Profile'}
               </button>
             </div>
          </div>
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Profile Avatar URL</label>
                <input type="text" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs h-20"></textarea>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Languages Spoken</label>
                <div className="flex flex-wrap gap-2 mt-1 mb-2">
                  {languagesList.map((lang, idx) => (
                    <span key={idx} className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      {lang}
                      <button onClick={() => setLanguagesList(languagesList.filter((_, i) => i !== idx))} className="hover:text-red-400 ml-1">&times;</button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={newLanguage} 
                  onChange={e => setNewLanguage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newLanguage.trim()) {
                      e.preventDefault();
                      if (!languagesList.includes(newLanguage.trim())) {
                        setLanguagesList([...languagesList, newLanguage.trim()]);
                      }
                      setNewLanguage('');
                    }
                  }}
                  placeholder="Type a language and press Enter"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Certifications</label>
                <div className="flex flex-wrap gap-2 mt-1 mb-2">
                  {certificationsList.map((cert, idx) => (
                    <span key={idx} className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      {cert}
                      <button onClick={() => setCertificationsList(certificationsList.filter((_, i) => i !== idx))} className="hover:text-red-400 ml-1">&times;</button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={newCertification} 
                  onChange={e => setNewCertification(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newCertification.trim()) {
                      e.preventDefault();
                      if (!certificationsList.includes(newCertification.trim())) {
                        setCertificationsList([...certificationsList, newCertification.trim()]);
                      }
                      setNewCertification('');
                    }
                  }}
                  placeholder="Type a certification and press Enter"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs" 
                />
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
                
                <div className="mb-3">
                  <span className="text-[9px] uppercase font-bold text-slate-600 tracking-wider mb-1 block">Suggested Care Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Dementia Care', 'Alzheimer\'s Care', 'Stroke Recovery', 'Physical Therapy Assist', 'Medication Reminders'].map(skill => (
                      <button 
                        key={skill}
                        onClick={() => {
                          if (!skillsList.includes(skill)) setSkillsList([...skillsList, skill]);
                        }}
                        className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider hover:bg-slate-700"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
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
                  placeholder="Type a custom skill and press Enter"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs" 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed"><span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Bio</span>{bio}</p>
              
              <div className="flex gap-4 flex-wrap">
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Languages</span>
                  <div className="flex flex-wrap gap-2">
                    {languagesList.map((lang, idx) => (
                      <span key={idx} className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Certifications</span>
                  <div className="flex flex-wrap gap-2">
                    {certificationsList.map((cert, idx) => (
                      <span key={idx} className="text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Skills</span>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Rating History</span>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-end h-24">
                  {ratingHistory.map((rh) => (
                    <div key={rh.month} className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-emerald-500 rounded-t-sm" style={{ height: `${(rh.rating / 5) * 50}px` }}></div>
                      <span className="text-[8px] uppercase font-bold text-slate-500">{rh.month}</span>
                      <span className="text-[10px] font-bold text-emerald-400">{rh.rating}</span>
                    </div>
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
                 const res = await fetch('/api/payments/companion/onboarding', { method: 'POST' }).catch(err => { console.log(err.message); return null; });
                 if (!res) return;
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
             const res = await fetch('/api/payments/companion/connect', { method: 'POST' }).catch(err => { console.log(err.message); return null; });
             if (!res) return;
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

        {/* Secure File Hub for Companions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden mt-6">
           <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <FileText className="w-4 h-4" />
                 </div>
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider">Secure File Hub</h3>
              </div>
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2">
                 <Upload className="w-3 h-3" /> Upload
              </button>
           </div>
           <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">HIPAA-compliant document storage. Access medical directives and daily care plans for your active visits.</p>
           <div className="flex flex-col gap-3">
              {uploadedFiles.map((file, i) => (
                 <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex justify-between items-center group hover:border-slate-600 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-white truncate max-w-[150px]">{file.name}</p>
                          <p className="text-[10px] text-slate-500">{file.size} • Last Updated: {file.date}</p>
                       </div>
                    </div>
                    <button className="text-purple-500 text-[10px] uppercase font-bold tracking-wider hover:text-purple-400">View</button>
                 </div>
              ))}
           </div>
        </div>

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
                <>
                  <div className="mb-4 h-32 bg-slate-900 rounded-xl relative overflow-hidden border border-slate-800">
                    <div className="absolute inset-0 bg-[#0f172a] opacity-50">
                       <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
                       <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <path d="M 20,100 T 150,50 300,80" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 3" className="animate-pulse" />
                       </svg>
                    </div>
                    <div className="absolute inset-x-2 bottom-2 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-2 flex items-center justify-between z-10">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                           <Navigation className="w-4 h-4" />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-white uppercase tracking-widest">En Route to Senior</span>
                           <span className="text-[9px] text-blue-300 font-mono">Live Routing: 1.4 mi • 12 mins ETA</span>
                         </div>
                       </div>
                    </div>
                  </div>
                  <button onClick={() => updateStatus('arrived')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors mb-2">
                    Confirm Arrival (GPS Verify)
                  </button>
                </>
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
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Nearby Requests</h3>
             </div>
             
             <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 mb-4">
               <button 
                 onClick={() => setRoleFilter('senior')}
                 className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${roleFilter === 'senior' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 Senior visits
               </button>
               <button 
                 onClick={() => setRoleFilter('family_admin')}
                 className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${roleFilter === 'family_admin' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 Family Admin roles
               </button>
             </div>
             <div className="grid grid-cols-2 gap-2 mb-4">
               <div className="col-span-2 mb-2">
                  <button 
                    onClick={() => setFilterPriorityOnly(!filterPriorityOnly)}
                    className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filterPriorityOnly ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    {filterPriorityOnly ? '★ Showing High Priority Only' : 'Show All Priority Levels'}
                  </button>
               </div>
               <div className="col-span-2">
                 <input 
                   type="text" 
                   placeholder="Search by client name..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-emerald-500"
                 />
               </div>
               <div>
                  <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block px-1">Care Need</label>
                  <select 
                    value={filterSkill}
                    onChange={e => setFilterSkill(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-emerald-500 appearance-none"
                  >
                     <option value="">All Needs</option>
                     <option value="Dementia Care">Dementia Care</option>
                     <option value="Alzheimer's Care">Alzheimer's Care</option>
                     <option value="Stroke Recovery">Stroke Recovery</option>
                     <option value="Physical Therapy Assist">Phys Therapy</option>
                     <option value="Medication Reminders">Med Reminders</option>
                  </select>
               </div>
               <div>
                  <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block px-1">Max Distance</label>
                  <select 
                    value={filterDistance}
                    onChange={e => setFilterDistance(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-emerald-500 appearance-none"
                  >
                     <option value="2">Under 2mi</option>
                     <option value="5">Under 5mi</option>
                     <option value="10">Under 10mi</option>
                     <option value="25">Under 25mi</option>
                     <option value="100">Anywhere</option>
                  </select>
               </div>
               <div className="col-span-2">
                  <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block px-1">Min Client Rating</label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1">
                    {[0, 3, 4, 4.5].map(r => (
                      <button 
                        key={r}
                        onClick={() => setFilterMinRating(r)}
                        className={`flex-1 py-1 text-[9px] font-bold uppercase rounded-lg transition-colors ${filterMinRating === r ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-400'}`}
                      >
                        {r === 0 ? 'All' : `${r}+ ★`}
                      </button>
                    ))}
                  </div>
               </div>
             </div>

             <div className="space-y-3">
               {nearbyJobs
                 .filter(j => 
                   j.type === roleFilter && 
                   j.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                   (filterSkill === '' || j.reqSkills.includes(filterSkill)) &&
                   (j.distance <= filterDistance || j.distance === 0) &&
                   (j.rating >= filterMinRating) &&
                   (!filterPriorityOnly || j.priority)
                 )
                 .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
                 .map(job => (
                 <div key={job.id} className="bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-800 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${job.priority ? 'bg-amber-500' : (roleFilter === 'senior' ? 'bg-emerald-500' : 'bg-purple-500')}`}></div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                           {roleFilter === 'senior' ? 'Companionship' : 'Admin role'} <span className="text-slate-400 font-normal">with</span> {job.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${job.priority ? 'text-amber-400' : 'text-blue-400'}`}>
                            {job.date}
                          </p>
                          <span className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest"><Brain className="w-2.5 h-2.5" /> {job.aiMatchScore}% AI Match</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400 text-sm block">{job.payout}</span>
                        {job.priority && <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest mt-1 inline-block">High Priority</span>}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3 text-[10px] text-slate-400 font-medium">
                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>
                       <div className="flex gap-1 flex-wrap justify-end pl-2">
                          {job.reqSkills.map(skill => {
                            const isMatch = skillsList.includes(skill);
                            return (
                              <span key={skill} className={`${isMatch ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'} px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider`}>
                                {skill}
                              </span>
                            );
                          })}
                       </div>
                    </div>

                    <button className="w-full bg-slate-800 hover:bg-slate-700 transition-colors text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-widest border border-slate-700">
                      Accept {roleFilter === 'senior' ? 'Visit' : 'Role'}
                    </button>
                 </div>
               ))}
               {nearbyJobs.filter(j => j.type === roleFilter && j.name.toLowerCase().includes(searchQuery.toLowerCase()) && (filterSkill === '' || j.reqSkills.includes(filterSkill))).length === 0 && (
                 <p className="text-xs text-slate-500 text-center py-4">No jobs match your criteria.</p>
               )}
             </div>
          </div>
        )}
      </div>

      {/* Mock Mobile Tab Bar */}
      <div className="fixed bottom-0 w-full max-w-md bg-slate-950 border-t border-slate-800 flex justify-around py-4 px-6 z-50 rounded-t-3xl backdrop-blur-xl bg-opacity-90">
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

      {/* Real-time Chat Floating Widget */}
      {showChat && (
        <div className="fixed bottom-24 right-4 w-[90%] left-[5%] max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden">
          <div className="bg-blue-600 p-4 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30">
                  <User className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-white font-bold text-sm leading-tight">Family Chat</p>
                   <p className="text-blue-100/80 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 mt-0.5"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Online</p>
                </div>
             </div>
             <button onClick={() => setShowChat(false)} className="text-blue-200 hover:text-white transition-colors p-1"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4 h-56 overflow-y-auto space-y-4 bg-slate-950 flex flex-col">
             <div className="text-center">
                <span className="bg-slate-900 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Today</span>
             </div>
             {messages.map(m => (
                <div key={m.id} className={`max-w-[85%] p-3 text-xs ${m.sender === 'companion' ? 'bg-blue-600 text-white self-end rounded-2xl rounded-br-sm' : 'bg-slate-800 border border-slate-700 text-slate-300 self-start rounded-2xl rounded-bl-sm'}`}>
                   <p className="leading-relaxed">{m.text}</p>
                   <p className={`text-[8px] mt-1.5 font-bold tracking-wider ${m.sender === 'companion' ? 'text-blue-200/70 text-right' : 'text-slate-500 text-left'}`}>{m.time}</p>
                </div>
             ))}
          </div>
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 relative">
             <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && newMessage) { setMessages([...messages, {id: Date.now(), sender:'companion', text: newMessage, time: 'Just now'}]); setNewMessage(''); } }} placeholder="Message family..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-blue-500 pr-10 shadow-inner" />
             <button onClick={() => {
                if(newMessage) {
                  setMessages([...messages, {id: Date.now(), sender:'companion', text: newMessage, time: 'Just now'}]);
                  setNewMessage('');
                }
             }} className="absolute right-5 top-5 text-blue-500 hover:text-blue-400 transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
             </button>
          </div>
        </div>
      )}
      
      {/* Floating Chat Button */}
      {!showChat && visit && ['pending', 'en_route', 'arrived', 'in_progress'].includes(visit.status) && (
        <button onClick={() => setShowChat(true)} className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-[0_10px_25px_rgba(37,99,235,0.5)] flex items-center justify-center text-white transition-all hover:scale-105 z-40 border border-blue-400/30">
           <MessageSquare className="w-6 h-6" />
           <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">1</span>
        </button>
      )}

    </div>
  );
}
