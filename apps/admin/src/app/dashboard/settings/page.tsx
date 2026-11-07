'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export default function PlatformSettingsPage() {
  const [platformName, setPlatformName] = useState('BidyaGo');
  const [supportEmail, setSupportEmail] = useState('support@bidyago.com');
  const [studentRegistrationOpen, setStudentRegistrationOpen] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              18
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Global Platform Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin system control for registration policies, maintenance switches, and branding configurations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
            General Branding & Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Support Dispatch Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
            Registration & System Availability
          </h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200/80 hover:bg-slate-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={studentRegistrationOpen}
                onChange={(e) => setStudentRegistrationOpen(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <div className="text-xs font-semibold text-slate-900">Public Student Registration Open</div>
                <div className="text-[11px] text-slate-500">
                  Allows prospective students in Nepal to create accounts and begin the 5-step onboarding flow.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200/80 hover:bg-slate-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <div className="text-xs font-semibold text-slate-900">Emergency Maintenance Mode</div>
                <div className="text-[11px] text-slate-500">
                  Displays a maintenance notice to public visitors while preserving Super Admin console access.
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {saved && (
            <span className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings updated successfully.
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-purple-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
