'use client';

import React, { useState } from 'react';
import {
  CalendarRange,
  Plus,
} from 'lucide-react';

interface IntakeCycle {
  id: string;
  name: string;
  intakeTerm: string;
  year: number;
  openDate: string;
  deadlineDate: string;
  scholarshipsCount: number;
  applicationsCount: number;
  status: 'OPEN' | 'UPCOMING' | 'REVIEWING' | 'CLOSED';
}

const SAMPLE_CYCLES: IntakeCycle[] = [
  {
    id: 'CYCLE-2027-F',
    name: 'Fall 2027 International Intake',
    intakeTerm: 'Fall',
    year: 2027,
    openDate: 'Jan 15, 2027',
    deadlineDate: 'Apr 30, 2027',
    scholarshipsCount: 520,
    applicationsCount: 4120,
    status: 'OPEN',
  },
  {
    id: 'CYCLE-2027-S',
    name: 'Spring 2027 Global Cycle',
    intakeTerm: 'Spring',
    year: 2027,
    openDate: 'Aug 01, 2026',
    deadlineDate: 'Nov 15, 2026',
    scholarshipsCount: 380,
    applicationsCount: 2890,
    status: 'REVIEWING',
  },
  {
    id: 'CYCLE-2028-F',
    name: 'MEXT & Japanese Government 2028',
    intakeTerm: 'Fall',
    year: 2028,
    openDate: 'May 01, 2027',
    deadlineDate: 'Jul 31, 2027',
    scholarshipsCount: 95,
    applicationsCount: 0,
    status: 'UPCOMING',
  },
  {
    id: 'CYCLE-2026-F',
    name: 'Fall 2026 Academic Grants',
    intakeTerm: 'Fall',
    year: 2026,
    openDate: 'Jan 10, 2026',
    deadlineDate: 'May 31, 2026',
    scholarshipsCount: 425,
    applicationsCount: 3780,
    status: 'CLOSED',
  },
];

export default function ScholarshipCyclesPage() {
  const [cycles] = useState<IntakeCycle[]>(SAMPLE_CYCLES);
  const [filterTerm, setFilterTerm] = useState('ALL');

  const filteredCycles = cycles.filter(
    (c) => filterTerm === 'ALL' || c.status === filterTerm
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              03
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Scholarship Cycles
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure application windows, intake deadlines, and cycle-wide submission caps.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Cycle</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Active Open Cycles</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">2</div>
          <div className="text-[11px] text-emerald-600 mt-1">Receiving applications</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Live Grants</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">995</div>
          <div className="text-[11px] text-slate-400 mt-1">Across open intake terms</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Applications in Cycle</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">7,010</div>
          <div className="text-[11px] text-slate-400 mt-1">Pending review & verified</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Upcoming Cycles</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">1</div>
          <div className="text-[11px] text-slate-400 mt-1">MEXT 2028 (Scheduled)</div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Application Intake Windows</h2>
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'OPEN', 'REVIEWING', 'UPCOMING', 'CLOSED'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterTerm(status)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                  filterTerm === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3 font-semibold">Cycle Name & ID</th>
                <th className="pb-3 font-semibold">Intake Term</th>
                <th className="pb-3 font-semibold">Application Window</th>
                <th className="pb-3 font-semibold">Scholarships</th>
                <th className="pb-3 font-semibold">Submissions</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCycles.map((cycle) => (
                <tr key={cycle.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="font-semibold text-slate-900">{cycle.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{cycle.id}</div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-700">
                    {cycle.intakeTerm} {cycle.year}
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="text-slate-800">{cycle.openDate} → {cycle.deadlineDate}</div>
                  </td>
                  <td className="py-3.5 pr-3 font-semibold text-slate-900">
                    {cycle.scholarshipsCount}
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-purple-700 font-semibold">
                    {cycle.applicationsCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        cycle.status === 'OPEN'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : cycle.status === 'REVIEWING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : cycle.status === 'UPCOMING'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {cycle.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      className="px-3 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Configure
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
