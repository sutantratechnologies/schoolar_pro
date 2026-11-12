'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Globe2,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';

interface ScholarshipItem {
  id: string;
  title: string;
  slug: string;
  provider: string;
  providerType: string;
  opportunityType: string;
  categories: string[];
  destinationCountries: string[];
  academicLevels: string[];
  fundingClassification: string;
  monthlyStipend?: number;
  stipendCurrency?: string;
  tuitionCoverage: string;
  publicationStatus: 'DRAFT' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'NEEDS_REVISION' | 'REJECTED';
  lastVerifiedDate?: string;
  primaryOfficialSource: string;
  completenessScore: number;
  missingFields: string[];
  cyclesCount: number;
  activeCycle?: {
    id: string;
    cycleName: string;
    applicationYear: number;
    intakeYear: number;
    applicationDeadline?: string;
    cycleStatus: string;
  } | null;
  verificationChecklist?: any;
  verificationHistory?: any[];
  cycles?: any[];
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [fundingFilter, setFundingFilter] = useState('ALL');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');

  // Modals state
  const [verifyTarget, setVerifyTarget] = useState<ScholarshipItem | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [verifyNotes, setVerifyNotes] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<'VERIFIED' | 'NEEDS_REVISION' | 'REJECTED'>('VERIFIED');
  const [verifySubmitting, setVerifySubmitting] = useState(false);

  // Cycle Modal state
  const [cycleTarget, setCycleTarget] = useState<ScholarshipItem | null>(null);
  const [newCycleName, setNewCycleName] = useState('');
  const [newCycleAppYear, setNewCycleAppYear] = useState(2027);
  const [newCycleIntakeYear, setNewCycleIntakeYear] = useState(2027);
  const [newCycleDeadline, setNewCycleDeadline] = useState('');
  const [newCycleStatus, setNewCycleStatus] = useState('OPEN');
  const [cycleSubmitting, setCycleSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ScholarshipItem | null>(null);
  const [deletePermanent, setDeletePermanent] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Fetch scholarships
  const loadScholarships = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/scholarships');
      if (res.ok) {
        const data = await res.json();
        setScholarships(data.scholarships || []);
      }
    } catch (err) {
      console.error('Failed to load scholarships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  // Filtered scholarships
  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = s.title?.toLowerCase().includes(q);
        const matchesProvider = s.provider?.toLowerCase().includes(q);
        const matchesCountry = s.destinationCountries?.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesProvider && !matchesCountry) return false;
      }
      if (statusFilter !== 'ALL' && s.publicationStatus !== statusFilter) return false;
      if (verificationFilter !== 'ALL' && s.verificationStatus !== verificationFilter) return false;
      if (fundingFilter !== 'ALL' && s.fundingClassification !== fundingFilter) return false;
      if (countryFilter !== 'ALL' && !s.destinationCountries?.includes(countryFilter)) return false;
      if (levelFilter !== 'ALL' && !s.academicLevels?.some((l) => l.includes(levelFilter))) return false;
      return true;
    });
  }, [scholarships, search, statusFilter, verificationFilter, fundingFilter, countryFilter, levelFilter]);

  // Overall metrics
  const metrics = useMemo(() => {
    const total = scholarships.length;
    const published = scholarships.filter((s) => s.publicationStatus === 'PUBLISHED').length;
    const pendingVerification = scholarships.filter((s) => s.verificationStatus === 'UNVERIFIED' || s.verificationStatus === 'NEEDS_REVISION').length;
    const activeCycles = scholarships.reduce((acc, s) => acc + (s.cyclesCount || 0), 0);
    const avgScore = total > 0
      ? Math.round(scholarships.reduce((acc, s) => acc + (s.completenessScore || 0), 0) / total)
      : 100;

    return { total, published, pendingVerification, activeCycles, avgScore };
  }, [scholarships]);

  // Quick Publish/Unpublish toggle
  const handleTogglePublish = async (s: ScholarshipItem) => {
    const nextStatus = s.publicationStatus === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';

    if (nextStatus === 'PUBLISHED' && s.verificationStatus !== 'VERIFIED') {
      alert('Publication Blocked: Only officially verified scholarships can be marked as Published. Verify the 8-point checklist first.');
      openVerifyModal(s);
      return;
    }

    try {
      const res = await fetch(`/api/admin/scholarships/${s.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        loadScholarships();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update publication status');
      }
    } catch {
      alert('Network error while toggling publication.');
    }
  };

  // Open Verify Modal
  const openVerifyModal = (s: ScholarshipItem) => {
    setVerifyTarget(s);
    setChecklist(s.verificationChecklist || {
      exists: true,
      nepaleseEligible: true,
      levelCorrect: true,
      fundingAccurate: true,
      deadlineConfirmed: true,
      routeConfirmed: true,
      documentsConfirmed: true,
      urlsWorking: true,
    });
    setVerifyNotes(s.lastVerifiedDate ? `Audited on ${new Date(s.lastVerifiedDate).toLocaleDateString()}` : '');
    setVerifyStatus('VERIFIED');
  };

  const handleSaveVerification = async () => {
    if (!verifyTarget) return;
    setVerifySubmitting(true);
    try {
      const res = await fetch(`/api/admin/scholarships/${verifyTarget.id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: verifyStatus,
          checklist,
          notes: verifyNotes,
        }),
      });
      if (res.ok) {
        setVerifyTarget(null);
        loadScholarships();
      } else {
        const err = await res.json();
        alert(err.message || 'Verification failed');
      }
    } catch {
      alert('Error updating verification');
    } finally {
      setVerifySubmitting(false);
    }
  };

  // Open Cycles Modal
  const openCycleModal = (s: ScholarshipItem) => {
    setCycleTarget(s);
    setNewCycleName(`${s.title.split(' ')[0]} 2028 Academic Intake`);
    setNewCycleAppYear(2028);
    setNewCycleIntakeYear(2028);
    setNewCycleDeadline('');
    setNewCycleStatus('UPCOMING');
  };

  const handleAddCycle = async () => {
    if (!cycleTarget) return;
    setCycleSubmitting(true);
    try {
      const res = await fetch(`/api/admin/scholarships/${cycleTarget.id}/cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cycleName: newCycleName,
          applicationYear: newCycleAppYear,
          intakeYear: newCycleIntakeYear,
          applicationDeadline: newCycleDeadline ? new Date(newCycleDeadline).toISOString() : null,
          cycleStatus: newCycleStatus,
        }),
      });
      if (res.ok) {
        setCycleTarget(null);
        loadScholarships();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to add cycle');
      }
    } catch {
      alert('Error adding cycle');
    } finally {
      setCycleSubmitting(false);
    }
  };

  // Delete / Archive
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      const res = await fetch(`/api/admin/scholarships/${deleteTarget.id}?permanent=${deletePermanent}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteTarget(null);
        loadScholarships();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete');
      }
    } catch {
      alert('Network error while deleting');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
            Scholarship Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified global scholarship programmes, yearly intake cycles, and eligibility rules for student matching.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={loadScholarships}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/dashboard/scholarships/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Scholarship</span>
          </Link>
        </div>
      </div>

      {/* 5 High-Impact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Programmes
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {metrics.total}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Building className="w-3 h-3 text-[#4b37df]" />
            <span>Government & University</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Published & Live
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight">
            {metrics.published}
          </div>
          <div className="text-[11px] text-slate-500">
            Visible on Student Portal
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Pending Verification
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight">
            {metrics.pendingVerification}
          </div>
          <div className="text-[11px] text-slate-500">
            Awaiting 8-point signoff
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Cycles
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#4b37df] tracking-tight">
            {metrics.activeCycles}
          </div>
          <div className="text-[11px] text-slate-500">
            2027 & 2028 intakes
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Data Quality Avg
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {metrics.avgScore}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${metrics.avgScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'All Programmes' },
            { id: 'PUBLISHED', label: 'Published' },
            { id: 'DRAFT', label: 'Draft' },
            { id: 'PENDING_VERIFICATION', label: 'Pending Verification' },
            { id: 'ARCHIVED', label: 'Archived' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inputs & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, provider, or country..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#4b37df]"
            />
          </div>

          <div>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:border-[#4b37df]"
            >
              <option value="ALL">Verification: All</option>
              <option value="VERIFIED">Officially Verified</option>
              <option value="UNVERIFIED">Unverified</option>
              <option value="NEEDS_REVISION">Needs Revision</option>
            </select>
          </div>

          <div>
            <select
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:border-[#4b37df]"
            >
              <option value="ALL">Funding: All</option>
              <option value="Fully funded">Fully funded</option>
              <option value="Partially funded">Partially funded</option>
              <option value="Tuition only">Tuition only</option>
            </select>
          </div>

          <div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:border-[#4b37df]"
            >
              <option value="ALL">Destination: All</option>
              <option value="Japan">Japan</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="South Korea">South Korea</option>
              <option value="Germany">Germany</option>
              <option value="United States">United States</option>
            </select>
          </div>

          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:border-[#4b37df]"
            >
              <option value="ALL">Level: All</option>
              <option value="Bachelor">Bachelor&apos;s</option>
              <option value="Master">Master&apos;s</option>
              <option value="PhD">PhD / Doctoral</option>
              <option value="Research">Research</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scholarships Master Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Programme & Provider</th>
                <th className="py-3.5 px-4">Destination & Level</th>
                <th className="py-3.5 px-4">Funding Schedule</th>
                <th className="py-3.5 px-4">Active Cycle & Deadline</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-center">Quality</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const deadlineStr = item.activeCycle?.applicationDeadline
                  ? new Date(item.activeCycle.applicationDeadline).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Announced Annually';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Programme & Provider */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm hover:text-[#4b37df] transition-colors line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.provider}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#4b37df] text-[10px] font-medium border border-purple-200">
                            {item.opportunityType || 'Degree-seeking'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                            {item.providerType}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Destination & Level */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-medium text-slate-900">
                          <Globe2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.destinationCountries?.join(', ') || 'Global'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.academicLevels?.slice(0, 2).join(', ')}
                          {item.academicLevels && item.academicLevels.length > 2 && ' +more'}
                        </div>
                      </div>
                    </td>

                    {/* Funding Schedule */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.fundingClassification === 'Fully funded'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {item.fundingClassification}
                        </span>
                        <div className="text-[11px] text-slate-600">
                          {item.monthlyStipend ? `${item.stipendCurrency || ''} ${item.monthlyStipend.toLocaleString()}/mo` : item.tuitionCoverage}
                        </div>
                      </div>
                    </td>

                    {/* Active Cycle & Deadline */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-rose-600 text-xs">
                          <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{deadlineStr}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openCycleModal(item)}
                            className="text-[#4b37df] hover:underline cursor-pointer font-medium"
                          >
                            {item.activeCycle?.cycleName || `${item.cyclesCount || 0} Cycles`}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.verificationStatus === 'VERIFIED' ? (
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </div>
                          {item.lastVerifiedDate && (
                            <div className="text-[10px] text-slate-400 pl-1">
                              {new Date(item.lastVerifiedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openVerifyModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Verify Checklist</span>
                        </button>
                      )}
                    </td>

                    {/* Quality Completeness Score */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-semibold text-xs text-slate-800">
                          {item.completenessScore}%
                        </span>
                        <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${
                              item.completenessScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.completenessScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Publication Status Toggle */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(item)}
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                          item.publicationStatus === 'PUBLISHED'
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : item.publicationStatus === 'VERIFIED'
                            ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                        }`}
                        title="Click to toggle publication"
                      >
                        {item.publicationStatus}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/scholarships/${item.id}/preview`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#4b37df] hover:bg-purple-50 transition-colors"
                          title="Preview Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/scholarships/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit Information"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openCycleModal(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#4b37df] hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Manage Cycles"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete or Archive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No scholarship programmes matched your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: VERIFICATION CHECKLIST (8-POINT AUDIT) */}
      {verifyTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#4b37df] uppercase tracking-wider">
                  Compliance & Quality Control
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  8-Point Official Verification Audit
                </h3>
                <p className="text-xs text-slate-500">
                  {verifyTarget.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVerifyTarget(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {[
                { key: 'exists', label: '1. Scholarship programme actually exists' },
                { key: 'nepaleseEligible', label: '2. Nepalese applicants eligibility confirmed' },
                { key: 'levelCorrect', label: '3. Academic degree levels match official guidelines' },
                { key: 'fundingAccurate', label: '4. Tuition & stipend amounts accurate' },
                { key: 'deadlineConfirmed', label: '5. Application deadline & intake period confirmed' },
                { key: 'routeConfirmed', label: '6. Application route (Embassy/Univ) confirmed' },
                { key: 'documentsConfirmed', label: '7. Required document list verified' },
                { key: 'urlsWorking', label: '8. Official URLs are live and tested' },
              ].map((item) => {
                const checked = Boolean(checklist[item.key]);
                return (
                  <label
                    key={item.key}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer text-xs transition-colors ${
                      checked
                        ? 'bg-purple-50/40 border-purple-200 font-medium text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                      className="w-4 h-4 rounded text-[#4b37df] focus:ring-[#4b37df]"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Notes & Status */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verification Decision Status
                </label>
                <select
                  value={verifyStatus}
                  onChange={(e: any) => setVerifyStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                >
                  <option value="VERIFIED">VERIFIED - Cleared for Public Publication</option>
                  <option value="NEEDS_REVISION">NEEDS_REVISION - Insufficient Evidence</option>
                  <option value="REJECTED">REJECTED - Inaccurate Information</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Auditor Audit Notes
                </label>
                <textarea
                  rows={2}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="Record verification methodology, official bulletin number, or contact evidence..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setVerifyTarget(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveVerification}
                disabled={verifySubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] disabled:bg-slate-300 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{verifySubmitting ? 'Saving...' : 'Commit Verification'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CYCLES MANAGEMENT & ADD 2028 CYCLE */}
      {cycleTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#4b37df] uppercase tracking-wider">
                  Intake Timeline Preservation
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Manage Scholarship Application Cycles
                </h3>
                <p className="text-xs text-slate-500">
                  {cycleTarget.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCycleTarget(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing Cycles List */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Existing Historical & Active Cycles
              </div>
              <div className="space-y-2">
                {cycleTarget.cycles && cycleTarget.cycles.length > 0 ? (
                  cycleTarget.cycles.map((c: any) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{c.cycleName}</div>
                        <div className="text-slate-500 text-[11px]">
                          Intake: {c.intakeSemester} {c.intakeYear} | Deadline:{' '}
                          {c.applicationDeadline ? new Date(c.applicationDeadline).toLocaleDateString() : 'TBD'}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-[#4b37df] border border-purple-200">
                        {c.cycleStatus}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No existing cycle registered.</p>
                )}
              </div>
            </div>

            {/* Add New Cycle Form */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">Add Next Application Cycle</div>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cycle Title</label>
                  <input
                    type="text"
                    value={newCycleName}
                    onChange={(e) => setNewCycleName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Application Year</label>
                    <input
                      type="number"
                      value={newCycleAppYear}
                      onChange={(e) => setNewCycleAppYear(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Intake Year</label>
                    <input
                      type="number"
                      value={newCycleIntakeYear}
                      onChange={(e) => setNewCycleIntakeYear(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Application Deadline</label>
                    <input
                      type="date"
                      value={newCycleDeadline}
                      onChange={(e) => setNewCycleDeadline(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cycle Status</label>
                    <select
                      value={newCycleStatus}
                      onChange={(e) => setNewCycleStatus(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSING_SOON">CLOSING_SOON</option>
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCycleTarget(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleAddCycle}
                disabled={cycleSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-slate-900 hover:bg-[#4b37df] disabled:bg-slate-300 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{cycleSubmitting ? 'Registering...' : 'Add Cycle'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE / ARCHIVE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">
                Remove Scholarship Programme
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{deleteTarget.title}</strong>?
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deletePermanent}
                  onChange={(e) => setDeletePermanent(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600"
                />
                <span>
                  <strong>Delete permanently from database</strong> (If unchecked, this scholarship will be safely archived without losing historical application records).
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteSubmitting}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                {deleteSubmitting ? 'Processing...' : deletePermanent ? 'Delete Permanently' : 'Archive Programme'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
