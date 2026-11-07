'use client';

import React, { useState } from 'react';
import {
  Bell,
  Globe2,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  const [preferredCurrency, setPreferredCurrency] = useState('USD');
  const [saveStatus, setSaveStatus] = useState('');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Preferences saved successfully.');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider block">
          Preferences & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your notification settings, matching criteria, and account security.
        </p>
      </div>

      {saveStatus && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Settings Forms */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Notification Settings */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Bell className="w-4 h-4 text-[#4b37df]" />
            <h3 className="text-sm font-semibold text-slate-900">Notification Preferences</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">Critical Deadline Alerts</span>
                <span className="text-slate-500 text-[11px]">Receive email notifications 14 days and 3 days before major embassy deadlines.</span>
              </div>
              <input
                type="checkbox"
                checked={deadlineReminders}
                onChange={(e) => setDeadlineReminders(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 text-[#4b37df] focus:ring-[#4b37df]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">Scholarship Match Alerts</span>
                <span className="text-slate-500 text-[11px]">Get notified when new fully funded scholarships match your degree and GPA.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 text-[#4b37df] focus:ring-[#4b37df]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 block">Platform Guides & Opportunities</span>
                <span className="text-slate-500 text-[11px]">Weekly educational guides and tips for embassy interview preparation.</span>
              </div>
              <input
                type="checkbox"
                checked={marketingUpdates}
                onChange={(e) => setMarketingUpdates(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 text-[#4b37df] focus:ring-[#4b37df]"
              />
            </label>
          </div>
        </div>

        {/* Regional & Currency Preferences */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">Regional & Display Options</h3>
          </div>

          <div className="space-y-3 text-xs max-w-sm">
            <label className="block text-slate-700 font-medium">
              Stipend Display Currency
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-hidden focus:border-[#4b37df]"
              >
                <option value="USD">USD ($) - Global Standard</option>
                <option value="NPR">NPR (रु) - Nepali Rupee</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="AUD">AUD ($) - Australian Dollar</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
