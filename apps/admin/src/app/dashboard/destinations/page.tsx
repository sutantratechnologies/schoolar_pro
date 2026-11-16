'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Globe2,
  RefreshCw,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { fetchCountries, Country } from '@/lib/countries';

const PAGE_CHUNK = 20;

export default function DestinationsPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [onlyWithScholarships, setOnlyWithScholarships] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [countryList, schRes] = await Promise.all([
          fetchCountries(),
          fetch('/api/admin/scholarships').then((r) => (r.ok ? r.json() : { scholarships: [] })),
        ]);

        // Clean deduplication by ISO code
        const seen = new Set<string>();
        const unique: Country[] = [];
        (countryList || []).forEach((c) => {
          const code = (c.code || '').toUpperCase().trim();
          if (code && !seen.has(code)) {
            seen.add(code);
            unique.push(c);
          }
        });

        setCountries(unique);
        setScholarships(schRes.scholarships || []);
      } catch (err) {
        console.warn('Failed to load destinations', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Map country name, code, and aliases to live scholarship count
  const countryCounts = useMemo(() => {
    const map = new Map<string, number>();
    scholarships.forEach((s) => {
      s.destinationCountries?.forEach((raw: string) => {
        if (!raw) return;
        const key = raw.toLowerCase().trim();
        map.set(key, (map.get(key) || 0) + 1);

        // Normalize aliases for consistent count retrieval
        if (key === 'cocos (keeling) islands' || key === 'cocos islands') {
          map.set('cc', (map.get('cc') || 0) + 1);
        }
        if (key === 'vatican' || key.includes('vatican city') || key.includes('holy see')) {
          map.set('va', (map.get('va') || 0) + 1);
        }
      });
    });
    return map;
  }, [scholarships]);

  const getCountryCount = useCallback(
    (c: Country): number => {
      const nameKey = c.name.toLowerCase().trim();
      const codeKey = c.code.toLowerCase().trim();
      let count = countryCounts.get(nameKey) || countryCounts.get(codeKey) || 0;

      // Check special aliases
      if (codeKey === 'va') {
        count = Math.max(
          count,
          countryCounts.get('vatican') || 0,
          countryCounts.get('vatican city') || 0,
          countryCounts.get('vatican city state (holy see)') || 0
        );
      }
      if (codeKey === 'cc') {
        count = Math.max(
          count,
          countryCounts.get('cocos (keeling) islands') || 0,
          countryCounts.get('cocos islands') || 0
        );
      }
      return count;
    },
    [countryCounts]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return countries.filter((d) => {
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (onlyWithScholarships) {
        const count = getCountryCount(d);
        if (count <= 0) return false;
      }

      return true;
    });
  }, [countries, search, onlyWithScholarships, getCountryCount]);

  // Reset pagination when search or filter changes
  useEffect(() => {
    setVisibleCount(PAGE_CHUNK);
  }, [search, onlyWithScholarships]);

  // Infinite scroll trigger with IntersectionObserver
  useEffect(() => {
    if (visibleCount >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK, filtered.length));
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [visibleCount, filtered.length]);

  const visibleItems = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const activeDestinationsCount = useMemo(() => {
    return countries.filter((c) => getCountryCount(c) > 0).length;
  }, [countries, getCountryCount]);

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
            Global country catalog ({countries.length} international destinations deduplicated with flags; {activeDestinationsCount} currently active).
          </p>
        </div>

        <Link
          href="/dashboard/scholarships/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Scholarship</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search among 250 countries by name or ISO code..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyWithScholarships(!onlyWithScholarships)}
            className={`px-4 py-2 rounded-2xl text-xs font-medium transition-colors cursor-pointer shrink-0 border ${
              onlyWithScholarships
                ? 'bg-[#4b37df] text-white border-[#4b37df]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {onlyWithScholarships
              ? `✓ Showing Active Destinations (${activeDestinationsCount})`
              : `Show Destinations with Active Scholarships (${activeDestinationsCount})`}
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#4b37df] mx-auto" />
            <p className="text-xs text-slate-400">Loading global countries catalog...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
              {visibleItems.map((d) => {
                const count = getCountryCount(d);
                return (
                  <div
                    key={d.code}
                    className={`p-4 rounded-2xl border transition-all shadow-2xs space-y-2.5 ${
                      count > 0
                        ? 'border-purple-200 bg-purple-50/20 hover:border-purple-300'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl shrink-0 p-1 bg-slate-50 border border-slate-100 rounded-xl leading-none">
                          {d.flag}
                        </span>
                        <div className="truncate">
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {d.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-mono">ISO: {d.code}</p>
                        </div>
                      </div>
                      {count > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {count} Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          0 live
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>{count > 0 ? `${count} scholarship(s)` : 'Available for entry'}</span>
                      </span>
                      <Link
                        href={`/dashboard/scholarships?country=${encodeURIComponent(d.name)}`}
                        className="text-[#4b37df] hover:underline font-medium text-[11px]"
                      >
                        Filter →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sentinel for infinite scrolling */}
            <div ref={sentinelRef} className="h-6 w-full flex items-center justify-center">
              {visibleCount < filtered.length && (
                <div className="pt-4 pb-2 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK, filtered.length))}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>
                      Load More (Showing {visibleItems.length} of {filtered.length})
                    </span>
                  </button>
                </div>
              )}
            </div>

            {visibleCount >= filtered.length && filtered.length > 0 && (
              <div className="py-4 text-center">
                <span className="text-xs text-slate-400 font-medium">
                  Showing all {filtered.length} destinations
                </span>
              </div>
            )}
          </>
        )}

        {filtered.length === 0 && !loading && (
          <div className="py-16 text-center space-y-2">
            <Globe2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No destination countries found</p>
            <p className="text-[11px] text-slate-400">Try searching with a different name or ISO code.</p>
          </div>
        )}
      </div>
    </div>
  );
}
