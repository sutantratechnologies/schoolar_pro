'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
} from 'lucide-react';

interface Destination {
  id: string;
  country: string;
  flag: string;
  region: string;
  scholarshipsCount: number;
  avgFundingUSD: string;
  popularTests: string[];
  status: 'active' | 'draft';
}

const SAMPLE_DESTINATIONS: Destination[] = [
  {
    id: 'DEST-JP',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'East Asia',
    scholarshipsCount: 148,
    avgFundingUSD: '$38,000 / yr',
    popularTests: ['JLPT N2', 'IELTS 6.5', 'EJU'],
    status: 'active',
  },
  {
    id: 'DEST-AU',
    country: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    scholarshipsCount: 310,
    avgFundingUSD: '$42,000 / yr',
    popularTests: ['IELTS 6.5', 'PTE 58', 'TOEFL 85'],
    status: 'active',
  },
  {
    id: 'DEST-KR',
    country: 'South Korea',
    flag: '🇰🇷',
    region: 'East Asia',
    scholarshipsCount: 112,
    avgFundingUSD: '$32,000 / yr',
    popularTests: ['TOPIK 3+', 'IELTS 6.0'],
    status: 'active',
  },
  {
    id: 'DEST-UK',
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    scholarshipsCount: 295,
    avgFundingUSD: '£28,000 / yr',
    popularTests: ['IELTS 7.0', 'PTE 65'],
    status: 'active',
  },
  {
    id: 'DEST-EU',
    country: 'Erasmus Mundus (EU)',
    flag: '🇪🇺',
    region: 'European Union',
    scholarshipsCount: 140,
    avgFundingUSD: '€35,000 / yr',
    popularTests: ['IELTS 6.5', 'GRE'],
    status: 'active',
  },
  {
    id: 'DEST-CA',
    country: 'Canada',
    flag: '🇨🇦',
    region: 'North America',
    scholarshipsCount: 220,
    avgFundingUSD: 'CAD 36,000 / yr',
    popularTests: ['IELTS 6.5', 'PTE 60'],
    status: 'active',
  },
];

export default function DestinationsPage() {
  const [destinations] = useState<Destination[]>(SAMPLE_DESTINATIONS);
  const [search, setSearch] = useState('');

  const filtered = destinations.filter((d) =>
    d.country.toLowerCase().includes(search.toLowerCase()) ||
    d.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              04
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Countries & Destinations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global destination catalog, visa guidelines, test criteria, and country coverage.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination Country</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by country, region, or requirements..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-300 transition-all shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{d.flag}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{d.country}</h3>
                    <p className="text-xs text-slate-400">{d.region}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {d.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Live Grants</span>
                  <span className="font-semibold text-slate-800">{d.scholarshipsCount}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Avg. Coverage</span>
                  <span className="font-semibold text-purple-700">{d.avgFundingUSD}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1.5">Common Language Criteria</span>
                <div className="flex flex-wrap gap-1.5">
                  {d.popularTests.map((test) => (
                    <span
                      key={test}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {test}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
