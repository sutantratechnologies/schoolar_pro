import React from 'react';
import { requireRole } from '@/lib/auth/session';
import {
  ShieldCheck,
  Mail,
  KeyRound,
  Calendar,
  Lock,
} from 'lucide-react';

export default async function AdminProfilePage() {
  const session = await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const isSuperAdmin = session.user.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#4b37df] text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Authenticated Administrator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
          My Administrator Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your platform credentials, assigned security clearance, and active administrative access.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4b37df] to-[#6d5ae6] text-white text-xl font-bold flex items-center justify-center shadow-sm">
              {session.user.name ? session.user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-semibold text-slate-900">{session.user.name}</h2>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isSuperAdmin
                      ? 'bg-purple-50 text-[#4b37df] border-purple-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{session.user.email}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified & Active
            </span>
          </div>
        </div>

        {/* Credentials Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Mail className="w-3.5 h-3.5" />
              <span>Registered Email</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 font-mono">{session.user.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Assigned Security Clearance</span>
            </div>
            <p className="text-xs font-semibold text-slate-900">
              {isSuperAdmin
                ? 'Root Authority (Full System Access)'
                : 'Platform Operations & Verification'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Platform Portal</span>
            </div>
            <p className="text-xs font-semibold text-slate-900">admin.bidyago.com</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Authentication Type</span>
            </div>
            <p className="text-xs font-semibold text-slate-900">Internal Credential Guard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
