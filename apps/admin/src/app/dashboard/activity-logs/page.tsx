'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  timestamp: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED';
}

const SAMPLE_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-8821',
    actorName: 'System Root',
    actorRole: 'SUPER_ADMIN',
    action: 'ROLE_ELEVATION',
    resource: 'User',
    resourceId: 'USR-30291',
    ipAddress: '103.141.22.8 (Kathmandu, NP)',
    timestamp: '12 mins ago',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-8822',
    actorName: 'Pooja Karki',
    actorRole: 'ADMIN',
    action: 'ORGANIZATION_APPROVAL',
    resource: 'Organization',
    resourceId: 'ORG-KTM-331',
    ipAddress: '27.34.20.19 (Lalitpur, NP)',
    timestamp: '45 mins ago',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-8823',
    actorName: 'System Sentinel',
    actorRole: 'SYSTEM_DAEMON',
    action: 'RATE_LIMIT_EXCEEDED',
    resource: 'AuthAPI',
    resourceId: '/api/auth/sign-in',
    ipAddress: '185.220.101.5 (Tor Exit)',
    timestamp: '2 hours ago',
    status: 'BLOCKED',
  },
  {
    id: 'LOG-8824',
    actorName: 'Nabin Basnet',
    actorRole: 'ADMIN',
    action: 'SCHOLARSHIP_UPDATE',
    resource: 'Scholarship',
    resourceId: 'SCH-MEXT-2027',
    ipAddress: '103.141.22.8 (Kathmandu, NP)',
    timestamp: '3 hours ago',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-8825',
    actorName: 'System Root',
    actorRole: 'SUPER_ADMIN',
    action: 'PROXY_SECRET_ROTATION',
    resource: 'SecurityPolicy',
    resourceId: 'AUTH_PROXY_SECRET',
    ipAddress: '103.141.22.8 (Kathmandu, NP)',
    timestamp: 'Yesterday at 11:20',
    status: 'SUCCESS',
  },
];

export default function ActivityLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(SAMPLE_LOGS);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              14
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Activity & Audit Logs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable audit trail of administrator activities, authorization changes, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Write-Ahead Audit Active
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter audit logs by actor, action type, IP address, or resource ID..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold font-sans">
                <th className="pb-3">Action & Event ID</th>
                <th className="pb-3">Actor & Role</th>
                <th className="pb-3">Target Resource</th>
                <th className="pb-3">Source IP & Location</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 font-sans">
                    <div className="font-semibold text-slate-900 font-mono text-xs">{log.action}</div>
                    <div className="text-[10px] text-slate-400">{log.id}</div>
                  </td>
                  <td className="py-3.5 pr-3 font-sans">
                    <div className="font-semibold text-slate-800">{log.actorName}</div>
                    <div className="text-[10px] text-purple-700 font-bold uppercase">{log.actorRole}</div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-700">
                    <span>{log.resource}</span> • <span className="text-slate-400">{log.resourceId}</span>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-500 text-[11px]">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 pr-3 font-sans">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : log.status === 'BLOCKED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400 text-[11px] font-sans">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
