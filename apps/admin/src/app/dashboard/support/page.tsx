'use client';

import React, { useState } from 'react';

interface SupportTicket {
  id: string;
  subject: string;
  userEmail: string;
  userType: 'STUDENT' | 'ORGANIZATION' | 'VISITOR';
  category: 'SCHOLARSHIP_QUERY' | 'VERIFICATION_DISPUTE' | 'FRAUD_REPORT' | 'TECHNICAL_BUG';
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}

const SAMPLE_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-4401',
    subject: 'Discrepancy in GKS 2027 application deadline date on portal',
    userEmail: 'aarav.shrestha@gmail.com',
    userType: 'STUDENT',
    category: 'SCHOLARSHIP_QUERY',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '15 mins ago',
  },
  {
    id: 'TICK-4402',
    subject: 'Report unaccredited consultancy claiming false university quotas in Butwal',
    userEmail: 'anonymous-student@bidyago.com',
    userType: 'STUDENT',
    category: 'FRAUD_REPORT',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    createdAt: '2 hours ago',
  },
  {
    id: 'TICK-4403',
    subject: 'Request for business PAN certificate document re-upload after rejection',
    userEmail: 'contact@zenithedunepal.com',
    userType: 'ORGANIZATION',
    category: 'VERIFICATION_DISPUTE',
    priority: 'NORMAL',
    status: 'RESOLVED',
    createdAt: 'Yesterday',
  },
];

export default function SupportReportsPage() {
  const [tickets] = useState<SupportTicket[]>(SAMPLE_TICKETS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              12
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Support & Incident Reports
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Resolve student inquiry tickets, integrity disputes, fraudulent consultancy flags, and platform bug reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            1 Critical Fraud Report
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Live Incident & Support Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3">Subject & Ticket ID</th>
                <th className="pb-3">Sender Contact</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Logged</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 max-w-sm">
                    <div className="font-semibold text-slate-900">{t.subject}</div>
                    <div className="font-mono text-[10px] text-slate-400">{t.id}</div>
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="text-slate-800 font-medium">{t.userEmail}</div>
                    <div className="text-[10px] text-slate-400">{t.userType}</div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-700 font-medium">
                    {t.category.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        t.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-900 border border-rose-200'
                          : t.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        t.status === 'OPEN'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : t.status === 'IN_PROGRESS'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400">{t.createdAt}</td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      className="px-3 py-1 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Investigate
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
