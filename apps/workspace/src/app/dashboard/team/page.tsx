'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  cases: number;
  status: 'active' | 'invited';
}

const SAMPLE_STAFF: StaffMember[] = [
  { id: 'STF-1', name: 'Bikram Thapa', email: 'bikram@agency.com', role: 'Head Counselor & Admin', cases: 18, status: 'active' },
  { id: 'STF-2', name: 'Suman Gurung', email: 'suman@agency.com', role: 'Visa & Documentation Officer', cases: 14, status: 'active' },
  { id: 'STF-3', name: 'Anjali Rayamajhi', email: 'anjali@agency.com', role: 'Counseling Assistant', cases: 10, status: 'active' },
];

export default function WorkspaceTeamPage() {
  const [team] = useState<StaffMember[]>(SAMPLE_STAFF);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
            Team & Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Invite counselors and admission officers to manage student cases in this organization.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Invite new staff member dialog')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {team.map((member) => (
            <div key={member.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{member.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">
                  <strong>{member.cases}</strong> active cases assigned
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
