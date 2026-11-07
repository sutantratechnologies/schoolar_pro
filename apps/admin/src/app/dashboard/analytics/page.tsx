'use client';

import React from 'react';
import {
  TrendingUp,
  Download,
} from 'lucide-react';

export default function AnalyticsReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              13
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Analytics & Executive Reports
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Platform performance metrics, conversion funnels, destination trends, and scholarship engagement telemetry.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Platform Report (PDF)</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Monthly Active Students</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">12,480</div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +24.8% vs last month
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Program Inquiries</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">38,910</div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +18.2% vs last month
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Profile Match Accuracy</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">94.6%</div>
          <div className="text-[11px] text-slate-400 mt-1">Based on 7-step criteria</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Verified Value</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">$142.5M</div>
          <div className="text-[11px] text-slate-400 mt-1">Worldwide grants catalog</div>
        </div>
      </div>

      {/* Destination Volume Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Most Demanded Destinations (Student Intent)</h2>
          <div className="space-y-3">
            {[
              { country: 'Japan 🇯🇵', percent: 38, count: '4,740 applicants', color: 'bg-rose-500' },
              { country: 'Australia 🇦🇺', percent: 26, count: '3,240 applicants', color: 'bg-blue-500' },
              { country: 'South Korea 🇰🇷', percent: 18, count: '2,240 applicants', color: 'bg-purple-500' },
              { country: 'United Kingdom 🇬🇧', percent: 12, count: '1,500 applicants', color: 'bg-emerald-500' },
              { country: 'Erasmus Mundus 🇪🇺', percent: 6, count: '760 applicants', color: 'bg-amber-500' },
            ].map((d) => (
              <div key={d.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{d.country}</span>
                  <span className="text-slate-500 font-mono">{d.count} ({d.percent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${d.color} rounded-full transition-all duration-500`}
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Scholarship Funding Type Preferences</h2>
          <div className="space-y-3">
            {[
              { type: 'Fully Funded (Tuition + Living + Airfare)', percent: 64, color: 'bg-purple-600' },
              { type: 'Tuition Fee Waiver (100% Free Tuition)', percent: 22, color: 'bg-indigo-500' },
              { type: 'Partial Scholarship ($5k - $20k)', percent: 10, color: 'bg-blue-400' },
              { type: 'Research Fellowships & Stipends', percent: 4, color: 'bg-slate-400' },
            ].map((f) => (
              <div key={f.type} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{f.type}</span>
                  <span className="text-slate-500 font-mono">{f.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${f.color} rounded-full transition-all duration-500`}
                    style={{ width: `${f.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
