'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
  Globe2,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  PublicScholarship,
  getCountryFlag,
  formatDeadline,
  calculateDaysLeft,
} from '@/lib/scholarships';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedFunding, setSelectedFunding] = useState('all');

  useEffect(() => {
    async function fetchLiveScholarships() {
      try {
        setLoading(true);
        const res = await fetch('/api/scholarships');
        if (res.ok) {
          const data = await res.json();
          setScholarships(data.scholarships || []);
        }
      } catch (err) {
        console.error('Failed to load scholarships from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveScholarships();
  }, []);

  // Extract unique countries
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    scholarships.forEach((s) => {
      s.destinationCountries?.forEach((c) => set.add(c));
    });
    return Array.from(set);
  }, [scholarships]);

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      if (query) {
        const q = query.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesDesc = s.shortDescription?.toLowerCase().includes(q);
        const matchesProvider = s.provider?.toLowerCase().includes(q);
        const matchesCountries = s.destinationCountries?.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesProvider && !matchesCountries) return false;
      }

      if (selectedCountry !== 'all') {
        const matchesCountry = s.destinationCountries?.some(
          (c) => c.toLowerCase() === selectedCountry.toLowerCase()
        );
        if (!matchesCountry) return false;
      }

      if (selectedLevel !== 'all') {
        const matchesLevel = s.academicLevels?.some((l) =>
          l.toLowerCase().includes(selectedLevel.toLowerCase())
        );
        if (!matchesLevel) return false;
      }

      if (selectedFunding !== 'all') {
        if (s.fundingClassification !== selectedFunding) return false;
      }

      return true;
    });
  }, [scholarships, query, selectedCountry, selectedLevel, selectedFunding]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#4b37df] text-[11px] font-semibold border border-purple-200">
                Official Government & University Registry
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium">
                Direct Application Routes (0% Service Fees)
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-slate-900 tracking-tight">
              Explore Verified Scholarships
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Every opportunity listed is verified against official government gazettes and embassy portals. Direct routing to authorized portals without middlemen.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by scholarship title, country, or provider..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df]"
                />
              </div>

              <div>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-hidden focus:border-[#4b37df]"
                >
                  <option value="all">All Destinations</option>
                  {availableCountries.map((c) => (
                    <option key={c} value={c}>
                      {getCountryFlag(c)} {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-hidden focus:border-[#4b37df]"
                >
                  <option value="all">All Degree Levels</option>
                  <option value="undergraduate">Undergraduate / Bachelor&apos;s</option>
                  <option value="master">Master&apos;s</option>
                  <option value="phd">PhD / Doctoral</option>
                  <option value="research">Research Fellowship</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Funding:</span>
              {['all', 'Fully funded', 'Partially funded', 'Tuition only'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFunding(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedFunding === f
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Types' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900 font-semibold">{filtered.length}</strong> verified opportunities
            </span>
            <span className="hidden sm:inline">
              Data synchronized with Official Education Ministries
            </span>
          </div>

          {/* Scholarships Grid */}
          {loading ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#4b37df] animate-spin" />
              <span className="text-xs text-slate-500 font-medium">Loading verified scholarship catalog...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => {
                const flag = getCountryFlag(s.destinationCountries?.[0]);
                const deadlineStr = formatDeadline(s.activeCycle?.applicationDeadline);
                const daysLeft = calculateDaysLeft(s.activeCycle?.applicationDeadline);

                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-medium text-slate-900 text-xs">
                          <span className="text-lg">{flag}</span>
                          <span>{s.destinationCountries?.join(', ')}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          s.fundingClassification === 'Fully funded'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {s.fundingClassification}
                        </span>
                      </div>

                      {/* Title & Provider */}
                      <div>
                        <Link
                          href={`/scholarships/${s.slug || s.id}`}
                          className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#4b37df] transition-colors line-clamp-2 leading-snug"
                        >
                          {s.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{s.provider}</span>
                        </p>
                      </div>

                      {/* Key Coverage Entitlements */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Tuition Coverage:</span>
                          <span className="font-semibold text-slate-900">{s.tuitionCoverage}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Monthly Stipend:</span>
                          <span className="font-semibold text-slate-900">
                            {s.monthlyStipend
                              ? `${s.stipendCurrency || ''} ${s.monthlyStipend.toLocaleString()}/mo`
                              : 'Included in Grant'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Academic Level:</span>
                          <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                            {s.academicLevels?.slice(0, 2).join(', ')}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {s.shortDescription}
                      </p>
                    </div>

                    {/* Bottom Deadlines & Actions */}
                    <div className="pt-4 border-t border-slate-100 mt-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{deadlineStr}</span>
                        </div>
                        {daysLeft !== null && daysLeft > 0 && (
                          <span className="text-[10px] font-semibold text-[#4b37df] bg-purple-50 px-2 py-0.5 rounded-full">
                            {daysLeft} days remaining
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href={`/scholarships/${s.slug || s.id}`}
                          className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors shadow-2xs"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={s.primaryOfficialSource || s.officialWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 rounded-full border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && !loading && (
                <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <Globe2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-semibold text-slate-900">No scholarships found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your search query, destination country, or academic level filters.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Verification Disclaimer */}
          <div className="p-6 bg-purple-50/60 rounded-3xl border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#4b37df] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  BidyaGo Official Verification Guarantee
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  BidyaGo never collects scholarship application fees. All application links route directly to authorized national embassies and university portals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
