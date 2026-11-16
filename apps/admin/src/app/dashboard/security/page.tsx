'use client';

import React from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SecurityAccessPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              19
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Security, Secrets & Session Policies
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin cryptography control: proxy HMAC signatures, session expiration, and rate-limiting rules.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>HMAC Signatures Active</span>
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
            HMAC Proxy Authentication Secret
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every request between the Next.js frontend applications and the centralized backend is signed using an HMAC SHA-256 signature (<span className="font-mono">x-bidy-proxy-signature</span>) with a maximum timestamp skew window of 60 seconds.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-800">AUTH_PROXY_SECRET</div>
              <div className="font-mono text-[11px] text-slate-500 mt-0.5">•••••••••••••••••••••••••••••••• (32+ bytes configured)</div>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>Rotate Secret Key</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
            Session & Cookie Security Policies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="text-xs font-semibold text-slate-900">Session Token Lifetime</div>
              <div className="text-xs text-slate-500">7 Days (automatic sliding window refresh)</div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="text-xs font-semibold text-slate-900">Cookie Isolation Prefix</div>
              <div className="text-xs text-slate-500">Target-bound: <span className="font-mono">bg_main</span>, <span className="font-mono">bg_portal</span>, <span className="font-mono">bg_workspace</span></div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="text-xs font-semibold text-slate-900">Sign-in Rate Limiting</div>
              <div className="text-xs text-slate-500">10 failed attempts / 60s per IP window</div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="text-xs font-semibold text-slate-900">Transport Security</div>
              <div className="text-xs text-slate-500">HttpOnly, SameSite=Lax (Secure in prod)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
