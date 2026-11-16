'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Building,
  GraduationCap,
  Globe2,
  DollarSign,
  CheckCircle2,
  Clock,
  Plane,
  HeartPulse,
  Award,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  PublicScholarship,
  getCountryFlag,
  formatDeadline,
  calculateDaysLeft,
} from '@/lib/scholarships';

export default function PublicScholarshipDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [scholarship, setScholarship] = useState<PublicScholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'benefits' | 'application' | 'documents'>('overview');

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/scholarships/${slug}`);
        if (!res.ok) {
          throw new Error('Scholarship not found');
        }
        const json = await res.json();
        setScholarship(json.scholarship);
      } catch (err: any) {
        setError(err.message || 'Failed to load scholarship details');
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 pt-24">
          <Loader2 className="w-8 h-8 text-[#4b37df] animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading official scholarship dossier...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-24 px-4 text-center">
          <AlertCircle className="w-10 h-10 text-rose-500" />
          <h1 className="text-xl font-bold text-slate-900">Scholarship Not Found</h1>
          <p className="text-xs text-slate-500 max-w-sm">
            The scholarship record you requested might have been updated or archived.
          </p>
          <Link
            href="/scholarships"
            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xs"
          >
            Back to All Scholarships
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const s = scholarship;
  const deadlineStr = formatDeadline(s.activeCycle?.applicationDeadline);
  const daysLeft = calculateDaysLeft(s.activeCycle?.applicationDeadline);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back Link */}
          <div className="flex items-center gap-2 pt-2 text-xs">
            <Link
              href="/scholarships"
              className="text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Scholarships</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{s.title}</span>
          </div>

          {/* Scholarship Header Card with Cover Image */}
          <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
            {/* Cover Image Banner (Clean, no overlapping avatar or cut-off text) */}
            <div className="relative w-full h-48 sm:h-64 lg:h-72 overflow-hidden bg-slate-900">
              <img
                src={s.coverImageUrl?.trim() || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop'}
                alt={s.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-slate-950/15 to-transparent" />

              {/* Badges inside Cover Image */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                {s.destinationCountries && s.destinationCountries.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-semibold shadow-xs">
                    <span>{getCountryFlag(s.destinationCountries[0])}</span>
                    <span>{s.destinationCountries.join(', ')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-semibold shadow-xs">
                    <Globe2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Global Destination</span>
                  </span>
                )}

                {s.opportunityType && (
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#4b37df] text-xs font-semibold shadow-xs">
                    {s.opportunityType}
                  </span>
                )}

                {s.providerType && (
                  <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-700 text-xs font-medium shadow-xs">
                    {s.providerType}
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                {s.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Award className="w-3.5 h-3.5 text-amber-950" />
                    <span>Featured</span>
                  </span>
                )}
                {s.verificationStatus === 'VERIFIED' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Officially Verified</span>
                  </span>
                )}
              </div>
            </div>

            {/* Clean Content Area Below Cover Image */}
            <div className="p-6 sm:p-8 space-y-6">

            {/* Title, Provider & Action Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {s.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                    <Building className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{s.provider}</span>
                  </span>

                  {s.studyLocation && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">{s.studyLocation}</span>
                    </>
                  )}

                  {s.studyMode && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">{s.studyMode} Mode</span>
                    </>
                  )}

                  {s.officialWebsite && (
                    <>
                      <span className="text-slate-300">•</span>
                      <a
                        href={s.officialWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#4b37df] hover:underline font-medium"
                      >
                        <span>Official Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>

                {s.shortDescription && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {s.shortDescription}
                  </p>
                )}
              </div>

              {/* Quick Apply CTA */}
              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <a
                  href={s.primaryOfficialSource || s.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-500/15 cursor-pointer"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {s.applicationGuideUrl && (
                  <a
                    href={s.applicationGuideUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    <span>Application Guidelines</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* 4 Quick Highlight Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Funding Coverage
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#4b37df]" />
                  <span>{s.fundingClassification || 'Full Funding'}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tuition: {s.tuitionCoverage || 'Waived'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Monthly Stipend
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {s.monthlyStipend
                    ? `${s.stipendCurrency || ''} ${s.monthlyStipend.toLocaleString()}/mo`
                    : 'Included in Grant'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Frequency: {s.stipendFrequency || 'Monthly'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Destination & Level
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5 truncate">
                  <Globe2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{s.destinationCountries?.join(', ') || 'Global'}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {s.academicLevels?.slice(0, 2).join(', ') || 'All levels'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Application Deadline
                </div>
                <div className="text-base sm:text-lg font-bold text-rose-600 mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <span>{deadlineStr}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {daysLeft !== null && daysLeft > 0 ? `${daysLeft} days remaining` : 'Official Annual Intake'}
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Public Detail Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-medium">
            {[
              { id: 'overview', label: 'Overview & Scope' },
              { id: 'eligibility', label: 'Eligibility Requirements' },
              { id: 'benefits', label: 'Funding & Benefits' },
              { id: 'application', label: 'Application Steps & Route' },
              { id: 'documents', label: `Required Documents (${s.requiredDocuments?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#4b37df] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Programme Description</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                      {s.shortDescription}
                    </p>
                  </div>

                  {s.description && (
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Full Detailed Briefing
                      </h4>
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {s.description}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Eligible Fields of Study
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {s.fieldsOfStudy?.map((fld: string) => (
                        <span key={fld} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                          {fld}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ELIGIBILITY */}
              {activeTab === 'eligibility' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">Eligibility Criteria</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.nepaleseEligible === 'YES'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      Nepalese Applicants: {s.nepaleseEligible}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Academic Minimum
                      </span>
                      <div className="text-sm font-bold text-slate-900">
                        {s.minGpa ? `GPA ${s.minGpa} (${s.gpaScale || '4.0 scale'})` : 'No minimum GPA restriction'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {s.minPercentage ? `Or minimum ${s.minPercentage}% marks` : 'Degree completion verified'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Age Rules
                      </span>
                      <div className="text-sm font-bold text-slate-900">
                        {s.minAge || s.maxAge ? `${s.minAge || 17} to ${s.maxAge || 'Open'} years` : 'No Age Limit'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {s.studyDuration || 'Standard Degree Programme'}
                      </div>
                    </div>
                  </div>

                  {s.languageRequirements && (
                    <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
                      <h4 className="text-xs font-bold text-[#4b37df] uppercase tracking-wider">
                        Language Testing Standards
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">IELTS Academic</span>
                          <span className="font-semibold text-slate-900">{s.languageRequirements?.ieltsOverall ? `${s.languageRequirements.ieltsOverall} Minimum` : 'Optional'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">TOEFL iBT</span>
                          <span className="font-semibold text-slate-900">{s.languageRequirements?.toeflMin ? `${s.languageRequirements.toeflMin} Minimum` : 'Optional'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">PTE Academic</span>
                          <span className="font-semibold text-slate-900">{s.languageRequirements?.pteMin ? `${s.languageRequirements.pteMin} Minimum` : 'Optional'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">MOI Waiver</span>
                          <span className="font-semibold text-slate-900">{s.languageRequirements?.waiverAvailable || 'NO'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BENEFITS */}
              {activeTab === 'benefits' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Financial Coverage Schedule</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Full entitlements covered under this scholarship grant.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { title: 'Tuition Fees', coverage: s.tuitionCoverage, icon: GraduationCap },
                      { title: 'Monthly Living Stipend', coverage: s.monthlyStipend ? `${s.stipendCurrency || ''} ${s.monthlyStipend.toLocaleString()}/mo` : 'Covered', icon: DollarSign },
                      { title: 'Airfare & Travel Allowance', coverage: s.airfareCoverage || 'Covered', icon: Plane },
                      { title: 'Health & Medical Insurance', coverage: s.healthInsurance || 'Covered', icon: HeartPulse },
                      { title: 'Accommodation Housing', coverage: s.accommodationSupport || 'Covered', icon: Building },
                    ].map((b, idx) => {
                      const Icon = b.icon;
                      return (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#4b37df] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-900">{b.title}</span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                            {b.coverage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* APPLICATION */}
              {activeTab === 'application' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Application Route & Instructions</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Submit directly via the official authorized procedure.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                      Designated Official Route
                    </span>
                    <div className="text-sm font-bold text-slate-900">
                      {s.applicationRoute}
                    </div>
                    <p className="text-xs text-slate-600">
                      Method: <span className="font-semibold text-slate-800">{s.applicationMethod}</span>
                    </p>
                  </div>

                  {s.selectionProcedure && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Selection Procedure
                      </h4>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {s.selectionProcedure}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DOCUMENTS */}
              {activeTab === 'documents' && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Required Application Documents</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Check each item off as you prepare your application package.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {s.requiredDocuments?.map((doc: any, idx: number) => (
                      <div key={doc.id || idx} className="p-4 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${doc.mandatory ? 'text-[#4b37df]' : 'text-slate-400'}`} />
                            <span className="font-semibold text-xs sm:text-sm text-slate-900">{doc.name}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 uppercase tracking-wider ${
                            doc.mandatory ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {doc.mandatory ? 'Mandatory' : 'Optional'}
                          </span>
                        </div>
                        {doc.description && (
                          <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5 sticky top-28">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Official Gateway
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Intake Semester</span>
                    <span className="font-semibold text-slate-900">{s.activeCycle?.intakeYear || 2027} Intake</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Application Fee</span>
                    <span className="font-semibold text-emerald-600">Free ($0)</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Verification</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Government Audited</span>
                    </span>
                  </div>
                </div>

                <div>
                  <a
                    href={s.primaryOfficialSource || s.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Apply on Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  BidyaGo verified direct link.
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
