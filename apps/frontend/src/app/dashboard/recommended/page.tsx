'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  provider: string;
  country: string;
  flag: string;
  matchScore: number;
  matchFactors: {
    gpaFit: string;
    languageFit: string;
    fieldFit: string;
    fundingFit: string;
  };
  coverageSummary: string;
  monthlyStipend: string;
  deadline: string;
  daysRemaining: number;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'mext-japan-2026',
    title: 'MEXT Research & Graduate Scholarship (Embassy Recommendation)',
    provider: 'Japanese Ministry of Education (MEXT) & Embassy of Japan in Nepal',
    country: 'Japan',
    flag: '🇯🇵',
    matchScore: 98,
    matchFactors: {
      gpaFit: 'GPA 3.72 exceeds 3.2 minimum threshold (100% Fit)',
      languageFit: 'IELTS 7.5 exceeds Japanese English-track criteria (B2/C1)',
      fieldFit: 'Computer Science & AI matches National Key Priority fields',
      fundingFit: '100% Fully Funded Tuition + ¥144,000/mo Stipend + Flights',
    },
    coverageSummary: 'Full tuition, roundtrip airfare, medical coverage, no fees',
    monthlyStipend: '¥144,000 / month (~$960)',
    deadline: 'May 15, 2026',
    daysRemaining: 8,
  },
  {
    id: 'australia-awards-2026',
    title: 'Australia Awards Scholarships (South & West Asia Category)',
    provider: 'Australian Government Department of Foreign Affairs and Trade (DFAT)',
    country: 'Australia',
    flag: '🇦🇺',
    matchScore: 95,
    matchFactors: {
      gpaFit: 'Strong undergraduate academic standing (Top 10%)',
      languageFit: 'IELTS 7.5 with no band under 7.0 meets DFAT standards',
      fieldFit: 'Technology, Data & Digital Infrastructure Priority Sector',
      fundingFit: 'Full Tuition, Airfare, AUD $30,000/yr Living Allowance',
    },
    coverageSummary: 'Full tuition, overseas student health cover, establishment allowance',
    monthlyStipend: 'AUD $2,500 / month (~$1,650)',
    deadline: 'April 30, 2026',
    daysRemaining: 24,
  },
  {
    id: 'chevening-uk-2026',
    title: 'Chevening UK Master’s Scholarship',
    provider: 'Foreign, Commonwealth & Development Office (FCDO)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    matchScore: 92,
    matchFactors: {
      gpaFit: 'Upper second-class (2:1) honours equivalent satisfied',
      languageFit: 'English proficiency requirement fully met',
      fieldFit: 'STEM & AI Leadership Track',
      fundingFit: 'Full Master’s Tuition + £1,350/mo Living Stipend',
    },
    coverageSummary: 'Economy flight to/from UK, arrival allowance, visa cost covered',
    monthlyStipend: '£1,350 / month (~$1,720)',
    deadline: 'November 2026',
    daysRemaining: 120,
  },
];

export default function RecommendedScholarshipsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
            Algorithmic Matching Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Recommended for You
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized recommendations calibrated to your academic qualifications, GPA, and destination preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          >
            Update Profile Matrix
          </Link>
        </div>
      </div>

      {/* Match Summary Pill Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-emerald-950">Active Student Profile Calibration</h3>
            <p className="text-xs text-emerald-800">
              GPA: <strong>3.72</strong> • IELTS: <strong>7.5</strong> • Major: <strong>Computer Science & AI</strong> • Target: <strong>Master’s</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-emerald-900 bg-white/80 px-3.5 py-1.5 rounded-full border border-emerald-300">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Profile Strength: Top 5% Applicant Pool</span>
        </div>
      </div>

      {/* Recommended List */}
      <div className="space-y-5">
        {RECOMMENDATIONS.map((rec) => (
          <div
            key={rec.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-[#4b37df]/50 hover:shadow-md transition-all space-y-5"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{rec.flag}</span>
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {rec.country}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                    {rec.matchScore}% Match Index
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 hover:text-[#4b37df] transition-colors">
                  <Link href={`/scholarships#${rec.id}`}>{rec.title}</Link>
                </h3>
                <p className="text-xs text-slate-500">{rec.provider}</p>
              </div>

              <div className="md:text-right shrink-0">
                <span className="text-xs font-semibold text-slate-900 block">{rec.coverageSummary}</span>
                <span className="text-xs text-slate-500 block mt-0.5">{rec.monthlyStipend}</span>
              </div>
            </div>

            {/* Match Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>GPA Requirement:</strong> {rec.matchFactors.gpaFit}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Language Standard:</strong> {rec.matchFactors.languageFit}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Priority Field:</strong> {rec.matchFactors.fieldFit}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Funding Model:</strong> {rec.matchFactors.fundingFit}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>Upcoming Deadline: <strong>{rec.deadline}</strong> ({rec.daysRemaining} days left)</span>
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/saved"
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  Save to Shortlist
                </Link>
                <Link
                  href="/dashboard/applications"
                  className="px-4 py-2 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white font-medium transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>Start Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
