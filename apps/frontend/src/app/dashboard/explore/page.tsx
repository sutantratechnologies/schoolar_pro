'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Bookmark,
  ExternalLink,
  Clock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Globe2,
} from 'lucide-react';
import {
  PublicScholarship,
  getCountryFlag,
  formatDeadline,
  calculateDaysLeft,
} from '@/lib/scholarships';

export default function ExploreScholarshipsPage() {
  const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');

  useEffect(() => {
    // Load saved IDs from local storage
    try {
      const stored = localStorage.getItem('bidyago_saved_scholarships');
      if (stored) setSavedIds(JSON.parse(stored));
    } catch {
      // Ignore
    }

    // Fetch real scholarships from backend
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/scholarships');
        if (res.ok) {
          const json = await res.json();
          setScholarships(json.scholarships || []);
        }
      } catch (err) {
        console.error('Failed to load scholarships', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('bidyago_saved_scholarships', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesProvider = s.provider.toLowerCase().includes(q);
        const matchesCountry = s.destinationCountries?.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesProvider && !matchesCountry) return false;
      }

      if (selectedCountry !== 'all') {
        const matchesCountry = s.destinationCountries?.some(
          (c) => c.toLowerCase().includes(selectedCountry.toLowerCase())
        );
        if (!matchesCountry) return false;
      }

      if (selectedDegree !== 'all') {
        const matchesDegree = s.academicLevels?.some((lvl) =>
          lvl.toLowerCase().includes(selectedDegree.toLowerCase())
        );
        if (!matchesDegree) return false;
      }

      return true;
    });
  }, [scholarships, searchTerm, selectedCountry, selectedDegree]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Explore Verified Scholarships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified government and university grants directly without middlemen fees.
          </p>
        </div>

        <Link
          href="/scholarships"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs shrink-0"
        >
          <span>Public Directory</span>
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
          </select>

          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-hidden focus:border-[#4b37df] cursor-pointer"
          >
            <option value="all">All Degrees</option>
            <option value="bachelor">Bachelor’s</option>
            <option value="master">Master’s</option>
            <option value="phd">PhD</option>
            <option value="research">Research</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="min-h-[260px] flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-7 h-7 text-[#4b37df] animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Fetching active scholarships...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((scholarship) => {
            const isSaved = savedIds.includes(scholarship.id);
            const flag = getCountryFlag(scholarship.destinationCountries?.[0]);
            const deadlineStr = formatDeadline(scholarship.activeCycle?.applicationDeadline);
            const daysLeft = calculateDaysLeft(scholarship.activeCycle?.applicationDeadline);

            return (
              <div
                key={scholarship.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4b37df]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{flag}</span>
                      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        {scholarship.destinationCountries?.join(', ')}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {scholarship.fundingClassification}
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
                    <Link
                      href={`/scholarships/${scholarship.slug || scholarship.id}`}
                      className="text-base font-semibold text-slate-900 hover:text-[#4b37df] transition-colors leading-snug line-clamp-1"
                    >
                      {scholarship.title}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-1">{scholarship.provider}</p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Tuition: {scholarship.tuitionCoverage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Stipend: {scholarship.monthlyStipend ? `${scholarship.stipendCurrency || ''} ${scholarship.monthlyStipend.toLocaleString()}/mo` : 'Covered'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Travel: {scholarship.airfareCoverage || 'Covered Flights'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>{deadlineStr}</span>
                    {daysLeft !== null && daysLeft > 0 && (
                      <span className="text-[10px] text-rose-600 font-semibold">({daysLeft}d left)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={scholarship.primaryOfficialSource || scholarship.officialWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                      title="Direct Official Application Source"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <Link
                      href={`/scholarships/${scholarship.slug || scholarship.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-[11px] font-medium transition-colors"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              <Globe2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <span>No scholarships found matching your filters.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
