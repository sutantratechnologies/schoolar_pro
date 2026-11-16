'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Bookmark,
  Calendar,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  PublicScholarship,
  getCountryFlag,
  formatDeadline,
  calculateDaysLeft,
} from '@/lib/scholarships';

export interface ScholarshipCardProps {
  scholarship: PublicScholarship;
  savedIds?: string[];
  onToggleSave?: (id: string, slug: string) => void;
  onSummaryClick?: (scholarship: PublicScholarship) => void;
}

export default function ScholarshipCard({
  scholarship: item,
  savedIds,
  onToggleSave,
  onSummaryClick,
}: ScholarshipCardProps) {
  const [localSaved, setLocalSaved] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  const primaryCountry = item.destinationCountries?.[0] || 'International';
  const flag = getCountryFlag(primaryCountry);
  const deadline = formatDeadline(item.activeCycle?.applicationDeadline);
  const daysLeft = calculateDaysLeft(item.activeCycle?.applicationDeadline);

  useEffect(() => {
    if (savedIds) {
      setLocalSaved(savedIds.includes(item.id) || savedIds.includes(item.slug));
    } else {
      try {
        const stored = localStorage.getItem('bidyago_saved_scholarships');
        if (stored) {
          const list: string[] = JSON.parse(stored);
          setLocalSaved(list.includes(item.id) || list.includes(item.slug));
        }
      } catch {
        // Ignore
      }
    }
  }, [savedIds, item.id, item.slug]);

  const handleBookmark = () => {
    if (onToggleSave) {
      onToggleSave(item.id, item.slug);
    } else {
      try {
        const stored = localStorage.getItem('bidyago_saved_scholarships');
        let list: string[] = stored ? JSON.parse(stored) : [];
        const isAlready = list.includes(item.id) || list.includes(item.slug);
        list = isAlready
          ? list.filter((x) => x !== item.id && x !== item.slug)
          : [...list, item.slug || item.id];
        localStorage.setItem('bidyago_saved_scholarships', JSON.stringify(list));
        setLocalSaved(!isAlready);
      } catch {
        // Ignore
      }
    }
  };

  const handleSummary = () => {
    if (onSummaryClick) {
      onSummaryClick(item);
    } else {
      setShowSummaryModal(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
        {/* Cover Photo Banner */}
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
          <img
            src={
              item.coverImageUrl?.trim() ||
              'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop'
            }
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />

          {/* Floating Flag & Country */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-semibold shadow-xs">
            <span>{flag}</span>
            <span>{primaryCountry}</span>
          </div>

          {/* Bookmark Button */}
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={handleBookmark}
              aria-label={localSaved ? 'Remove from saved' : 'Save scholarship'}
              className="p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-[#4b37df] transition-colors cursor-pointer shadow-xs"
            >
              <Bookmark
                className={`w-3.5 h-3.5 transition-colors ${
                  localSaved ? 'fill-[#4b37df] text-[#4b37df]' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Provider in Uppercase */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider line-clamp-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.provider}</span>
            </div>

            {/* Title in Purple */}
            <Link
              href={`/scholarships/${item.slug || item.id}`}
              className="block text-lg font-bold text-[#4b37df] hover:text-[#3d2ac9] transition-colors leading-snug line-clamp-2"
            >
              {item.title}
            </Link>

            {/* Short Description */}
            <p className="text-xs text-slate-500 line-clamp-2 font-normal leading-relaxed">
              {item.shortDescription}
            </p>

            {/* Tag Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100/60">
                {item.fundingClassification?.replace(/_/g, ' ') || 'Fully funded'}
              </span>

              {item.academicLevels?.slice(0, 1).map((deg) => (
                <span
                  key={deg}
                  className="px-2.5 py-0.5 rounded-full text-xs font-normal bg-slate-50 text-slate-600 border border-slate-100"
                >
                  {deg}
                </span>
              ))}

              {(item.nepaleseEligible === 'YES' || !item.nepaleseEligible) && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  🇳🇵 Nepal Eligible
                </span>
              )}
            </div>
          </div>

          {/* Footer details: Deadline & Action Buttons */}
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

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/scholarships/${item.slug || item.id}`}
                className="flex-1 py-2.5 text-center text-xs font-medium text-white bg-slate-900 hover:bg-[#4b37df] rounded-full transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleSummary}
                className="px-4 py-2.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 font-medium cursor-pointer"
              >
                Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.provider}</span>
                </span>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Funding Classification
              </span>
              <p className="text-lg font-bold text-slate-900">
                {item.fundingClassification?.replace(/_/g, ' ') || 'Fully funded'}
              </p>
              <p className="text-xs text-slate-600">
                Destination: {flag} {item.destinationCountries?.join(', ')}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <strong className="text-slate-900">Academic Levels:</strong>{' '}
                {item.academicLevels?.join(', ')}
              </p>
              {item.fieldsOfStudy && item.fieldsOfStudy.length > 0 && (
                <p>
                  <strong className="text-slate-900">Study Fields:</strong>{' '}
                  {item.fieldsOfStudy.slice(0, 4).join(', ')}
                </p>
              )}
              <p>
                <strong className="text-slate-900">Application Deadline:</strong> {deadline}
              </p>
              {item.tuitionCoverage && (
                <p>
                  <strong className="text-slate-900">Tuition Coverage:</strong> {item.tuitionCoverage}
                </p>
              )}
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] text-purple-900 leading-relaxed flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified through official government & university publication channels.</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-center"
              >
                Close
              </button>
              <Link
                href={`/scholarships/${item.slug || item.id}`}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-[#4b37df] rounded-full transition-colors text-center shadow-xs"
              >
                Full Page Briefing →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
