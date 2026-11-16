'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Bookmark,
  Sparkles,
  FileText,
  Calendar,
  CheckSquare,
  FolderCheck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Award,
} from 'lucide-react';
import type { CurrentSession } from '@sass-project/contracts';
import { fetchCurrentSession } from '@/lib/auth';
import {
  getStoredStudentProfile,
  calculateProfileReadiness,
} from '@/lib/student-profile';
import { StudentProfile, INITIAL_STUDENT_PROFILE } from '@/types/student-profile';

interface RecommendedScholarship {
  id: string;
  title: string;
  provider: string;
  country: string;
  flag: string;
  funding: string;
  stipend: string;
  deadline: string;
  daysLeft: number;
  matchScore: number;
  tags: string[];
}

const TOP_RECOMMENDED: RecommendedScholarship[] = [
  {
    id: 'mext-japan-2026',
    title: 'MEXT Research & Graduate Scholarship',
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT)',
    country: 'Japan',
    flag: '🇯🇵',
    funding: 'Fully Funded',
    stipend: '¥144,000 / month (~$960)',
    deadline: 'May 15, 2026',
    daysLeft: 8,
    matchScore: 98,
    tags: ['Master’s & PhD', '100% Tuition', 'Roundtrip Airfare'],
  },
  {
    id: 'australia-awards-2026',
    title: 'Australia Awards Scholarships 2026',
    provider: 'Department of Foreign Affairs and Trade (DFAT)',
    country: 'Australia',
    flag: '🇦🇺',
    funding: 'Fully Funded',
    stipend: 'AUD $30,000 / year',
    deadline: 'April 30, 2026',
    daysLeft: 24,
    matchScore: 95,
    tags: ['Master’s', 'Health Cover', 'Living Allowance'],
  },
  {
    id: 'chevening-uk-2026',
    title: 'Chevening UK Master’s Scholarship',
    provider: 'Foreign, Commonwealth & Development Office (FCDO)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    funding: 'Fully Funded',
    stipend: '£1,350 / month',
    deadline: 'November 2026',
    daysLeft: 120,
    matchScore: 92,
    tags: ['One-year Master’s', 'Global Network', 'Full Tuition'],
  },
];

interface QuickTask {
  id: string;
  title: string;
  deadline: string;
  category: string;
  completed: boolean;
}

export default function StudentDashboardPage() {
  const [session, setSession] = useState<CurrentSession | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [tasks, setTasks] = useState<QuickTask[]>([
    {
      id: 'task-1',
      title: 'Revise Field of Study & Research Plan (SOP Draft v3)',
      deadline: 'May 10',
      category: 'MEXT Japan',
      completed: false,
    },
    {
      id: 'task-2',
      title: 'Collect Dean’s Letter of Recommendation from TU',
      deadline: 'May 12',
      category: 'Documents',
      completed: true,
    },
    {
      id: 'task-3',
      title: 'Submit certified physical copies to Japanese Embassy (Panipokhari)',
      deadline: 'May 15',
      category: 'Embassy Submission',
      completed: false,
    },
    {
      id: 'task-4',
      title: 'Request transcript certification from Ministry of Education (Sanothimi)',
      deadline: 'May 18',
      category: 'Verification',
      completed: false,
    },
  ]);

  useEffect(() => {
    void fetchCurrentSession().then((s) => setSession(s));
    setProfile(getStoredStudentProfile());

    const handleProfileUpdate = () => {
      setProfile(getStoredStudentProfile());
    };
    window.addEventListener('bidyago_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('bidyago_profile_updated', handleProfileUpdate);
  }, []);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const studentName = session?.user?.name || profile.personalInfo.fullName || 'Student';
  const readinessScore = calculateProfileReadiness(profile);
  const targetDegree = profile.studyPreferences.intendedAcademicLevel === 'masters' ? 'Master’s' : 'Bachelor’s';
  const targetCountries = profile.studyPreferences.destinationCountries.slice(0, 3).join(', ') || 'Japan, Australia, UK';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Welcome & Academic Target Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#1c1259] to-[#4b37df] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-slate-800">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#4b37df]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>BidyaGo Student Portal • Academic Year 2026/27</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white">
              Welcome back, <span className="font-medium text-white">{studentName}</span> 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Target: <strong className="text-white font-medium">{targetDegree}</strong> • Priority Destinations: <strong className="text-white font-medium">{targetCountries}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/onboarding"
              className="px-5 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#4b37df]" />
              <span>Complete Profile ({readinessScore}%)</span>
            </Link>

            <Link
              href="/dashboard/explore"
              className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Grants</span>
            </Link>
          </div>
        </div>

        {/* Readiness Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3 flex-1 w-full max-w-md">
            <span className="shrink-0 text-slate-200 font-medium">Application Readiness:</span>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-emerald-400 to-[#4b37df] h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <Link href="/onboarding" className="font-semibold text-emerald-300 hover:underline">
              {readinessScore}% ➔
            </Link>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Authenticity
            </span>
            <span>•</span>
            <span>Zero Middlemen Fees</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Link
          href="/dashboard/saved"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4b37df]/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Saved Scholarships</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#4b37df] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">4</span>
            <span className="text-[11px] text-emerald-600 font-medium">+2 newly verified</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">MEXT, Australia Awards, Chevening, GKS</p>
        </Link>

        {/* Metric 2 */}
        <Link
          href="/dashboard/applications"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4b37df]/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Applications</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">2</span>
            <span className="text-[11px] text-blue-600 font-medium">In Drafting & Review</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">65% overall progress</p>
        </Link>

        {/* Metric 3 */}
        <Link
          href="/dashboard/tasks"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4b37df]/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">3</span>
            <span className="text-[11px] text-rose-600 font-medium">1 High Priority</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Next due in 3 days</p>
        </Link>

        {/* Metric 4 */}
        <Link
          href="/dashboard/calendar"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4b37df]/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Next Major Deadline</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">8 Days</span>
            <span className="text-[11px] text-orange-600 font-medium">May 15, 2026</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">MEXT Japan Embassy submission</p>
        </Link>
      </div>

      {/* 3. Main Split View: Recommended for Me & Application Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Recommended for You */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#4b37df]" />
                <span>Recommended for Me</span>
              </h2>
              <p className="text-xs text-slate-500">
                Matched automatically with your GPA (3.72), Field of Study, and target countries.
              </p>
            </div>

            <Link
              href="/dashboard/recommended"
              className="text-xs font-semibold text-[#4b37df] hover:underline flex items-center gap-1"
            >
              <span>View all (12)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {TOP_RECOMMENDED.map((scholarship) => (
              <div
                key={scholarship.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4b37df]/50 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{scholarship.flag}</span>
                      <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                        {scholarship.country}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {scholarship.matchScore}% Match
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 hover:text-[#4b37df] transition-colors">
                      <Link href={`/scholarships#${scholarship.id}`}>{scholarship.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">{scholarship.provider}</p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-900 block">{scholarship.funding}</span>
                    <span className="text-[11px] text-slate-500 block">{scholarship.stipend}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {scholarship.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>Deadline: {scholarship.deadline} ({scholarship.daysLeft}d left)</span>
                    </span>

                    <Link
                      href="/dashboard/saved"
                      className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Comparison Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-100 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-purple-950 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#4b37df]" />
                Compare Top Government Scholarships
              </h4>
              <p className="text-xs text-purple-800">
                Compare coverage, eligibility, and monthly stipends for Japan (MEXT) vs Australia (DFAT) vs UK (Chevening).
              </p>
            </div>
            <Link
              href="/dashboard/compare"
              className="px-4 py-2 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-medium shrink-0 transition-colors shadow-xs"
            >
              Open Comparison Matrix
            </Link>
          </div>
        </div>

        {/* Right Column (1 span): Active Applications & Quick Checklist */}
        <div className="space-y-6">
          {/* Active Application Preview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4b37df]" />
                <span>Active Applications</span>
              </h3>
              <Link href="/dashboard/applications" className="text-xs text-[#4b37df] font-medium hover:underline">
                Tracker →
              </Link>
            </div>

            {/* App 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">🇯🇵 MEXT Japan 2026</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  Drafting Docs
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Progress</span>
                  <span className="font-semibold text-slate-700">65%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#4b37df] h-full rounded-full w-[65%]" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Embassy Deadline: May 15, 2026</p>
            </div>

            {/* App 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">🇦🇺 Australia Awards</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                  OASIS Portal
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Progress</span>
                  <span className="font-semibold text-slate-700">40%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[40%]" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">Portal Deadline: April 30, 2026</p>
            </div>
          </div>

          {/* Tasks & Action Checklist */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Tasks & Checklist</span>
              </h3>
              <Link href="/dashboard/tasks" className="text-xs text-[#4b37df] font-medium hover:underline">
                View all ({tasks.length})
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded-md border-slate-300 text-[#4b37df] focus:ring-[#4b37df] cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>{task.category}</span>
                      <span>•</span>
                      <span>Due {task.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Vault Status */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-indigo-600" />
                <span>My Documents</span>
              </h3>
              <Link href="/dashboard/documents" className="text-xs text-[#4b37df] font-medium hover:underline">
                Vault →
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              3 of 4 core documents are prepared and ready for upcoming embassy and university submissions.
            </p>

            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex items-center justify-between py-1 text-slate-700">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Academic Transcripts (TU)
                </span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
              </div>
              <div className="flex items-center justify-between py-1 text-slate-700">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  IELTS Academic (7.5 Overall)
                </span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
              </div>
              <div className="flex items-center justify-between py-1 text-slate-700">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Statement of Purpose
                </span>
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Draft v2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
