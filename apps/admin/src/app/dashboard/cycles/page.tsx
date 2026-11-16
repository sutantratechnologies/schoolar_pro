'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarRange,
  Plus,
  RefreshCw,
  Building,
  Trash2,
} from 'lucide-react';

interface ExtractedCycle {
  id: string;
  name: string;
  scholarshipTitle: string;
  scholarshipId: string;
  intakeTerm: string;
  year: number;
  openDate: string;
  deadlineDate: string;
  status: 'OPEN' | 'UPCOMING' | 'REVIEWING' | 'CLOSED';
}

export default function ScholarshipCyclesPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTerm, setFilterTerm] = useState('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteCycle = async (cycle: ExtractedCycle) => {
    if (!window.confirm(`Are you sure you want to delete the cycle "${cycle.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(cycle.id);
      const res = await fetch(`/api/admin/scholarships/${cycle.scholarshipId}/cycles/${cycle.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete cycle');
      }

      // Update scholarships in state
      setScholarships((prev) =>
        prev.map((s) => {
          if (s.id === cycle.scholarshipId) {
            return {
              ...s,
              cycles: Array.isArray(s.cycles) ? s.cycles.filter((c: any) => c.id !== cycle.id) : [],
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      alert(err.message || 'Error deleting cycle');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/scholarships');
        if (res.ok) {
          const data = await res.json();
          setScholarships(data.scholarships || []);
        }
      } catch (err) {
        console.warn('Failed to load cycles', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Extract all cycles across all real scholarships
  const cycles: ExtractedCycle[] = useMemo(() => {
    const list: ExtractedCycle[] = [];
    scholarships.forEach((s) => {
      if (Array.isArray(s.cycles)) {
        s.cycles.forEach((c: any) => {
          list.push({
            id: c.id,
            name: c.cycleName || `${s.title} Intake`,
            scholarshipTitle: s.title,
            scholarshipId: s.id,
            intakeTerm: c.intakeSemester || 'Annual',
            year: c.intakeYear || c.applicationYear || 2027,
            openDate: c.cycleOpeningDate
              ? new Date(c.cycleOpeningDate).toLocaleDateString()
              : 'Open',
            deadlineDate: c.applicationDeadline
              ? new Date(c.applicationDeadline).toLocaleDateString()
              : 'Rolling',
            status: (c.cycleStatus as any) || 'OPEN',
          });
        });
      } else if (s.activeCycle) {
        list.push({
          id: s.activeCycle.id,
          name: s.activeCycle.cycleName || `${s.title} Intake`,
          scholarshipTitle: s.title,
          scholarshipId: s.id,
          intakeTerm: 'Annual',
          year: s.activeCycle.intakeYear || s.activeCycle.applicationYear || 2027,
          openDate: 'Active',
          deadlineDate: s.activeCycle.applicationDeadline
            ? new Date(s.activeCycle.applicationDeadline).toLocaleDateString()
            : 'Announced Annually',
          status: (s.activeCycle.cycleStatus as any) || 'OPEN',
        });
      }
    });
    return list;
  }, [scholarships]);

  const filteredCycles = useMemo(() => {
    return cycles.filter(
      (c) => filterTerm === 'ALL' || c.status === filterTerm
    );
  }, [cycles, filterTerm]);

  const activeCount = cycles.filter((c) => c.status === 'OPEN').length;
  const upcomingCount = cycles.filter((c) => c.status === 'UPCOMING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              03
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Scholarship Cycles
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Application intake windows, deadlines, and intake years tracked from registered scholarships.
          </p>
        </div>

        <Link
          href="/dashboard/scholarships"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Cycle via Scholarships</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Active Open Cycles</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{activeCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Receiving applications</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Program Cycles</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{cycles.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Configured in system</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Upcoming Cycles</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{upcomingCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Scheduled for future intake</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Monitored Programs</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{scholarships.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Live in directory</div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Application Intake Windows</h2>
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'OPEN', 'REVIEWING', 'UPCOMING', 'CLOSED'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterTerm(status)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                  filterTerm === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#4b37df] mx-auto" />
            <p className="text-xs text-slate-400">Loading intake cycles...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-3 font-semibold">Cycle Name & ID</th>
                  <th className="pb-3 font-semibold">Associated Scholarship</th>
                  <th className="pb-3 font-semibold">Intake Term</th>
                  <th className="pb-3 font-semibold">Application Window</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCycles.map((cycle) => (
                  <tr key={cycle.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-semibold text-slate-900">{cycle.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{cycle.id}</div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{cycle.scholarshipTitle}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-700">
                      {cycle.intakeTerm} {cycle.year}
                    </td>
                    <td className="py-3.5 pr-3">
                      <div className="text-slate-800">
                        {cycle.openDate} → {cycle.deadlineDate}
                      </div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          cycle.status === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : cycle.status === 'REVIEWING'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : cycle.status === 'UPCOMING'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {cycle.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/scholarships/${cycle.scholarshipId}/edit`}
                          className="px-2.5 py-1 text-xs font-medium text-[#4b37df] hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteCycle(cycle)}
                          disabled={deletingId === cycle.id}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                          title="Delete Cycle"
                        >
                          {deletingId === cycle.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCycles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="max-w-sm mx-auto space-y-2">
                        <CalendarRange className="w-8 h-8 text-slate-300 mx-auto" />
                        <h4 className="text-sm font-semibold text-slate-800">No Cycles Found</h4>
                        <p className="text-xs text-slate-400 font-light">
                          Cycles are added when creating or editing scholarships. Click below to add a scholarship with its cycle dates.
                        </p>
                        <div className="pt-2">
                          <Link
                            href="/dashboard/scholarships/new"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs font-medium transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create Scholarship & Cycle</span>
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
