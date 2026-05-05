/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import CompanionDashboard from './pages/CompanionDashboard';
import EmergencyReport from './pages/EmergencyReport';
import CompanionCertification from './pages/CompanionCertification';
import AuthPortal from './pages/AuthPortal';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from './lib/store';

export default function App() {
  const location = useLocation();
  const { currentUser } = useStore();

  const isPortal = ['/admin', '/family', '/companion', '/companion/emergency-report', '/companion/certify'].some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  if (!isPortal && location.pathname !== '/auth') {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPortal />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Global Action Bar */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">System Live Presence</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-bold text-white">{currentUser?.name || 'Alexander Obinna'}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{currentUser?.role || 'Super Admin'}</p>
             </div>
             <button title="Terminal Log Off" className="group">
               <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} className="w-10 h-10 rounded-xl border border-slate-800 group-hover:border-primary transition-colors" alt="Avatar" />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto p-8 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-7xl mx-auto h-full"
            >
              <Routes location={location}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/family" element={<FamilyDashboard />} />
                <Route path="/companion" element={<CompanionDashboard />} />
                <Route path="/companion/emergency-report" element={<EmergencyReport />} />
                <Route path="/companion/certify" element={<CompanionCertification />} />
                <Route path="*" element={<AdminDashboard />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
