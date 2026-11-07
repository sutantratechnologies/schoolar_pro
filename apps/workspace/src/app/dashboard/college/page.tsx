'use client';

import React from 'react';
import {
  GraduationCap,
  Users,
  Award,
  Plus,
} from 'lucide-react';

export default function CollegePortalPage() {
  const quotas = [
    { program: 'Global IT & AI Specialization', level: "Master's Degree", seats: 12, tuitionWaiver: '50% - 100%', applicants: 28, deadline: 'May 2027', status: 'Published' },
    { program: 'Civil & Environmental Engineering', level: "Bachelor's", seats: 8, tuitionWaiver: '30% Merit-based', applicants: 19, deadline: 'Apr 2027', status: 'Published' },
    { program: 'International MBA (English Track)', level: 'Postgraduate', seats: 15, tuitionWaiver: 'Up to ¥800,000/yr', applicants: 41, deadline: 'Jun 2027', status: 'Published' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            University & College Liaison
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 mt-2">
            Admissions & Scholarship Quotas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish department tuition discounts, review pre-screened student scholars, and manage international quotas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Publish new scholarship quota dialog')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Quota</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Published Quotas</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-light text-slate-900">35 Seats</span>
          <p className="text-[11px] text-slate-400">Across 3 academic programs</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Student Candidates</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-light text-slate-900">88 Inquiries</span>
          <p className="text-[11px] text-slate-400">High fit academic match score (&gt;85%)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Institutional Status</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-light text-emerald-600">Verified</span>
          <p className="text-[11px] text-slate-400">Direct Embassy & MEXT recognized</p>
        </div>
      </div>

      {/* Program Quotas Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Active International Programs</h2>
          <span className="text-xs text-slate-400">Intake 2026 / 2027</span>
        </div>

        <div className="divide-y divide-slate-100">
          {quotas.map((q) => (
            <div key={q.program} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{q.program}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {q.level}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Scholarship: <strong className="text-emerald-700">{q.tuitionWaiver}</strong> • Available Seats: <strong>{q.seats}</strong> • Deadline: {q.deadline}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-500">
                  <strong>{q.applicants}</strong> candidates
                </span>
                <button
                  type="button"
                  onClick={() => alert(`Viewing applicants for ${q.program}`)}
                  className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Review Inquiries
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
