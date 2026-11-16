'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface DeadlineEvent {
  id: string;
  title: string;
  scholarshipOrEntity: string;
  country: string;
  flag: string;
  date: string;
  daysRemaining: number;
  type: 'Embassy Submission' | 'Online Portal' | 'Interview' | 'Document Preparation';
  urgency: 'critical' | 'upcoming' | 'future';
  description: string;
  officialLink?: string;
}

const DEADLINES: DeadlineEvent[] = [
  {
    id: 'dl-1',
    title: 'Physical Application Dossier Submission to Embassy of Japan',
    scholarshipOrEntity: 'MEXT Japan Research & Graduate Scholarship 2026',
    country: 'Japan',
    flag: '🇯🇵',
    date: 'May 15, 2026 at 4:00 PM NPT',
    daysRemaining: 8,
    type: 'Embassy Submission',
    urgency: 'critical',
    description: 'Direct physical submission at Embassy of Japan in Panipokhari, Kathmandu. Post or courier submissions not accepted.',
    officialLink: 'https://www.np.emb-japan.go.jp/itpr_en/mext_scholarship.html',
  },
  {
    id: 'dl-2',
    title: 'Australia Awards OASIS Portal Electronic Submission',
    scholarshipOrEntity: 'Australia Awards Scholarships (DFAT)',
    country: 'Australia',
    flag: '🇦🇺',
    date: 'April 30, 2026 at 11:59 PM AEST',
    daysRemaining: 24,
    type: 'Online Portal',
    urgency: 'upcoming',
    description: 'Ensure all scanned transcripts and supervisor endorsement letters are uploaded to the OASIS platform.',
    officialLink: 'https://www.dfat.gov.au',
  },
  {
    id: 'dl-3',
    title: 'Written Examination (English & Japanese) at Embassy',
    scholarshipOrEntity: 'MEXT Japan 2026 First Screening',
    country: 'Japan',
    flag: '🇯🇵',
    date: 'June 10, 2026',
    daysRemaining: 34,
    type: 'Interview',
    urgency: 'upcoming',
    description: 'Conducted at Japanese Embassy Kathmandu. Only shortlisted candidates following document screening are invited.',
  },
  {
    id: 'dl-4',
    title: 'Chevening UK 2026/27 Portal Opens for Applications',
    scholarshipOrEntity: 'Chevening UK Master’s Scholarship',
    country: 'United Kingdom',
    flag: '🇬🇧',
    date: 'August 04, 2026',
    daysRemaining: 89,
    type: 'Online Portal',
    urgency: 'future',
    description: 'Annual global portal opens. Require three UK university choices and leadership essays.',
    officialLink: 'https://www.chevening.org',
  },
  {
    id: 'dl-5',
    title: 'Global Korea Scholarship (GKS) Embassy Quota Intake',
    scholarshipOrEntity: 'Korean Embassy in Nepal / NIIED',
    country: 'South Korea',
    flag: '🇰🇷',
    date: 'February 2027',
    daysRemaining: 270,
    type: 'Embassy Submission',
    urgency: 'future',
    description: 'Annual intake for Graduate and Doctoral candidates.',
  },
];

export default function DeadlinesAndCalendarPage() {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = DEADLINES.filter((d) => {
    if (filterType === 'all') return true;
    return d.type.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider block">
            Time-Critical Milestones
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Deadlines & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chronological calendar of embassy submission windows, portal cutoffs, and exam schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden focus:border-[#4b37df] cursor-pointer"
          >
            <option value="all">All Deadline Types</option>
            <option value="embassy submission">Embassy Submissions</option>
            <option value="online portal">Online Portals</option>
            <option value="interview">Exams & Interviews</option>
          </select>
        </div>
      </div>

      {/* Critical Alert Bar */}
      <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-orange-950">
            Immediate Action Required: MEXT Japan Closes in 8 Days
          </h3>
          <p className="text-xs text-orange-800 leading-relaxed">
            The Embassy of Japan in Panipokhari, Kathmandu strictly enforces the May 15 deadline. Late physical submissions will not be received. Ensure your medical certificate is signed.
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filtered.map((deadline) => {
          const isCritical = deadline.urgency === 'critical';
          return (
            <div
              key={deadline.id}
              className={`p-6 rounded-3xl bg-white border transition-all ${
                isCritical
                  ? 'border-orange-300 shadow-sm'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg">{deadline.flag}</span>
                    <span className="text-xs font-semibold text-slate-700">{deadline.country}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {deadline.type}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          : deadline.urgency === 'upcoming'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {deadline.daysRemaining} Days Left
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 leading-snug">
                    {deadline.title}
                  </h3>
                  <p className="text-xs font-medium text-[#4b37df]">{deadline.scholarshipOrEntity}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{deadline.description}</p>
                </div>

                <div className="md:text-right shrink-0 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-800">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#4b37df]" />
                    <span>{deadline.date}</span>
                  </div>

                  {deadline.officialLink && (
                    <div>
                      <a
                        href={deadline.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#4b37df] font-medium hover:underline"
                      >
                        <span>Official Notice</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
