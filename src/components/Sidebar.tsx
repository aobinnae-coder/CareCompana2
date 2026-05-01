import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, HeartPulse, UserCircle2, KeyRound } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const routes = [
    { name: 'Admin (Trust & Safety)', path: '/', icon: ShieldAlert },
    { name: 'Family Dashboard', path: '/family', icon: HeartPulse },
    { name: 'Companion Portal', path: '/companion', icon: UserCircle2 },
    { name: 'Auth / Registration', path: '/auth', icon: KeyRound },
  ];

  return (
    <aside className="w-64 flex flex-col gap-8 shrink-0">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white rounded-full"></div>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">CompanaConnect</h1>
      </div>

      <nav className="flex flex-col gap-1">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              cn(
                "px-4 py-3 transition-colors flex items-center gap-3 text-sm",
                isActive ? "bg-slate-800/50 text-white rounded-lg font-medium" : "text-slate-500 hover:text-slate-300 font-medium"
              )
            }
          >
            <route.icon className="w-5 h-5" />
            {route.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
        <p className="text-[11px] uppercase tracking-widest text-blue-400 font-bold mb-2">System Demo</p>
        <p className="text-xs text-slate-400 mb-3">Multiview Navigation Enabled.</p>
        <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">Support Concierge</button>
      </div>
    </aside>
  );
}
