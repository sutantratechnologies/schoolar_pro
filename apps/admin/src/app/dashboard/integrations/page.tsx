'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  category: 'AUTH' | 'EMAIL' | 'PAYMENT' | 'STORAGE' | 'ANALYTICS';
  description: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ACTION_REQUIRED';
}

const SAMPLE_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int-better-auth',
    name: 'Better Auth SSO & Session Engine',
    category: 'AUTH',
    description: 'Cross-app session issuance, RBAC token signing, and Email OTP multi-factor authentication.',
    status: 'CONNECTED',
  },
  {
    id: 'int-resend',
    name: 'Resend Transactional Email API',
    category: 'EMAIL',
    description: 'Dispatches OTP verification codes, scholarship notifications, and password reset instructions.',
    status: 'CONNECTED',
  },
  {
    id: 'int-google-oauth',
    name: 'Google Cloud Identity OAuth',
    category: 'AUTH',
    description: 'One-click student sign-in with verified Google academic profiles.',
    status: 'CONNECTED',
  },
  {
    id: 'int-khalti',
    name: 'Khalti & FonePay Merchant Gateway',
    category: 'PAYMENT',
    description: 'Local payment processing for consultancy verification subscriptions and promotional features.',
    status: 'CONNECTED',
  },
  {
    id: 'int-r2',
    name: 'Cloudflare R2 Encrypted Document Vault',
    category: 'STORAGE',
    description: 'Secure student academic transcripts, recommendation letters, and government PAN documents.',
    status: 'CONNECTED',
  },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              17
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              External Integrations & APIs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin configuration for Better Auth, Resend, Cloudflare, Google Cloud, and payment gateways.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All 5 Core Services Operational</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_INTEGRATIONS.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {item.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">{item.id}</span>
              <button
                type="button"
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Configure Keys
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
