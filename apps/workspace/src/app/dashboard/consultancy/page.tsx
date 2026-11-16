'use client';

import React from 'react';
import {
  Users,
  FileCheck,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export default function ConsultancyPortalPage() {
  const cases = [
    { id: 'CS-801', student: 'Aarav Sharma', target: 'MEXT Japan 🇯🇵', counselor: 'Bikram T.', sopStatus: 'Completed', transcriptStatus: 'Verified', visaStage: 'Embassy Submission', progress: 85 },
    { id: 'CS-802', student: 'Pranisha Shrestha', target: 'Australia Awards 🇦🇺', counselor: 'Suman G.', sopStatus: 'Draft 2 in Review', transcriptStatus: 'Verified', visaStage: 'Application Lodged', progress: 65 },
    { id: 'CS-803', student: 'Sujata Adhikari', target: 'Chevening UK 🇬🇧', counselor: 'Bikram T.', sopStatus: 'Pending Reference', transcriptStatus: 'Pending Translation', visaStage: 'Pre-screening', progress: 30 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Consultancy Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 mt-2">
            Student Consulting Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize student document vaults, track scholarship application milestones, and assign dedicated counselors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Add student case dialog')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Student Case</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Student Cases</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-light text-slate-900">42 Students</span>
          <p className="text-[11px] text-slate-400">18 Japanese & 14 Australian tracks</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Documents in Vault</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-light text-slate-900">128 Files</span>
          <p className="text-[11px] text-slate-400">SOPs, IELTS scorecards & transcripts</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>MoEST License Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-light text-emerald-600">Active Verified</span>
          <p className="text-[11px] text-slate-400">Accreditation good through 2028</p>
        </div>
      </div>

      {/* Student Cases Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Current Scholarship Cases</h2>
          <span className="text-xs text-slate-400">Real-time pipeline tracker</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Target Scholarship</th>
                <th className="py-3 px-4">Counselor</th>
                <th className="py-3 px-4">SOP Status</th>
                <th className="py-3 px-4">Visa Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>
                      <span>{c.student}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{c.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{c.target}</td>
                  <td className="py-3.5 px-4 text-slate-600">{c.counselor}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
                      {c.sopStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{c.visaStage}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Opening vault for ${c.student}`)}
                      className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Open Vault
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
