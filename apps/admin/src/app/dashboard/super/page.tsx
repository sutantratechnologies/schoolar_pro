'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  UserPlus,
  KeyRound,
} from 'lucide-react';

interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  lastLogin: string;
  status: 'active' | 'suspended';
}

const SAMPLE_STAFF: StaffAccount[] = [
  { id: 'STAFF-1', name: 'System Root', email: 'admin@bidyago.com', role: 'SUPER_ADMIN', lastLogin: 'Today at 12:45', status: 'active' },
  { id: 'STAFF-2', name: 'Pooja Karki', email: 'pooja.ops@bidyago.com', role: 'ADMIN', lastLogin: 'Yesterday at 18:20', status: 'active' },
  { id: 'STAFF-3', name: 'Nabin Basnet', email: 'nabin.compliance@bidyago.com', role: 'ADMIN', lastLogin: 'Nov 04, 2026', status: 'active' },
];

export default function SuperAdminControlCenterPage() {
  const [staff] = useState<StaffAccount[]>(SAMPLE_STAFF);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Restricted Executive Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
          Super Admin Control Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Root platform governance: staff role delegation, audit log review, and platform-wide configurations.
        </p>
      </div>

      {/* Staff Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Platform Staff & Roles</h2>
            <p className="text-xs text-slate-500">Assign administrator permissions to trusted team members</p>
          </div>
          <button
            type="button"
            onClick={() => alert('Invite administrator dialog')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Admin</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {staff.map((member) => (
            <div key={member.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold ${
                  member.role === 'SUPER_ADMIN'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">{member.name}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      member.role === 'SUPER_ADMIN'
                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}>
                      {member.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{member.email} • Last active {member.lastLogin}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Manage permissions for ${member.name}`)}
                  className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
                >
                  Permissions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log & Critical Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#4b37df]" />
            <h3 className="text-sm font-semibold text-slate-900">Security Audit Log</h3>
          </div>
          <div className="space-y-3 text-xs">
            {[
              { action: 'Partner VER-001 credential verification', user: 'admin@bidyago.com', time: '10 mins ago' },
              { action: 'Scholarship SCH-01 requirements modified', user: 'pooja.ops@bidyago.com', time: '2 hours ago' },
              { action: 'HMAC signature token rotated for workspace', user: 'System (Super)', time: 'Yesterday' },
            ].map((log) => (
              <div key={log.action} className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <p className="font-medium text-slate-800">{log.action}</p>
                <p className="text-[10px] text-slate-400">{log.user} • {log.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">Subdomain Access Policies</h3>
          </div>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <strong className="block text-slate-900">bidyago.com</strong>
                <span className="text-[11px] text-slate-400">Student Portal & Public Landing</span>
              </div>
              <span className="text-emerald-600 font-semibold text-[11px]">STUDENT</span>
            </div>
            <div className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <strong className="block text-slate-900">admin.bidyago.com</strong>
                <span className="text-[11px] text-slate-400">Platform Governance & Compliance</span>
              </div>
              <span className="text-rose-600 font-semibold text-[11px]">ADMIN / SUPER</span>
            </div>
            <div className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <strong className="block text-slate-900">workspace.bidyago.com</strong>
                <span className="text-[11px] text-slate-400">Consultancy & University Portal</span>
              </div>
              <span className="text-purple-600 font-semibold text-[11px]">COLLEGE / CONSULTANCY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
