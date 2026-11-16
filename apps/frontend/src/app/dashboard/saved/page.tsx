'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  ExternalLink,
  Trash2,
  ArrowRight,
  Filter,
  CheckCircle2,
  Loader2,
  Calendar,
  Building2,
} from 'lucide-react';
import {
  PublicScholarship,
  getCountryFlag,
  formatDeadline,
  calculateDaysLeft,
} from '@/lib/scholarships';

export default function SavedScholarshipsPage() {
  const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState('all');
  const [removedAlert, setRemovedAlert] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bidyago_saved_scholarships');
      if (stored) {
        setSavedIds(JSON.parse(stored));
      } else {
        // Initial sample saved items if user hasn't toggled any yet
        const defaultSaved = ['mext-japan-research-2027', 'chevening-uk-scholarships-2027'];
        setSavedIds(defaultSaved);
        localStorage.setItem('bidyago_saved_scholarships', JSON.stringify(defaultSaved));
      }
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
        console.error('Failed to load saved scholarships', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRemove = (id: string, slug: string, title: string) => {
    const nextSaved = savedIds.filter((item) => item !== id && item !== slug);
    setSavedIds(nextSaved);
    try {
      localStorage.setItem('bidyago_saved_scholarships', JSON.stringify(nextSaved));
    } catch {
      // Ignore
    }
    setRemovedAlert(`Removed "${title}" from your saved list`);
    setTimeout(() => setRemovedAlert(null), 3000);
  };

  const savedScholarships = useMemo(() => {
    return scholarships.filter(
      (s) => savedIds.includes(s.id) || savedIds.includes(s.slug)
    );
  }, [scholarships, savedIds]);

  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    savedScholarships.forEach((s) => {
      s.destinationCountries?.forEach((c) => set.add(c));
    });
    return Array.from(set);
  }, [savedScholarships]);

  const filtered = useMemo(() => {
    return savedScholarships.filter((item) => {
      if (
        countryFilter !== 'all' &&
        !item.destinationCountries?.some(
          (c) => c.toLowerCase() === countryFilter.toLowerCase()
        )
      ) {
        return false;
      }
      return true;
    });
  }, [savedScholarships, countryFilter]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-6 h-6 text-[#4b37df] animate-spin" />
        <p className="text-xs text-slate-500 font-light">Loading your saved scholarships...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-slate-900">Saved Scholarships & Grants</h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of verified official government scholarships, application cycles, and deadline reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Filter saved scholarships by destination"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Destinations ({savedScholarships.length})</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c} {getCountryFlag(c)}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/dashboard/explore"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4b37df] text-white text-xs font-normal rounded-full hover:bg-[#3d2cb8] transition-colors"
          >
            <span>+ Explore More</span>
          </Link>
        </div>
      </div>

      {removedAlert && (
        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-center justify-between">
          <span>{removedAlert}</span>
          <button
            onClick={() => setRemovedAlert(null)}
            className="text-amber-600 hover:text-amber-900 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Scholarships List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">No saved scholarships in this category</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Explore our directory of 100% verified embassy and government grant opportunities to bookmark your top options.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-normal rounded-full hover:bg-slate-800"
            >
              <span>Explore Scholarships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => {
            const primaryCountry = item.destinationCountries?.[0] || 'International';
            const flag = getCountryFlag(primaryCountry);
            const deadlineInfo = formatDeadline(item.activeCycle?.applicationDeadline);
            const daysLeft = calculateDaysLeft(item.activeCycle?.applicationDeadline);

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base">{flag}</span>
                    <span className="text-xs font-medium text-slate-700">{primaryCountry}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      {item.fundingClassification?.replace(/_/g, ' ') || 'Fully Funded'}
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Deadline: {deadlineInfo}</span>
                    </span>
                    {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
                      <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-medium">
                        {daysLeft} days left
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/scholarships/${item.slug}`}
                    className="block text-base font-medium text-slate-900 hover:text-[#4b37df] transition-colors"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.provider}</span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.shortDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] text-slate-500">
                        {item.verificationStatus === 'VERIFIED'
                          ? '100% Embassy & Government Verified'
                          : 'Official Source Tracked'}
                      </span>
                    </div>
                    {item.nepaleseEligible === 'YES' && (
                      <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
                        🇳🇵 Eligible for Nepali Students
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    href={`/scholarships/${item.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-normal rounded-full hover:bg-slate-800 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  {item.officialWebsite && (
                    <a
                      href={item.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                      title="Official Government Portal"
                      aria-label="Official Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleRemove(item.id, item.slug, item.title)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                    title="Remove from saved"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
