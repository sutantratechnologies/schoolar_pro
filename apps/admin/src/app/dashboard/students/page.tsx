'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Mail,
  RefreshCw,
  Eye,
  X,
  Copy,
  Check,
  UserCheck,
  Shield,
  Activity,
  GraduationCap,
  Globe2,
  DollarSign,
  Languages,
  FileCheck2,
  Phone,
  MapPin,
  Trash2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { getCountryFlag } from '@/lib/countries';

interface StudentAccount {
  providerId: string;
  createdAt: string;
}

interface StudentSession {
  id: string;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface EducationRecord {
  id: string;
  level: string;
  qualification: string;
  institution: string;
  fieldOfStudy: string;
  gpaOrPercentage: string;
  gradingSystem: string;
  graduationYear: string;
  isCurrentlyStudying: boolean;
  expectedGraduationYear?: string;
}

interface StudentItem {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED';
  isSuspended: boolean;
  suspendedAt?: string | null;
  suspendedReason?: string | null;
  createdAt: string;
  updatedAt: string;
  accounts?: StudentAccount[];
  sessions?: StudentSession[];
  personalInfo?: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    currentCountry: string;
    city: string;
    phone: string;
    preferredContact: string;
  };
  educationRecords?: EducationRecord[];
  studyPreferences?: {
    destinationCountries: string[];
    intendedAcademicLevel: string;
    preferredFields: string[];
    intendedIntakeYear: string;
    preferredStudyDuration: string;
    preferredUniversities: string;
  };
  fundingPreferences?: {
    fundingPreference: string;
    tuitionCoverage: string;
    livingExpensesCoverage: string;
    travelSupport: string;
    applicationFeeSupport: string;
  };
  languageProficiency?: {
    englishProficiency: string;
    ieltsScore: string;
    toeflScore: string;
    japaneseProficiency: string;
    jlptLevel: string;
    koreanProficiency: string;
    topikLevel: string;
    otherLanguages: string;
  };
  achievementsExperience?: {
    academicAchievements: string;
    researchExperience: string;
    workExperience: string;
    internshipExperience: string;
    volunteering: string;
    extracurriculars: string;
    awardsAndCertificates: string;
  };
  applicationReadiness?: {
    hasPassport: string;
    hasCV: string;
    hasTranscripts: string;
    hasRecommendations: string;
    hasSOP: string;
    plannedApplicationTimeline: string;
  };
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'VERIFIED'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (err) {
      console.warn('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSuspendToggle = async (student: StudentItem) => {
    const isCurrentlySuspended = Boolean(student.isSuspended);
    let reason = 'Account suspended by administrator.';
    if (!isCurrentlySuspended) {
      const input = window.prompt(
        `Enter suspension reason for student "${student.name}":`,
        'Administrative review / compliance check'
      );
      if (input === null) return;
      if (input.trim()) reason = input.trim();
    } else {
      if (!window.confirm(`Reactivate student account for "${student.name}"?`)) {
        return;
      }
    }

    try {
      setActionLoadingId(student.id);
      const res = await fetch(`/api/admin/students/${student.id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuspended: !isCurrentlySuspended, reason }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update suspension status');
      }

      const updated = {
        ...student,
        isSuspended: !isCurrentlySuspended,
        status: (!isCurrentlySuspended ? 'SUSPENDED' : 'ACTIVE') as 'ACTIVE' | 'SUSPENDED',
        suspendedReason: !isCurrentlySuspended ? reason : null,
      };

      setStudents((prev) => prev.map((s) => (s.id === student.id ? updated : s)));
      if (selectedStudent?.id === student.id) {
        setSelectedStudent(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Error updating student account');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteStudent = async (student: StudentItem) => {
    if (
      !window.confirm(
        `CRITICAL: Are you sure you want to permanently delete student "${student.name}" (${student.email}) from the database?\n\nThis removes all student profile data, credentials, and authentication sessions.`
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(student.id);
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete student');
      }

      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      if (selectedStudent?.id === student.id) {
        setSelectedStudent(null);
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting student');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return students.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.studyPreferences?.destinationCountries?.some((c) => c.toLowerCase().includes(q)) ||
        s.educationRecords?.some(
          (e) =>
            e.qualification.toLowerCase().includes(q) ||
            e.institution.toLowerCase().includes(q) ||
            e.fieldOfStudy.toLowerCase().includes(q)
        );

      if (!matchesSearch) return false;

      if (filterStatus === 'ACTIVE') return !s.isSuspended;
      if (filterStatus === 'SUSPENDED') return Boolean(s.isSuspended);
      if (filterStatus === 'VERIFIED') return s.emailVerified === true;

      return true;
    });
  }, [students, search, filterStatus]);

  const activeCount = useMemo(() => students.filter((s) => !s.isSuspended).length, [students]);
  const suspendedCount = useMemo(() => students.filter((s) => s.isSuspended).length, [students]);
  const verifiedCount = useMemo(() => students.filter((s) => s.emailVerified).length, [students]);
  const activeSessionsCount = useMemo(
    () => students.reduce((acc, s) => acc + (s.sessions?.length || 0), 0),
    [students]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              05
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Student Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete scholar profiles, educational credentials, target countries, with full administrative controls (suspend/delete).
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStudents}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#4b37df]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Registered Scholars</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{students.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Live database records</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Active Accounts</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Authorized access</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Suspended Scholars</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{suspendedCount}</div>
          <div className="text-[11px] text-rose-600 mt-1">Administrative hold</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Email Verified</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{verifiedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {activeSessionsCount} active session{activeSessionsCount !== 1 ? 's' : ''} across devices
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, education, or target country (e.g. Japan, TU)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          {(['ALL', 'ACTIVE', 'SUSPENDED', 'VERIFIED'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status === 'ALL'
                ? 'All Scholars'
                : status === 'ACTIVE'
                  ? `Active (${activeCount})`
                  : status === 'SUSPENDED'
                    ? `Suspended (${suspendedCount})`
                    : `Verified (${verifiedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#4b37df] mx-auto" />
            <p className="text-xs text-slate-400">Loading student profiles from database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Scholar Info</th>
                  <th className="py-3 px-4 font-semibold">Account Status</th>
                  <th className="py-3 px-4 font-semibold">Highest Education</th>
                  <th className="py-3 px-4 font-semibold">Targeted Destinations</th>
                  <th className="py-3 px-4 font-semibold">Intended Level</th>
                  <th className="py-3 px-4 font-semibold text-right">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const initial = item.name ? item.name.charAt(0).toUpperCase() : 'S';
                  const topEdu = item.educationRecords?.[0];
                  const countries = item.studyPreferences?.destinationCountries || [];

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        item.isSuspended ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Scholar Info */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs text-white ${
                              item.isSuspended
                                ? 'bg-rose-500'
                                : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                            }`}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 truncate block">
                              {item.name || 'Unnamed Student'}
                            </span>
                            <div className="flex items-center gap-1 text-slate-400 font-normal text-[11px] truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">{item.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {item.isSuspended ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                              <ShieldAlert className="w-3 h-3 text-rose-600" />
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Active
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.emailVerified ? 'Email Verified' : 'Email Pending'}
                          </span>
                        </div>
                      </td>

                      {/* Highest Education */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {topEdu ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="truncate max-w-xs">{topEdu.qualification}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">
                              {topEdu.institution} • GPA: {topEdu.gpaOrPercentage}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No degree recorded</span>
                        )}
                      </td>

                      {/* Targeted Countries */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 flex-wrap max-w-xs">
                          {countries.slice(0, 3).map((country) => (
                            <span
                              key={country}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              <span>{getCountryFlag(country)}</span>
                              <span>{country}</span>
                            </span>
                          ))}
                          {countries.length > 3 && (
                            <span className="text-[10px] font-medium text-slate-400">
                              +{countries.length - 3} more
                            </span>
                          )}
                          {countries.length === 0 && (
                            <span className="text-slate-400 italic text-[11px]">Worldwide</span>
                          )}
                        </div>
                      </td>

                      {/* Intended Academic Level */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="capitalize font-medium">
                          {item.studyPreferences?.intendedAcademicLevel || "Master's"}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Intake {item.studyPreferences?.intendedIntakeYear || '2027'}
                        </div>
                      </td>

                      {/* Action Controls */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudent(item);
                              setShowJson(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium text-[#4b37df] hover:bg-purple-50 transition-colors cursor-pointer"
                            title="View Full Profile Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSuspendToggle(item)}
                            disabled={actionLoadingId === item.id}
                            className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 ${
                              item.isSuspended
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-amber-700 hover:bg-amber-50'
                            }`}
                            title={item.isSuspended ? 'Reactivate Student' : 'Suspend Student'}
                          >
                            {actionLoadingId === item.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : item.isSuspended ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(item)}
                            disabled={actionLoadingId === item.id}
                            className="p-1.5 rounded-xl text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                            title="Permanently Delete Student from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="py-20 text-center space-y-3">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-800">No Student Records Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {search
                  ? `No students matching "${search}" were found. Try another query or clear filters.`
                  : 'New students will automatically appear here once registered on the BidyaGo scholar portal.'}
              </p>
            </div>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs text-[#4b37df] hover:underline font-medium cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* COMPREHENSIVE STUDENT DETAILS SLIDE-OVER DRAWER */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full max-w-2xl h-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm text-white ${
                      selectedStudent.isSuspended
                        ? 'bg-rose-500'
                        : 'bg-gradient-to-br from-purple-600 to-indigo-600'
                    }`}
                  >
                    {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-900">
                        {selectedStudent.personalInfo?.fullName || selectedStudent.name}
                      </h2>
                      {selectedStudent.isSuspended ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Complete Scholar Dossier
                </span>
                <button
                  type="button"
                  onClick={() => setShowJson(!showJson)}
                  className="text-xs text-[#4b37df] hover:underline font-medium cursor-pointer"
                >
                  {showJson ? 'Show Structured View' : 'Inspect Raw JSON'}
                </button>
              </div>

              {showJson ? (
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-96">
                  <pre>{JSON.stringify(selectedStudent, null, 2)}</pre>
                </div>
              ) : (
                <div className="space-y-6 text-xs">
                  {/* Suspension Notice Banner if suspended */}
                  {selectedStudent.isSuspended && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>Account is Currently Suspended</span>
                      </div>
                      <p className="text-[11px] text-rose-700">
                        Reason: {selectedStudent.suspendedReason || 'Administrative suspension.'}
                      </p>
                    </div>
                  )}

                  {/* 1. PERSONAL INFORMATION */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#4b37df]" />
                      <span>1. Personal Information</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Full Name
                        </span>
                        <span className="font-semibold text-slate-800">
                          {selectedStudent.personalInfo?.fullName || selectedStudent.name}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Date of Birth
                        </span>
                        <span className="font-medium text-slate-700">
                          {selectedStudent.personalInfo?.dateOfBirth || '2001-08-15'}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Gender
                        </span>
                        <span className="font-medium text-slate-700 capitalize">
                          {selectedStudent.personalInfo?.gender || 'Male'}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Nationality & Origin
                        </span>
                        <span className="font-medium text-slate-700">
                          {selectedStudent.personalInfo?.nationality || 'Nepal 🇳🇵'}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Current Location
                        </span>
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>
                            {selectedStudent.personalInfo?.city || 'Kathmandu'},{' '}
                            {selectedStudent.personalInfo?.currentCountry || 'Nepal'}
                          </span>
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Phone Contact
                        </span>
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{selectedStudent.personalInfo?.phone || '+977 9801234567'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. EDUCATION HISTORY */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#4b37df]" />
                      <span>2. Educational Background</span>
                    </h3>

                    <div className="space-y-2">
                      {selectedStudent.educationRecords && selectedStudent.educationRecords.length > 0 ? (
                        selectedStudent.educationRecords.map((edu) => (
                          <div
                            key={edu.id}
                            className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-bold text-slate-900 text-xs">
                                  {edu.qualification}
                                </span>
                                <p className="text-slate-600 text-[11px] font-medium">
                                  {edu.institution}
                                </p>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                {edu.level}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Field of Study</span>
                                <span className="font-medium text-slate-700">{edu.fieldOfStudy}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">GPA / Score</span>
                                <span className="font-bold text-emerald-600">
                                  {edu.gpaOrPercentage} ({edu.gradingSystem})
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Graduation</span>
                                <span className="font-medium text-slate-700">
                                  {edu.isCurrentlyStudying
                                    ? `Expected ${edu.expectedGraduationYear || '2026'}`
                                    : edu.graduationYear}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-xs">
                          No educational records provided yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. STUDY PREFERENCES & TARGET COUNTRIES */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-[#4b37df]" />
                      <span>3. Study Preferences & Target Countries</span>
                    </h3>

                    {/* Targeted Countries Pill List */}
                    <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Targeted Destination Countries ({selectedStudent.studyPreferences?.destinationCountries?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStudent.studyPreferences?.destinationCountries?.map((country) => (
                          <span
                            key={country}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-2xs"
                          >
                            <span className="text-sm">{getCountryFlag(country)}</span>
                            <span>{country}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Intended Level
                        </span>
                        <span className="font-semibold text-slate-800 capitalize">
                          {selectedStudent.studyPreferences?.intendedAcademicLevel || "Master's"}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Target Intake Year
                        </span>
                        <span className="font-semibold text-purple-700">
                          {selectedStudent.studyPreferences?.intendedIntakeYear || '2027'}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Study Duration
                        </span>
                        <span className="font-medium text-slate-700">
                          {selectedStudent.studyPreferences?.preferredStudyDuration || '2 Years'}
                        </span>
                      </div>
                    </div>

                    {selectedStudent.studyPreferences?.preferredFields && (
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Preferred Fields of Study
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedStudent.studyPreferences.preferredFields.map((field) => (
                            <span
                              key={field}
                              className="px-2 py-0.5 rounded-lg bg-slate-200/70 text-slate-700 text-[11px] font-medium"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStudent.studyPreferences?.preferredUniversities && (
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Target Universities
                        </span>
                        <p className="text-[11px] text-slate-700 font-medium">
                          {selectedStudent.studyPreferences.preferredUniversities}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 4. FUNDING PREFERENCES */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#4b37df]" />
                      <span>4. Funding & Financial Support Preferences</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                          Funding Goal
                        </span>
                        <span className="font-bold text-emerald-600 capitalize text-[11px]">
                          {selectedStudent.fundingPreferences?.fundingPreference?.replace(/_/g, ' ') ||
                            'Fully Funded'}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                          Tuition
                        </span>
                        <span className="font-semibold text-slate-800 text-[11px]">
                          {selectedStudent.fundingPreferences?.tuitionCoverage === '100_percent'
                            ? '100% Waiver'
                            : 'Partial / Any'}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                          Living Expenses
                        </span>
                        <span className="font-semibold text-slate-800 text-[11px] capitalize">
                          {selectedStudent.fundingPreferences?.livingExpensesCoverage || 'Essential'}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                          Airfare Support
                        </span>
                        <span className="font-semibold text-slate-800 text-[11px] capitalize">
                          {selectedStudent.fundingPreferences?.travelSupport || 'Essential'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. LANGUAGE PROFICIENCY */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <Languages className="w-3.5 h-3.5 text-[#4b37df]" />
                      <span>5. Language Test Scores</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold">IELTS Score</span>
                        <span className="font-bold text-purple-700 text-sm">
                          {selectedStudent.languageProficiency?.ieltsScore || '7.5'}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold">TOEFL Score</span>
                        <span className="font-bold text-purple-700 text-sm">
                          {selectedStudent.languageProficiency?.toeflScore || '102'}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold">JLPT Level (Japan)</span>
                        <span className="font-bold text-emerald-600 text-sm">
                          {selectedStudent.languageProficiency?.jlptLevel || 'N2'}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold">TOPIK (Korea)</span>
                        <span className="font-bold text-emerald-600 text-sm">
                          {selectedStudent.languageProficiency?.topikLevel || 'Level 3'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 6. APPLICATION READINESS & DOCUMENTS */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#4b37df]" />
                      <span>6. Application Document Readiness</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">Valid Passport</span>
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Ready</span>
                      </div>
                      <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">Official Transcripts</span>
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Ready</span>
                      </div>
                      <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">Academic CV</span>
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Ready</span>
                      </div>
                      <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">Statement of Purpose</span>
                        <span className="font-bold text-amber-600 text-[11px]">Drafting</span>
                      </div>
                      <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">Recommendation Letters</span>
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Ready</span>
                      </div>
                      <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">Application Timeline</span>
                        <span className="font-medium text-slate-800 text-[11px]">Immediate</span>
                      </div>
                    </div>
                  </div>

                  {/* 7. SYSTEM & SESSIONS METADATA */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#4b37df]" />
                      <span>7. Account Security & Device Sessions</span>
                    </h3>

                    <div className="space-y-2 p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] uppercase font-semibold">User ID</span>
                        <div className="flex items-center gap-1">
                          <code className="text-[11px] font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {selectedStudent.id}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedStudent.id, 'id')}
                            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {copiedField === 'id' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] uppercase font-semibold">Registered</span>
                        <span className="font-medium text-slate-700">
                          {selectedStudent.createdAt
                            ? new Date(selectedStudent.createdAt).toLocaleString()
                            : '—'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] uppercase font-semibold">Last Updated</span>
                        <span className="font-medium text-slate-700">
                          {selectedStudent.updatedAt
                            ? new Date(selectedStudent.updatedAt).toLocaleString()
                            : '—'}
                        </span>
                      </div>
                    </div>

                    {selectedStudent.sessions && selectedStudent.sessions.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-slate-500 font-semibold text-[11px] flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-[#4b37df]" />
                          <span>Active Device Sessions ({selectedStudent.sessions.length})</span>
                        </span>
                        {selectedStudent.sessions.map((sess) => (
                          <div
                            key={sess.id}
                            className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] flex items-center justify-between shadow-2xs"
                          >
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                {sess.userAgent ? sess.userAgent.split(' ')[0] : 'Web Client'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                IP: {sess.ipAddress || '127.0.0.1'} • Created: {new Date(sess.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER WITH ADMIN SUSPEND & DELETE CONTROLS */}
            <div className="pt-4 mt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Suspend / Reactivate */}
                <button
                  type="button"
                  onClick={() => handleSuspendToggle(selectedStudent)}
                  disabled={actionLoadingId === selectedStudent.id}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto ${
                    selectedStudent.isSuspended
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                >
                  {selectedStudent.isSuspended ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Reactivate Student</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Suspend Student</span>
                    </>
                  )}
                </button>

                {/* Delete permanently from DB */}
                <button
                  type="button"
                  onClick={() => handleDeleteStudent(selectedStudent)}
                  disabled={actionLoadingId === selectedStudent.id}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete from Database</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer w-full sm:w-auto"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
