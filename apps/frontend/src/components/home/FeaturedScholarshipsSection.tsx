'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Building2,
} from 'lucide-react';
import {
  PublicScholarship,
  getCountryFlag,
  formatDeadline,
  calculateDaysLeft,
} from '@/lib/scholarships';

interface FeaturedScholarshipsSectionProps {
  searchQuery?: string;
  selectedDegree?: string;
}

export default function FeaturedScholarshipsSection({
  searchQuery = '',
  selectedDegree = 'all',
}: FeaturedScholarshipsSectionProps) {
  const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<PublicScholarship | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bidyago_saved_scholarships');
      if (stored) setSavedIds(JSON.parse(stored));
    } catch {
      // Ignore
    }

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/scholarships');
        if (res.ok) {
          const json = await res.json();
          setScholarships(json.scholarships || []);
        }
      } catch (err) {
        console.error('Failed to load featured scholarships', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleSave = (id: string, slug: string) => {
    setSavedIds((prev) => {
      const isAlready = prev.includes(id) || prev.includes(slug);
      const next = isAlready
        ? prev.filter((item) => item !== id && item !== slug)
        : [...prev, slug || id];
      try {
        localStorage.setItem('bidyago_saved_scholarships', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const categories = [
    'All',
    'Government',
    'Merit-based',
    'Fully Funded',
    'Research',
    'University',
  ];

  const filtered = useMemo(() => {
    return scholarships.filter((sch) => {
      // Category filter
      if (activeCategory !== 'All') {
        const catLower = activeCategory.toLowerCase();
        const matchesCategory =
          sch.categories?.some((c) => c.toLowerCase().includes(catLower)) ||
          sch.providerType?.toLowerCase().includes(catLower) ||
          (catLower === 'fully funded' && sch.fundingClassification === 'FULLY_FUNDED');
        if (!matchesCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          sch.title?.toLowerCase().includes(q) ||
          sch.provider?.toLowerCase().includes(q) ||
          sch.destinationCountries?.some((c) => c.toLowerCase().includes(q)) ||
          sch.fieldsOfStudy?.some((f) => f.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Degree filter
      if (selectedDegree !== 'all') {
        const degLower = selectedDegree.toLowerCase();
        const matchDegree = sch.academicLevels?.some((d) =>
          d.toLowerCase().includes(degLower)
        );
        if (!matchDegree) return false;
      }

      return true;
    });
  }, [scholarships, activeCategory, searchQuery, selectedDegree]);

  return (
    <section id="scholarships" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-normal text-slate-400 uppercase tracking-widest block mb-2">
              Verified Directory
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight">
              Featured Scholarships & Fellowships
            </h2>
            <p className="mt-2 text-base text-slate-500 font-normal max-w-xl">
              100% verified government and embassy programs offering direct financial backing, tuition
              coverage, and living stipends for Nepali and international applicants.
            </p>
          </div>

          {/* Minimalist Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#4b37df] animate-spin" />
            <p className="text-xs text-slate-400 font-light">Loading verified scholarships...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const isSaved = savedIds.includes(item.id) || savedIds.includes(item.slug);
              const primaryCountry = item.destinationCountries?.[0] || 'International';
              const flag = getCountryFlag(primaryCountry);
              const deadline = formatDeadline(item.activeCycle?.applicationDeadline);
              const daysLeft = calculateDaysLeft(item.activeCycle?.applicationDeadline);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-400 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Flag, Provider, Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl" role="img" aria-label={primaryCountry}>
                          {flag}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider line-clamp-1">
                            {item.provider}
                          </p>
                          <p className="text-[11px] text-slate-500 font-normal">
                            {primaryCountry}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSave(item.id, item.slug)}
                        aria-label={isSaved ? 'Remove from saved' : 'Save scholarship'}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-[#4b37df] transition-colors cursor-pointer"
                      >
                        <Bookmark
                          className={`w-4 h-4 transition-colors ${
                            isSaved ? 'fill-[#4b37df] text-[#4b37df]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/scholarships/${item.slug}`}
                      className="block text-lg font-medium text-slate-900 group-hover:text-[#4b37df] transition-colors leading-snug mb-2"
                    >
                      {item.title}
                    </Link>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-normal">
                      {item.shortDescription}
                    </p>

                    {/* Funding & Level Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100/60">
                        {item.fundingClassification?.replace(/_/g, ' ') || 'Fully Funded'}
                      </span>
                      {item.academicLevels?.slice(0, 2).map((deg) => (
                        <span
                          key={deg}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-slate-50 text-slate-600 border border-slate-100"
                        >
                          {deg}
                        </span>
                      ))}
                      {item.nepaleseEligible === 'YES' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          🇳🇵 Nepal Eligible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer details: Deadline & Action */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {deadline}</span>
                      </div>
                      {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
                        <span className="text-[11px] text-rose-600 font-medium">
                          {daysLeft}d left
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/scholarships/${item.slug}`}
                        className="flex-1 py-2 text-center text-xs font-normal text-white bg-slate-900 hover:bg-[#4b37df] rounded-full transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setSelectedScholarship(item)}
                        className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
                      >
                        Summary
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-500 font-normal">
              No scholarships found matching your criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
              }}
              className="mt-3 text-xs text-[#4b37df] hover:underline font-normal cursor-pointer"
            >
              Reset Category
            </button>
          </div>
        )}

        {/* Modal for Quick Application Summary */}
        {selectedScholarship && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{selectedScholarship.provider}</span>
                  </span>
                  <h3 className="text-xl font-normal text-slate-900 mt-1">
                    {selectedScholarship.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedScholarship(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-normal text-slate-400 block">
                  Funding Classification
                </span>
                <p className="text-xl font-medium text-slate-900 tracking-tight">
                  {selectedScholarship.fundingClassification?.replace(/_/g, ' ') || 'Fully Funded'}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Destination: {getCountryFlag(selectedScholarship.destinationCountries?.[0])}{' '}
                  {selectedScholarship.destinationCountries?.join(', ')}
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-600 font-normal">
                <p>
                  <span className="text-slate-400">Academic Levels:</span>{' '}
                  {selectedScholarship.academicLevels?.join(', ')}
                </p>
                <p>
                  <span className="text-slate-400">Study Fields:</span>{' '}
                  {selectedScholarship.fieldsOfStudy?.slice(0, 4).join(', ') || 'All major fields'}
                </p>
                <p>
                  <span className="text-slate-400">Application Deadline:</span>{' '}
                  {formatDeadline(selectedScholarship.activeCycle?.applicationDeadline)}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="text-emerald-700 font-normal flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {selectedScholarship.verificationStatus === 'VERIFIED'
                        ? '100% Embassy & Govt Verified'
                        : 'Official Source Audited'}
                    </span>
                  </span>
                  <span className="text-slate-400">
                    Route: {selectedScholarship.applicationRoute?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-normal leading-relaxed">
                Applications for this programme are handled directly through official government
                and university routes. BidyaGo provides verified criteria and deadline tracking free.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedScholarship(null)}
                  className="flex-1 py-2.5 text-xs font-normal text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href={`/scholarships/${selectedScholarship.slug}`}
                  className="flex-1 py-2.5 text-center text-xs font-normal text-white bg-slate-900 hover:bg-[#4b37df] rounded-full transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <span>Full Guide & Criteria</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[10px] text-center text-slate-400 font-normal pt-1">
                BidyaGo does not award scholarships, guarantee admission, or charge application fees.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
