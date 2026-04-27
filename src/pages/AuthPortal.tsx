import React, { useState } from 'react';
import { ArrowLeft, User, Users, HeartPulse, ShieldCheck, Mail, Lock, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPortal() {
  const navigate = useNavigate();
  const [view, setView] = useState<'selection' | 'login' | 'register'>('selection');
  const [role, setRole] = useState<'family' | 'companion' | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create an account in a database/Firebase
    if (role === 'companion') navigate('/companion');
    else if (role === 'family') navigate('/family');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'companion') navigate('/companion');
    else if (role === 'family') navigate('/family');
  };

  if (view === 'selection') {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          <div className="w-8 h-8 border-4 border-white rounded-full"></div>
        </div>
        <h1 className="text-4xl font-light text-white mb-2">Welcome to CareCompana</h1>
        <p className="text-slate-400 mb-12">Select your portal to continue</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <button onClick={() => { setRole('family'); setView('login'); }} className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-slate-600 transition-colors text-left flex flex-col gap-4">
             <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Family Portal</h3>
               <p className="text-sm text-slate-400 leading-relaxed">Book visits, review updates, and monitor your loved one's wellness.</p>
             </div>
          </button>
          
          <button onClick={() => { setRole('companion'); setView('login'); }} className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-slate-600 transition-colors text-left flex flex-col gap-4">
             <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Companion Portal</h3>
               <p className="text-sm text-slate-400 leading-relaxed">View your schedule, submit visit notes, and complete certifications.</p>
             </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <button onClick={() => setView('selection')} className="self-start mb-8 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
        <ArrowLeft className="w-4 h-4" /> Change Portal
      </button>

      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className={`absolute top-0 left-0 w-full h-1 ${role === 'companion' ? 'bg-orange-500' : 'bg-purple-500'}`}></div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{view === 'login' ? 'Sign In' : 'Create Account'}</h2>
          <p className="text-sm text-slate-400">
            {role === 'companion' ? 'CareCompana Companion Services' : 'CareCompana Family Access'}
          </p>
        </div>

        {view === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input required type="email" placeholder="name@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input required type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <button type="submit" className={`w-full py-4 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors mt-2 ${role === 'companion' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
              Sign In
            </button>
            <p className="text-center text-sm text-slate-400 mt-6">
              Don't have an account? <span onClick={() => setView('register')} className="text-white hover:underline cursor-pointer font-bold">Register</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">First Name</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Last Name</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input required type="email" placeholder="name@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input required type="tel" placeholder="(555) 555-5555" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input required type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            {role === 'companion' && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex gap-3 text-sm text-orange-200 mt-2">
                <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
                <p>Registering as a companion requires completing an onboarding quiz, a safety certification, and a background check.</p>
              </div>
            )}

            <button type="submit" className={`w-full py-4 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-colors mt-2 ${role === 'companion' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
              Complete Registration
            </button>
            <p className="text-center text-sm text-slate-400 mt-6">
              Already have an account? <span onClick={() => setView('login')} className="text-white hover:underline cursor-pointer font-bold">Sign In</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
