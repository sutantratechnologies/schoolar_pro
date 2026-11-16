'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

interface ComparisonItem {
  id: string;
  name: string;
  country: string;
  flag: string;
  degree: string;
  funding: string;
  tuitionCoverage: string;
  livingStipend: string;
  airfare: boolean;
  healthInsurance: boolean;
  workPermit: string;
  applicationFee: string;
  minIelts: string;
  acceptanceRate: string;
  officialUrl: string;
}

const COMPARISON_DATA: ComparisonItem[] = [
  {
    id: 'mext',
    name: 'MEXT Research & Graduate',
    country: 'Japan',
    flag: '🇯🇵',
    degree: 'Master’s & PhD',
    funding: '100% Fully Funded',
    tuitionCoverage: '100% (National Universities)',
    livingStipend: '¥144,000 / month (~$960)',
    airfare: true,
    healthInsurance: true,
    workPermit: 'Up to 28 hrs/week permitted',
    applicationFee: 'None ($0)',
    minIelts: '6.5 (or Japanese B2)',
    acceptanceRate: '~4% (Selective)',
    officialUrl: 'https://www.np.emb-japan.go.jp',
  },
  {
    id: 'australia',
    name: 'Australia Awards (DFAT)',
    country: 'Australia',
    flag: '🇦🇺',
    degree: 'Master’s by Coursework/Research',
    funding: '100% Fully Funded',
    tuitionCoverage: '100% Full Tuition',
    livingStipend: 'AUD $30,000 / year (~$2,500/mo)',
    airfare: true,
    healthInsurance: true,
    workPermit: 'Limited during academic terms',
    applicationFee: 'None ($0)',
    minIelts: '6.5 (no band < 6.0)',
    acceptanceRate: '~6% (National Priority)',
    officialUrl: 'https://www.dfat.gov.au',
  },
  {
    id: 'chevening',
    name: 'Chevening UK Scholarship',
    country: 'United Kingdom',
    flag: '🇬🇧',
    degree: '1-Year Master’s',
    funding: '100% Fully Funded',
    tuitionCoverage: '100% (Subject to £22k MBA cap)',
    livingStipend: '£1,350 / month (~$1,720)',
    airfare: true,
    healthInsurance: true,
    workPermit: 'Up to 20 hrs/week during term',
    applicationFee: 'None ($0)',
    minIelts: 'Met via university offer',
    acceptanceRate: '~3% (Global Leader Track)',
    officialUrl: 'https://www.chevening.org',
  },
  {
    id: 'gks',
    name: 'Global Korea Scholarship (GKS)',
    country: 'South Korea',
    flag: '🇰🇷',
    degree: 'Master’s & PhD (+1 yr Korean)',
    funding: '100% Fully Funded',
    tuitionCoverage: '100% + Korean Training Fee',
    livingStipend: '1,000,000 KRW / month (~$750)',
    airfare: true,
    healthInsurance: true,
    workPermit: 'Permitted with university approval',
    applicationFee: 'None ($0)',
    minIelts: 'TOPIK or IELTS 6.0+',
    acceptanceRate: '~5%',
    officialUrl: 'https://www.studyinkorea.go.kr',
  },
];

export default function CompareScholarshipsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['mext', 'australia', 'chevening']);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const activeItems = COMPARISON_DATA.filter((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider block">
            Decision Matrix
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Compare Scholarships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Side-by-side evaluation of funding packages, allowances, work rights, and academic requirements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {COMPARISON_DATA.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleSelect(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#4b37df] text-white border-[#4b37df]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{item.flag} {item.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 sm:p-5 font-semibold text-slate-500 uppercase tracking-wider w-44">
                  Criterion
                </th>
                {activeItems.map((item) => (
                  <th key={item.id} className="p-4 sm:p-5 font-semibold text-slate-900 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.flag}</span>
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{item.name}</span>
                        <span className="text-[11px] text-slate-500 font-normal">{item.country}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">Degree Level</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 font-semibold text-slate-800">{item.degree}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">Tuition Coverage</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 text-emerald-700 font-medium">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {item.tuitionCoverage}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">Monthly Living Allowance</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 font-semibold text-slate-900">{item.livingStipend}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">Round-trip Flights</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 text-slate-700">
                    {item.airfare ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Covered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-500">
                        <XCircle className="w-4 h-4" /> Not Included
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">Health Insurance</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 text-slate-700">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Covered
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">Student Work Rights</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 text-slate-600">{item.workPermit}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">English Requirement</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 font-medium text-slate-800">{item.minIelts}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">Application Fee</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 text-emerald-700 font-semibold">{item.applicationFee}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-medium text-slate-500 bg-slate-50/30">Selection Competitiveness</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5 text-slate-600">{item.acceptanceRate}</td>
                ))}
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-4 sm:p-5 font-medium text-slate-500">Application Action</td>
                {activeItems.map((item) => (
                  <td key={item.id} className="p-4 sm:p-5">
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-medium transition-colors shadow-2xs"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
