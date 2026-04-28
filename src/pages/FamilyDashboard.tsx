import React, { useEffect, useState } from 'react';
import { Calendar, User, Clock, Heart, AlertCircle, ArrowRight, Star, MapPin, CreditCard, Check, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FamilyDashboard() {
  const [visit, setVisit] = useState<any>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingHours, setBookingHours] = useState(2);
  const [bookingSpecialized, setBookingSpecialized] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'basic' | 'care-plus' | 'family-pro'>('basic');
  const [isYearly, setIsYearly] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed mind');

  const fetchVisits = () => {
    fetch('/api/visits')
      .then(res => res.json())
      .then(data => {
        const active = data.find((v: any) => v.id === 'VST-8821');
        if (active) setVisit(active);
      });
  };

  useEffect(() => {
    fetchVisits();
    // Check URL for stripe success
    const params = new URLSearchParams(window.location.search);
    if (params.get('booking_success') || params.get('mock_booking_success')) {
      alert("Payment successful! Your visit has been booked.");
      window.history.replaceState({}, '', '/family');
    }
    if (params.get('session_id') || params.get('mock_subscribe_success')) {
      alert("Subscription activated successfully!");
      setSubscriptionTier('care-plus'); // Simple mock upgrade
      window.history.replaceState({}, '', '/family');
    }
    if (params.get('mock_portal')) {
      alert("Mock Billing Portal opened. (Stripe is not configured)");
      window.history.replaceState({}, '', '/family');
    }
    const int = setInterval(fetchVisits, 3000);
    return () => clearInterval(int);
  }, []);

  const handleCancelClick = () => {
    if (!visit) return;
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!visit) return;
    const res = await fetch(`/api/visits/${visit.id}/cancel`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: cancelReason })
    });
    const data = await res.json();
    setShowCancelModal(false);
    if (data.penaltyApplied) alert("Late cancellation penalty applied (24h policy).");
    fetchVisits();
  };

  const submitRating = async (r: number) => {
    setRating(r);
    await fetch(`/api/visits/${visit.id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: r })
    });
    fetchVisits();
  };

  const handleBookVisit = async () => {
    const res = await fetch('/api/payments/family/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours: bookingHours, specialized: bookingSpecialized })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const handleSubscribe = async (tier: string, yearly: boolean) => {
    const res = await fetch('/api/payments/family/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, yearly })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const handleManageBilling = async () => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id') || 'mock_session_123'; // In real app, derived from DB
    const res = await fetch('/api/payments/family/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
       {/* Booking Modal */}
       {showBookingModal && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
              <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              <h2 className="text-xl font-bold text-white mb-2">Book New Visit</h2>
              <p className="text-slate-400 text-sm mb-6">Select duration and care type.</p>
              
              <div className="space-y-4 mb-6">
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Duration (Hours)</label>
                   <input type="number" min="1" max="12" value={bookingHours} onChange={e => setBookingHours(parseInt(e.target.value) || 1)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                 </div>
                 <div>
                   <label className="flex items-center gap-3 p-3 border border-slate-800 rounded-xl bg-slate-950 cursor-pointer hover:border-slate-700 transition-colors">
                     <input type="checkbox" checked={bookingSpecialized} onChange={e => setBookingSpecialized(e.target.checked)} className="w-5 h-5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900" />
                     <div>
                       <p className="text-sm font-bold text-white">Tier 2 Specialized Care</p>
                       <p className="text-[10px] text-slate-500 uppercase tracking-wider">For Dementia, Alzheimer's, etc.</p>
                     </div>
                   </label>
                 </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 mb-6 space-y-2 text-sm text-slate-300">
                 <div className="flex justify-between">
                   <span>Hourly Rate ({bookingSpecialized ? 'Specialized' : 'Standard'})</span>
                   <span>${bookingSpecialized ? '45' : '35'}/hr</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Hours</span>
                   <span>x {bookingHours}</span>
                 </div>
                 <div className="flex justify-between text-slate-500 border-b border-slate-800 pb-2">
                   <span>Trust & Support Fee (10%)</span>
                   <span>${(bookingHours * (bookingSpecialized ? 45 : 35) * 0.10).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between font-bold text-white pt-2">
                   <span>Total</span>
                   <span>${(bookingHours * (bookingSpecialized ? 45 : 35) * 1.10).toFixed(2)}</span>
                 </div>
              </div>

              <button onClick={handleBookVisit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> Check out with Stripe
              </button>
           </div>
         </div>
       )}

       {/* Cancel Modal */}
       {showCancelModal && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative">
             <button onClick={() => setShowCancelModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
             <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-white mb-2">Cancel Visit?</h2>
             <p className="text-slate-400 text-sm mb-6">Cancellations under 24 hours may incur a penalty.</p>
             
             <div className="text-left mb-6">
               <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider">Reason for Cancellation</label>
               <select 
                 value={cancelReason} 
                 onChange={e => setCancelReason(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
               >
                 <option value="Changed mind">Changed mind</option>
                 <option value="No longer needed">No longer needed / Schedule changed</option>
                 <option value="Found alternative care">Found alternative care</option>
                 <option value="Senior is unwell/hospitalized">Senior is unwell/hospitalized</option>
                 <option value="Other">Other</option>
               </select>
             </div>

             <div className="flex gap-4">
               <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">
                 Keep Visit
               </button>
               <button onClick={confirmCancel} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors">
                 Confirm Cancel
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Rating Modal */}
       {visit && visit.status === 'completed' && visit.rating === null && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-2">Rate Your Visit</h2>
              <p className="text-slate-400 text-sm mb-6">How was {visit.companionName}'s visit with {visit.seniorName} today?</p>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} onClick={() => submitRating(r)} disabled={rating !== null} className={`p-2 rounded-full ${rating === r ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'} transition-colors`}>
                    <Star className={`w-8 h-8 ${rating && r <= rating ? 'fill-white text-white' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>
              {rating !== null && <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider">Rating submitted!</p>}
           </div>
         </div>
       )}

       <div className="flex items-end justify-between pb-2">
        <div>
          <h1 className="text-3xl font-light text-white">Family Dashboard</h1>
          <p className="text-slate-500 mt-1">Managing care for <span className="text-blue-400">{visit ? visit.seniorName : 'Eleanor'}</span>. Subscription: <span className="text-blue-400">Care+</span></p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="text-right">
             <p className="text-[10px] uppercase text-slate-500 tracking-wider mb-1">Safety Posture</p>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-sm font-bold text-emerald-500">SECURE & VERIFIED</span>
             </div>
          </div>
          <button onClick={() => setShowBookingModal(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow font-bold hover:bg-blue-700 transition-all text-xs ms-4 uppercase tracking-widest">
            Book New Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative flex flex-col overflow-hidden">
            <h4 className="text-sm font-bold text-white mb-6 flex justify-between items-center z-10 uppercase tracking-wider">
              {visit && ['en_route', 'arrived', 'in_progress'].includes(visit.status) ? 'Active Live Visit' : 'Upcoming Visit'}
              <span onClick={() => alert("Calendar view is coming soon!")} className="text-blue-500 text-[10px] uppercase cursor-pointer tracking-wider font-bold hover:text-blue-400">View Calendar</span>
            </h4>
            
            {visit ? (
              <div className="relative z-10">
                <div className="flex items-start gap-4 p-4 border border-white/5 bg-slate-950 rounded-2xl relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${visit.status === 'in_progress' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Companion`} alt="Companion" className="w-16 h-16 rounded-full bg-slate-800 border border-white/10" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-white text-lg">Companionship</h3>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-md tracking-wider border uppercase ${visit.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'bg-blue-600/20 text-blue-400 border-blue-500/20'}`}>
                        {visit.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-400 font-bold mt-1">{visit.companionName} <span className="text-slate-400 font-normal ml-1">(★ 4.9)</span></p>
                    <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-2 font-mono">
                      <Clock className="w-3 h-3" /> Scheduled for {new Date(visit.scheduledFor).toLocaleDateString()}
                    </p>
                    
                    {visit.status === 'pending' && (
                      <button onClick={handleCancelClick} className="mt-4 px-4 py-2 bg-red-600/10 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-red-500/20 hover:bg-red-600/20 transition-colors">
                        Cancel Visit
                      </button>
                    )}
                  </div>
                </div>
                {/* Live Tracking map mock if active */}
                {['en_route', 'arrived', 'in_progress'].includes(visit.status) && (
                  <div className="mt-4 h-32 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    <div className="z-10 flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 backdrop-blur-sm">
                       <MapPin className="text-blue-400 animate-bounce" />
                       <span className="text-xs font-mono text-slate-300">Live GPS Active: Companion is {visit.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
               <p className="text-slate-500 text-sm">No upcoming visits found.</p>
            )}
          </section>

          <section className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 overflow-hidden">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Recent Visit AI Summary
            </h4>
            {visit && visit.status === 'completed' && visit.summary ? (
              <div>
                <div className="space-y-4 text-slate-400">
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{visit.summary}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Summary will appear here after the visit is completed.</p>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col text-center items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4">7-Day Wellness Score</p>
             {subscriptionTier === 'basic' ? (
                <div className="flex flex-col items-center justify-center py-6">
                   <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 opacity-50">
                     <Heart className="w-8 h-8 text-slate-500" />
                   </div>
                   <p className="text-xs text-slate-400">Available on Care+ and Pro plans.</p>
                   <button onClick={() => setSubscriptionTier('care-plus')} className="mt-3 text-[10px] uppercase font-bold tracking-wider text-blue-500 hover:text-blue-400">Mock Upgrade</button>
                </div>
             ) : (
                <>
                  <div className="relative flex items-center justify-center">
                     <svg className="w-32 h-32 transform -rotate-90">
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset="65.5" className="text-blue-500" />
                     </svg>
                     <span className="absolute text-4xl font-light text-white">82</span>
                  </div>
                  <p className="mt-4 text-xs font-medium text-white">OPTIMAL CONDITION</p>
                  <p className="text-[11px] text-green-500 mt-1">↑ 4 pts this week</p>
                </>
             )}
           </section>

           <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                 <AlertCircle className="w-4 h-4" />
               </div>
               <h4 className="text-sm font-bold text-white uppercase tracking-wider">Emergency</h4>
             </div>
             <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">Trigger an immediate welfare check or contact emergency services directly through the platform.</p>
             <button onClick={() => alert("Welfare check triggered. We have dispatched local emergency services or care managers to the senior's location.")} className="w-full mt-auto py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-xs font-bold rounded-xl border border-red-500/30 transition-all uppercase tracking-widest">
               Trigger Welfare Check
             </button>
           </section>

           <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                 <CreditCard className="w-4 h-4" />
               </div>
               <h4 className="text-sm font-bold text-white uppercase tracking-wider">Subscription & Billing</h4>
             </div>
             <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
               You are currently on the <strong className="text-white">Basic</strong> tier. Upgrade for lower fees and premium priority support.
             </p>
             <div className="flex items-center justify-center mb-4 gap-2">
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${!isYearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                 <button 
                  onClick={() => setIsYearly(!isYearly)} 
                  className={`w-10 h-5 rounded-full p-1 transition-colors relative ${isYearly ? 'bg-blue-600' : 'bg-slate-700'}`}
                 >
                   <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isYearly ? 'translate-x-5' : 'translate-x-0'}`} />
                 </button>
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${isYearly ? 'text-white' : 'text-slate-500'}`}>Yearly (-20%)</span>
              </div>
             <div className="space-y-2 mt-auto">
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => handleSubscribe('care-plus', isYearly)} className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg border border-blue-500/30 transition-all uppercase tracking-widest">
                   Care+ ({isYearly ? '$96/yr' : '$10/mo'})
                 </button>
                 <button onClick={() => handleSubscribe('family-pro', isYearly)} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest">
                   Pro ({isYearly ? '$288/yr' : '$30/mo'})
                 </button>
               </div>
               <button onClick={handleManageBilling} className="w-full mt-2 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all uppercase tracking-widest">
                 Manage Billing Portal
               </button>
             </div>
           </section>
        </div>
      </div>
    </div>
  );
}
