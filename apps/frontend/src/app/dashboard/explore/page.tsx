'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bookmark,
  ExternalLink,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  country: string;
  flag: string;
  degreeLevel: string[];
  fundingType: string;
  coverage: string[];
  deadline: string;
  matchScore: number;
  isOpen: boolean;
  officialUrl: string;
}

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'mext-japan-2026',
    title: 'MEXT Research & Graduate Scholarship',
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT)',
    country: 'Japan',
    flag: '🇯🇵',
    degreeLevel: ['masters', 'phd'],
    fundingType: 'Fully Funded',
    coverage: ['100% Tuition Waiver', 'Monthly Stipend: ¥144,000 (~$960/mo)', 'Round-trip Airfare'],
    deadline: 'May 15, 2026',
    matchScore: 98,
    isOpen: true,
    officialUrl: 'https://www.np.emb-japan.go.jp/itpr_en/mext_scholarship.html',
  },
  {
    id: 'australia-awards-2026',
    title: 'Australia Awards Scholarships 2026',
    provider: 'Department of Foreign Affairs and Trade (DFAT)',
    country: 'Australia',
    flag: '🇦🇺',
    degreeLevel: ['masters'],
    fundingType: 'Fully Funded',
    coverage: ['Full Tuition Fees', 'Return Air Travel', 'Contribution to Living Expenses (AUD $30,000/yr)'],
    deadline: 'April 30, 2026',
    matchScore: 95,
    isOpen: true,
    officialUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards',
  },
  {
    id: 'chevening-uk-2026',
    title: 'Chevening UK Master’s Scholarship',
    provider: 'Foreign, Commonwealth & Development Office (FCDO)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    degreeLevel: ['masters'],
    fundingType: 'Fully Funded',
    coverage: ['University Tuition Fees', 'Monthly Living Allowance: £1,350', 'Economy Travel to/from UK'],
    deadline: 'November 2026',
    matchScore: 92,
    isOpen: true,
    officialUrl: 'https://www.chevening.org/scholarship/nepal/',
  },
  {
    id: 'gks-korea-2026',
    title: 'Global Korea Scholarship (GKS) 2026',
    provider: 'National Institute for International Education (NIIED)',
    country: 'South Korea',
    flag: '🇰🇷',
    degreeLevel: ['bachelors', 'masters', 'phd'],
    fundingType: 'Fully Funded',
    coverage: ['Full Tuition Fee', 'Monthly Allowance: 1,000,000 KRW', 'Medical Insurance', 'Flight Tickets'],
    deadline: 'March 2027',
    matchScore: 88,
    isOpen: false,
    officialUrl: 'https://www.studyinkorea.go.kr',
  },
  {
    id: 'daad-germany-epos',
    title: 'DAAD EPOS Development-Related Postgraduate Courses',
    provider: 'German Academic Exchange Service (DAAD)',
    country: 'Germany',
    flag: '🇩🇪',
    degreeLevel: ['masters', 'phd'],
    fundingType: 'Fully Funded',
    coverage: ['€934 Monthly Payments', 'Health, Accident and Personal Liability Insurance', 'Travel Allowance'],
    deadline: 'October 2026',
    matchScore: 89,
    isOpen: true,
    officialUrl: 'https://www.daad.de',
  },
  {
    id: 'fulbright-nepal-2026',
    title: 'Fulbright Foreign Student Program (USEF Nepal)',
    provider: 'United States Department of State / USEF Nepal',
    country: 'United States',
    flag: '🇺🇸',
    degreeLevel: ['masters'],
    fundingType: 'Fully Funded',
    coverage: ['Tuition and Fees', 'Living Stipend', 'Airfare & Health Benefits (ASPE)'],
    deadline: 'April 2026',
    matchScore: 86,
    isOpen: false,
    officialUrl: 'https://usefnepal.org',
  },
];

export default function ExploreScholarshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [savedIds, setSavedIds] = useState<string[]>(['mext-japan-2026', 'australia-awards-2026', 'chevening-uk-2026', 'gks-korea-2026']);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filtered = SCHOLARSHIPS.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || s.country.toLowerCase() === selectedCountry.toLowerCase();
    const matchesDegree = selectedDegree === 'all' || s.degreeLevel.includes(selectedDegree);
    return matchesSearch && matchesCountry && matchesDegree;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider block">
            Discover Opportunities
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Explore Global Scholarships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified government and university grants directly without middlemen fees.
          </p>
        </div>

        <Link
          href="/dashboard/compare"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs shrink-0"
        >
          <span>Compare Shortlist</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#4b37df]" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by scholarship name, country, or provider..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-hidden focus:border-[#4b37df] cursor-pointer"
          >
            <option value="all">All Countries</option>
            <option value="japan">Japan 🇯🇵</option>
            <option value="australia">Australia 🇦🇺</option>
            <option value="united kingdom">UK 🇬🇧</option>
            <option value="south korea">South Korea 🇰🇷</option>
            <option value="germany">Germany 🇩🇪</option>
            <option value="united states">USA 🇺🇸</option>
          </select>

          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-hidden focus:border-[#4b37df] cursor-pointer"
          >
            <option value="all">All Degrees</option>
            <option value="masters">Master’s</option>
            <option value="phd">PhD</option>
            <option value="bachelors">Bachelor’s</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((scholarship) => {
          const isSaved = savedIds.includes(scholarship.id);
          return (
            <div
              key={scholarship.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4b37df]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{scholarship.flag}</span>
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      {scholarship.country}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {scholarship.matchScore}% Match
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSave(scholarship.id)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-purple-50 text-[#4b37df]'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save Scholarship'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900 hover:text-[#4b37df] transition-colors leading-snug">
                    {scholarship.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{scholarship.provider}</p>
                </div>

                <div className="space-y-1.5 pt-1 text-xs">
                  {scholarship.coverage.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-600 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>Deadline: {scholarship.deadline}</span>
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={scholarship.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Official Embassy/Government Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href={`/scholarships#${scholarship.id}`}
                    className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
