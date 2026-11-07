'use client';

import React, { useState } from 'react';
import { FileText } from 'lucide-react';

interface OrgApplication {
  id: string;
  organizationName: string;
  type: 'CONSULTANCY' | 'UNIVERSITY' | 'COLLEGE';
  registrationNumber: string;
  country: string;
  applicantName: string;
  applicantEmail: string;
  documentsCount: number;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';
}

const SAMPLE_APPLICATIONS: OrgApplication[] = [
  {
    id: 'APP-2081-01',
    organizationName: 'Global Bridge Educational Consultancy',
    type: 'CONSULTANCY',
    registrationNumber: 'VAT-601928371',
    country: 'Nepal',
    applicantName: 'Ramesh Pokharel',
    applicantEmail: 'ramesh@globalbridge.edu.np',
    documentsCount: 4,
    submittedAt: 'Today at 10:15 AM',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'APP-2081-02',
    organizationName: 'Tokyo International Language Academy',
    type: 'COLLEGE',
    registrationNumber: 'JPN-EDU-9921',
    country: 'Japan',
    applicantName: 'Kenji Sato',
    applicantEmail: 'admissions@tokyo-ila.jp',
    documentsCount: 5,
    submittedAt: 'Yesterday at 3:45 PM',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'APP-2081-03',
    organizationName: 'Himalayan Career & Visa Solutions',
    type: 'CONSULTANCY',
    registrationNumber: 'PAN-30291829',
    country: 'Nepal',
    applicantName: 'Sunita Shakya',
    applicantEmail: 'sunita@himalayancareer.com',
    documentsCount: 3,
    submittedAt: 'Nov 04, 2026',
    status: 'CHANGES_REQUESTED',
  },
  {
    id: 'APP-2081-04',
    organizationName: 'Melbourne Global Pathway Institute',
    type: 'COLLEGE',
    registrationNumber: 'ABN-847291039',
    country: 'Australia',
    applicantName: 'Marcus Brown',
    applicantEmail: 'compliance@mgpathway.edu.au',
    documentsCount: 6,
    submittedAt: 'Oct 30, 2026',
    status: 'APPROVED',
  },
];

export default function OrganizationApplicationsPage() {
  const [applications] = useState<OrgApplication[]>(SAMPLE_APPLICATIONS);
  const [filter, setFilter] = useState('ALL');

  const filtered = applications.filter(
    (app) => filter === 'ALL' || app.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              09
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Organization Applications
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional accreditation queue: review company registration, licenses, and approve workspace access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            6 Pending Verifications
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'PENDING_REVIEW', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'APPROVED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                filter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3">Organization & ID</th>
                <th className="pb-3">Type & Country</th>
                <th className="pb-3">Registration Number</th>
                <th className="pb-3">Applicant Contact</th>
                <th className="pb-3">Documents</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-slate-900">{app.organizationName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{app.id}</div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-700">
                    <span className="font-medium">{app.type}</span> • {app.country}
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-slate-600">
                    {app.registrationNumber}
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="text-slate-800 font-medium">{app.applicantName}</div>
                    <div className="text-[10px] text-slate-400">{app.applicantEmail}</div>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="inline-flex items-center gap-1 font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 font-medium">
                      <FileText className="w-3 h-3" />
                      {app.documentsCount} files
                    </span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.status === 'UNDER_REVIEW'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : app.status === 'CHANGES_REQUESTED'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Review & Verify
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
