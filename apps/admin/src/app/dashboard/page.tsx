'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Plus,
  FileCheck2,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { getAppUrl } from '@/lib/auth/targets';

export default function AdminOverviewPage() {
  const [scholarships, setScholarships] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/scholarships');
        if (res.ok) {
          const data = await res.json();
          setScholarships(data.scholarships || []);
        }
      } catch (err) {
        console.warn('Failed to load scholarships', err);
      }
    }
    load();
  }, []);
  const stats = [
    {
      label: 'Registered Students',
      value: '12,420',
      change: '+14% this month',
      subtext: '4.2k active applicants',
      href: '/dashboard/students',
      icon: Users,
      color: 'text-[#4b37df]',
      bg: 'bg-purple-50',
    },
    {
      label: 'Active Scholarships',
      value: scholarships.length.toString(),
      change: `${scholarships.filter((s) => s.publicationStatus === 'PUBLISHED').length} published live`,
      subtext: `${scholarships.filter((s) => s.verificationStatus === 'VERIFIED').length} officially verified`,
      href: '/dashboard/scholarships',
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Partner Organizations',
      value: '84',
      change: '6 pending review',
      subtext: 'Consultancies & Universities',
      href: '/dashboard/organizations',
      icon: Building2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Logged Applications',
      value: '3,892',
      change: '+220 this week',
      subtext: 'Across 14 target countries',
      href: '/dashboard/applications',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const pendingVerifications = [
    {
      id: 'VER-2026-081',
      name: 'Kathmandu International Education Hub',
      type: 'Consultancy',
      location: 'Putalisadak, Kathmandu',
      date: 'May 06, 2026',
      contact: 'compliance@kieh-nepal.com',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      status: 'Pending KYC Review',
    },
    {
      id: 'VER-2026-082',
      name: 'Pokhara Global Study Advisory',
      type: 'Consultancy',
      location: 'New Road, Pokhara',
      date: 'May 05, 2026',
      contact: 'director@pgsa.edu.np',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      status: 'Document Check',
    },
    {
      id: 'VER-2026-083',
      name: 'Nagoya Future University Liaison Office',
      type: 'University',
      location: 'Nagoya, Aichi, Japan',
      date: 'May 04, 2026',
      contact: 'global-admissions@nagoya-fu.jp',
      badgeColor: 'bg-purple-50 text-[#4b37df] border-purple-200',
      status: 'Institution Verified',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Platform Banner (Matching Student Portal Gradient Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#1c1259] to-[#4b37df] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-slate-800">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#4b37df]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>BidyaGo Super Admin Console • Multi-Portal Platform Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white">
              Platform Command & <span className="font-medium text-white">Operations</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Supervising <strong className="text-white font-medium">bidyago.com</strong> (Students), <strong className="text-white font-medium">workspace.bidyago.com</strong> (Partners), and <strong className="text-white font-medium">admin.bidyago.com</strong> (Central Authority).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/scholarships"
              className="px-5 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#4b37df]" />
              <span>Add Scholarship</span>
            </Link>

            <Link
              href="/dashboard/applications"
              className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-300" />
              <span>Review Requests (6)</span>
            </Link>
          </div>
        </div>

        {/* Real-Time Pulse & Environment Info */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Zero Outages Detected
            </span>
            <span>•</span>
            <span className="text-slate-300">Central DB: <strong>PostgreSQL 16</strong></span>
            <span>•</span>
            <span className="text-slate-300">Proxy Mode: <strong>Next.js 16 Native</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={getAppUrl('main', '/')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-purple-200 hover:text-white transition-colors"
            >
              <span>Student Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-white/20">•</span>
            <a
              href={getAppUrl('workspace', '/')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-purple-200 hover:text-white transition-colors"
            >
              <span>Partner Workspace</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid (4 Clean Minimal Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4b37df]/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-slate-900">{stat.value}</span>
                <span className="text-[11px] text-emerald-600 font-medium">{stat.change}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{stat.subtext}</p>
            </Link>
          );
        })}
      </div>

      {/* 3. Pending Organization Verifications Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Pending Institutional Verifications
              </h2>
              <p className="text-xs text-slate-500">
                Consultancies and universities requiring compliance verification before workspace activation
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/applications"
            className="text-xs text-[#4b37df] hover:underline font-medium inline-flex items-center gap-1.5"
          >
            <span>Review All 6 Pending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingVerifications.map((item) => (
            <div
              key={item.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-[#4b37df] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.type}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${item.badgeColor}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {item.location} • Contact: <span className="font-mono text-slate-600">{item.contact}</span> • Submitted {item.date}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/dashboard/applications"
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#4b37df] hover:bg-[#3c2cc5] text-white rounded-full transition-all shadow-2xs"
                >
                  Verify
                </Link>
                <Link
                  href="/dashboard/organizations"
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two-Column Detailed Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bilateral Flagship Scholarship Programs */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                High-Volume Flagship Scholarships
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active government-sponsored bilateral scholarships
              </p>
            </div>
            <Link
              href="/dashboard/scholarships"
              className="text-xs text-[#4b37df] hover:underline font-medium"
            >
              Manage all
            </Link>
          </div>

          <div className="space-y-2.5 pt-1">
            {scholarships.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-800">No Scholarships Created Yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Create your first scholarship program using the 9-section builder to monitor active intakes.
                </p>
                <div className="pt-1">
                  <Link
                    href="/dashboard/scholarships/new"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-[11px] font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Scholarship</span>
                  </Link>
                </div>
              </div>
            ) : (
              scholarships.slice(0, 4).map((prog) => {
                const primaryCountry = prog.destinationCountries?.[0] || 'Global';
                const deadline = prog.activeCycle?.applicationDeadline
                  ? new Date(prog.activeCycle.applicationDeadline).toLocaleDateString()
                  : 'Annual Intake';
                return (
                  <div
                    key={prog.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all text-xs"
                  >
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <p className="font-semibold text-slate-900 truncate">{prog.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {primaryCountry} • Deadline: <span className="text-slate-700 font-medium">{deadline}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                          prog.publicationStatus === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {prog.publicationStatus}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Quality: {prog.completenessScore}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* System Health, Access & Monorepo Controls */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Platform Security & Architecture
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized micro-frontend infrastructure status
              </p>
            </div>
            <Link
              href="/dashboard/security"
              className="text-xs text-[#4b37df] hover:underline font-medium"
            >
              Security log
            </Link>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-950">PostgreSQL Shared Database</p>
                  <p className="text-[11px] text-emerald-700">All 3 frontend apps reading centralized schema</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
                Healthy
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#4b37df] shrink-0" />
                <div>
                  <p className="font-semibold text-purple-950">Next.js 16 Native Proxy Guards</p>
                  <p className="text-[11px] text-purple-700">Subdomain target routing & RBAC enforcement</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#4b37df] bg-white/80 px-2 py-0.5 rounded-full border border-purple-200">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Super Admin Root Authorization</p>
                  <p className="text-[11px] text-slate-500">System Control (Items 15-19) RBAC protected</p>
                </div>
              </div>
              <Link
                href="/dashboard/super"
                className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white px-2 py-0.5 rounded-full border border-slate-200"
              >
                Audit Root
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
