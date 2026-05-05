import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, HeartPulse, UserCircle2, KeyRound, LayoutGrid, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const routes = [
    { name: 'Control Unit', path: '/admin', icon: LayoutGrid, sub: 'Admin' },
    { name: 'Family Hub', path: '/family', icon: HeartPulse, sub: 'Safety' },
    { name: 'Companion', path: '/companion', icon: UserCircle2, sub: 'Portal' },
    { name: 'Security', path: '/auth', icon: KeyRound, sub: 'Access' },
  ];

  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900/50 flex flex-col h-screen shrink-0">
      <div className="p-8">
        <NavLink to="/" className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight font-display uppercase tracking-widest">Compana</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Connect v2.0</p>
          </div>
        </NavLink>

        <nav className="space-y-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 px-4">Primary Interface</p>
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  "group relative px-4 py-3.5 transition-all flex items-center gap-4 rounded-2xl overflow-hidden",
                  isActive 
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                )
              }
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                "bg-slate-900 border border-slate-800 group-hover:border-slate-700"
              )}>
                <route.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-none mb-1">{route.name}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">{route.sub}</span>
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 pt-0">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12"></div>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Protocol Status</p>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
             <p className="text-[11px] text-slate-300 font-medium">Core Link Verified</p>
          </div>
          <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-xl uppercase tracking-widest border border-slate-700 transition-all">Support Console</button>
        </div>
      </div>
    </aside>
  );
}
