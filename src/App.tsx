/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import AdminDashboard from './pages/AdminDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import CompanionDashboard from './pages/CompanionDashboard';
import EmergencyReport from './pages/EmergencyReport';
import CompanionCertification from './pages/CompanionCertification';
import AuthPortal from './pages/AuthPortal';

export default function App() {
  return (
    <div className="flex bg-[#0C0C0D] min-h-screen text-slate-200 font-sans p-6 gap-6">
      <Sidebar />
      <main className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/auth" element={<AuthPortal />} />
          <Route path="/family" element={<FamilyDashboard />} />
          <Route path="/companion" element={<CompanionDashboard />} />
          <Route path="/companion/emergency-report" element={<EmergencyReport />} />
          <Route path="/companion/certify" element={<CompanionCertification />} />
        </Routes>
        </div>
      </main>
    </div>
  );
}
