'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Globe2,
  DollarSign,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface ScholarshipItem {
  id: string;
  name: string;
  country: string;
  level: string;
  funding: string;
  deadline: string;
  status: 'published' | 'draft' | 'archived';
}

const INITIAL_SCHOLARSHIPS: ScholarshipItem[] = [
  { id: 'SCH-01', name: 'MEXT Japanese Government (Monbukagakusho)', country: 'Japan 🇯🇵', level: 'Bachelor & Masters', funding: 'Fully Funded (100% Tuition + ¥144,000/mo)', deadline: 'May 2027', status: 'published' },
  { id: 'SCH-02', name: 'Chevening UK Government Scholarship', country: 'United Kingdom 🇬🇧', level: 'One-Year Masters', funding: 'Fully Funded (Flights + Stipend + Fees)', deadline: 'Nov 2026', status: 'published' },
  { id: 'SCH-03', name: 'Australia Awards Scholarship', country: 'Australia 🇦🇺', level: 'Masters & PhD', funding: 'Fully Funded (Full Tuition + Fortnightly CLE)', deadline: 'Apr 2027', status: 'published' },
  { id: 'SCH-04', name: 'Global Korea Scholarship (GKS/KGSP)', country: 'South Korea 🇰🇷', level: 'Undergraduate & Graduate', funding: 'Fully Funded (Roundtrip + Settlement + Tuition)', deadline: 'Sep 2027', status: 'published' },
  { id: 'SCH-05', name: 'DAAD EPOS Development Scholarships', country: 'Germany 🇩🇪', level: 'Postgraduate', funding: 'Tuition Waiver + €934/mo Stipend', deadline: 'Dec 2026', status: 'published' },
];

export default function AdminScholarshipsPage() {
  const [scholarships] = useState<ScholarshipItem[]>(INITIAL_SCHOLARSHIPS);
  const [search, setSearch] = useState('');

  const filtered = scholarships.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
            Global Scholarship Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage verified scholarship programs, eligibility criteria, and deadlines shown on the Student Portal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('New scholarship creation dialog')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by scholarship title, country..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Program Name</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Academic Level</th>
                <th className="py-3 px-4">Funding Details</th>
                <th className="py-3 px-4">Application Deadline</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#4b37df] shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                      {item.country}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{item.level}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {item.funding}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.deadline}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Live</span>
                    </span>
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

