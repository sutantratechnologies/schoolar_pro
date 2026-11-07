'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: string;
  programsOffered: number;
  partnershipType: 'DIRECT_PARTNER' | 'LISTED_GLOBAL' | 'SCHOLARSHIP_HOST';
  verified: boolean;
}

const SAMPLE_INSTITUTIONS: University[] = [
  {
    id: 'UNI-TODAI',
    name: 'The University of Tokyo (UTokyo)',
    country: 'Japan',
    city: 'Tokyo',
    ranking: '#28 Global (QS)',
    programsOffered: 140,
    partnershipType: 'SCHOLARSHIP_HOST',
    verified: true,
  },
  {
    id: 'UNI-KYODAI',
    name: 'Kyoto University',
    country: 'Japan',
    city: 'Kyoto',
    ranking: '#46 Global (QS)',
    programsOffered: 95,
    partnershipType: 'SCHOLARSHIP_HOST',
    verified: true,
  },
  {
    id: 'UNI-UNIMELB',
    name: 'The University of Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    ranking: '#13 Global (QS)',
    programsOffered: 210,
    partnershipType: 'DIRECT_PARTNER',
    verified: true,
  },
  {
    id: 'UNI-SNU',
    name: 'Seoul National University',
    country: 'South Korea',
    city: 'Seoul',
    ranking: '#41 Global (QS)',
    programsOffered: 88,
    partnershipType: 'SCHOLARSHIP_HOST',
    verified: true,
  },
  {
    id: 'UNI-OXFORD',
    name: 'University of Oxford',
    country: 'United Kingdom',
    city: 'Oxford',
    ranking: '#3 Global (QS)',
    programsOffered: 350,
    partnershipType: 'LISTED_GLOBAL',
    verified: true,
  },
];

export default function InstitutionsPage() {
  const [institutions] = useState<University[]>(SAMPLE_INSTITUTIONS);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              06
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Institutions & Universities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official database of partner universities, global scholarship host institutes, and academic faculties.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Institution</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities by name, country, or ranking..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3">Institution Name & ID</th>
                <th className="pb-3">Country & City</th>
                <th className="pb-3">Global Ranking</th>
                <th className="pb-3">Academic Programs</th>
                <th className="pb-3">Partnership Model</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutions.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{u.name}</span>
                      {u.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">{u.id}</div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{u.city}, {u.country}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 font-medium text-slate-800">{u.ranking}</td>
                  <td className="py-3.5 pr-3 font-mono font-semibold text-purple-700">{u.programsOffered}</td>
                  <td className="py-3.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                      {u.partnershipType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Manage
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
