'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
  Edit,
  AlertCircle,
  Loader2,
  Award,
} from 'lucide-react';

export default function ScholarshipPreviewPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [loading, setLoading] = useState(true);
  const [scholarship, setScholarship] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'benefits' | 'application' | 'documents' | 'sources'>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/scholarships/${id}`);
        if (!res.ok) throw new Error('Scholarship not found');
        const json = await res.json();
        setScholarship(json.scholarship);
      } catch (err: any) {
        setError(err.message || 'Failed to load preview');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#4b37df] animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Generating Public Preview...</span>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-base font-semibold text-slate-900">Unable to preview scholarship</h2>
        <p className="text-xs text-slate-500">{error || 'Scholarship does not exist.'}</p>
        <Link
          href="/dashboard/scholarships"
          className="inline-block px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-medium"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const s = scholarship;
  const activeCycle = s.cycles?.find((c: any) => c.cycleStatus === 'OPEN' || c.cycleStatus === 'CLOSING_SOON') || s.cycles?.[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Top Admin Preview Banner */}
      <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/scholarships"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <span className="font-semibold text-purple-300 uppercase tracking-wider text-[11px]">
            Admin Public View Simulation
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            Previewing exact student portal representation
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
            s.publicationStatus === 'PUBLISHED'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            Status: {s.publicationStatus}
          </span>
          <Link
            href={`/dashboard/scholarships/${s.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white font-medium text-xs transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Information</span>
          </Link>
        </div>
      </div>

      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs">
        {/* Cover Photo */}
        <div className="h-48 sm:h-64 w-full bg-linear-to-r from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden">
          {s.coverImageUrl && (
            <img
              src={s.coverImageUrl}
              alt={s.title}
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {s.isFeatured && (
              <span className="px-3 py-1 rounded-full bg-amber-400/90 backdrop-blur-xs text-slate-900 text-xs font-semibold flex items-center gap-1 shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-900" />
                <span>Featured Scholarship</span>
              </span>
            )}
            {s.verificationStatus === 'VERIFIED' && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Officially Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Hero Title & Provider Bar */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-start gap-4">
            {s.logoUrl ? (
              <img
                src={s.logoUrl}
                alt={s.provider}
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover bg-white shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-[#4b37df] text-white flex items-center justify-center font-bold text-xl shrink-0">
                {s.title.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold text-[#4b37df] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {s.opportunityType || 'Degree-seeking scholarship'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {s.providerType}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                {s.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{s.provider}</span>
              </p>
            </div>
          </div>

          {/* Quick Apply Button */}
          <div className="shrink-0 flex items-center gap-3">
            <a
              href={s.primaryOfficialSource || s.officialWebsite}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-purple-500/20"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Quick Highlight Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-slate-100 bg-slate-50/50 divide-x divide-y sm:divide-y-0 divide-slate-100">
          <div className="p-4 sm:p-5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Funding Coverage
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#4b37df]" />
              <span>{s.fundingClassification}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Tuition: {s.tuitionCoverage}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Monthly Stipend
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {s.monthlyStipend ? `${s.stipendCurrency || ''} ${s.monthlyStipend.toLocaleString()}/mo` : 'Covered in Full'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Paid {s.stipendFrequency?.toLowerCase() || 'monthly'}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Destination & Level
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center gap-1 truncate">
              <Globe2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{s.destinationCountries?.join(', ')}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">
              {s.academicLevels?.slice(0, 2).join(', ')}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Application Deadline
            </div>
            <div className="text-base sm:text-lg font-bold text-rose-600 mt-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>
                {activeCycle?.applicationDeadline
                  ? new Date(activeCycle.applicationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Announced Annually'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Cycle: {activeCycle?.cycleName || 'Current Cycle'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Public Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-medium">
        {[
          { id: 'overview', label: 'Overview & Scope' },
          { id: 'eligibility', label: 'Eligibility Requirements' },
          { id: 'benefits', label: 'Funding & Benefits' },
          { id: 'application', label: 'Application Steps & Route' },
          { id: 'documents', label: `Required Documents (${s.requiredDocuments?.length || 0})` },
          { id: 'sources', label: 'Official Verification & Sources' },
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

      {/* TAB CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tab Content Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB: OVERVIEW */}
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
                    Full In-Depth Briefing
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                    {s.description}
                  </div>
                </div>
              )}

              {/* Study Scope Chips */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Approved Fields of Study & Subjects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {s.fieldsOfStudy?.map((fld: string) => (
                    <span
                      key={fld}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {fld}
                    </span>
                  ))}
                  {s.specificSubjects?.map((sub: string) => (
                    <span
                      key={sub}
                      className="px-3 py-1 rounded-full bg-purple-50 text-[#4b37df] text-xs font-medium border border-purple-200"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ELIGIBILITY */}
          {activeTab === 'eligibility' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Applicant Eligibility Criteria</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  s.nepaleseEligible === 'YES'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  Nepalese Applicants: {s.nepaleseEligible}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Academic Minimum
                  </span>
                  <div className="text-sm font-bold text-slate-900">
                    {s.minGpa ? `GPA ${s.minGpa} on ${s.gpaScale || '4.0 scale'}` : 'Not Specified'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {s.minPercentage ? `Or minimum ${s.minPercentage}% score` : 'Verified graduation record'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Age Restrictions
                  </span>
                  <div className="text-sm font-bold text-slate-900">
                    {s.minAge || s.maxAge ? `${s.minAge || 17} to ${s.maxAge || 'No Upper Limit'} years` : 'No Age Limit'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {s.ageCalculationDate || 'At time of intake departure'}
                  </div>
                </div>
              </div>

              {/* Language requirements */}
              <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-3">
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

              {s.requiredQualification && (
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-700">Required Previous Degree:</span>
                  <p className="text-slate-600">{s.requiredQualification}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Financial Coverage & Allowances</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Itemized schedule of scholarships benefits and entitlements.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'University Tuition & Fees', state: s.tuitionCoverage, icon: GraduationCap, note: '100% waiver or covered by sponsor' },
                  { title: 'Monthly Living Stipend', state: `${s.stipendCurrency || ''} ${s.monthlyStipend?.toLocaleString() || 'Full Allowance'}`, icon: DollarSign, note: s.stipendFrequency },
                  { title: 'International Airfare', state: s.airfareCoverage, icon: Plane, note: 'Economy roundtrip flight' },
                  { title: 'Comprehensive Health Insurance', state: s.healthInsurance, icon: HeartPulse, note: 'Covers medical, hospital, and accidents' },
                  { title: 'Accommodation Housing', state: s.accommodationSupport, icon: Building, note: 'Dormitory subsidy or cash living grant' },
                ].map((b, idx) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#4b37df] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-900">{b.title}</div>
                          <div className="text-[11px] text-slate-400">{b.note}</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold shrink-0">
                        {b.state}
                      </span>
                    </div>
                  );
                })}
              </div>

              {s.benefitsDescription && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {s.benefitsDescription}
                </div>
              )}
            </div>
          )}

          {/* TAB: APPLICATION */}
          {activeTab === 'application' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <h3 className="text-base font-semibold text-slate-900">How to Apply & Selection Stages</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Follow this verified official route to ensure your application is recognized.
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
                  Submission format: <span className="font-semibold text-slate-800">{s.applicationMethod}</span>
                </p>
              </div>

              {s.selectionProcedure && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Selection & Interview Procedure
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {s.selectionProcedure}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Required Application Dossier</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Prepare and authenticate every listed document before the deadline.
                </p>
              </div>

              <div className="space-y-3">
                {s.requiredDocuments?.map((doc: any, idx: number) => (
                  <div
                    key={doc.id || idx}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${doc.mandatory ? 'text-[#4b37df]' : 'text-slate-400'}`} />
                        <span className="font-semibold text-xs sm:text-sm text-slate-900">{doc.name}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 uppercase tracking-wider ${
                        doc.mandatory
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {doc.mandatory ? 'Mandatory' : 'Optional'}
                      </span>
                    </div>

                    {doc.description && (
                      <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                        {doc.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pl-6 pt-1 text-[11px] text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">Type: {doc.originalOrCopy}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">Translation: {doc.translationRequired}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">Attestation: {doc.attestationRequired}</span>
                      {doc.condition && <span className="bg-purple-50 text-[#4b37df] px-2 py-0.5 rounded-md">Applies to: {doc.condition}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SOURCES */}
          {activeTab === 'sources' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Official Authoritative Evidence</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Cross-checked data sources and audit verification trail.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Primary Source Link
                </span>
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={s.primaryOfficialSource}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm font-semibold text-[#4b37df] hover:underline flex items-center gap-1.5 truncate"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{s.primaryOfficialSource}</span>
                  </a>
                  <span className="text-xs text-slate-400 shrink-0">{s.sourceType}</span>
                </div>
              </div>

              {s.verificationNotes && (
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-700">Auditor Notes:</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {s.verificationNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Key Highlights Box */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Application Snapshot
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Academic Intake</span>
                <span className="font-semibold text-slate-900">{activeCycle?.intakeSemester} {activeCycle?.intakeYear}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Study Mode</span>
                <span className="font-semibold text-slate-900">{s.studyMode}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Duration</span>
                <span className="font-semibold text-slate-900">{s.studyDuration || 'Standard Degree'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Application Fee</span>
                <span className="font-semibold text-emerald-600">
                  {s.applicationFee ? `${s.applicationFeeCurrency} ${s.applicationFee}` : 'Free of Charge ($0)'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={s.primaryOfficialSource || s.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Verified by BidyaGo Academic Compliance Desk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
