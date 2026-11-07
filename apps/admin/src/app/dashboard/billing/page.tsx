'use client';

import React from 'react';
import { CreditCard, DollarSign, Download, ArrowUpRight } from 'lucide-react';

interface SubscriptionRecord {
  id: string;
  orgName: string;
  plan: 'AGENCY_STARTER' | 'GLOBAL_PRO' | 'ENTERPRISE';
  amountNPR: string;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  renewalDate: string;
}

const SAMPLE_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'SUB-9021',
    orgName: 'Zenith Global Education',
    plan: 'GLOBAL_PRO',
    amountNPR: 'रु 45,000 / mo',
    status: 'ACTIVE',
    renewalDate: 'Nov 30, 2026',
  },
  {
    id: 'SUB-9022',
    orgName: 'Himalayan Education Hub',
    plan: 'AGENCY_STARTER',
    amountNPR: 'रु 20,000 / mo',
    status: 'ACTIVE',
    renewalDate: 'Dec 05, 2026',
  },
  {
    id: 'SUB-9023',
    orgName: 'Pathway Japan Consultancy',
    plan: 'ENTERPRISE',
    amountNPR: 'रु 95,000 / mo',
    status: 'ACTIVE',
    renewalDate: 'Jan 15, 2027',
  },
];

export default function BillingSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              16
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Billing & Subscriptions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin control for consultancy agency billing, lead quotas, payment gateway records, and revenue analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-purple-600 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Invoices</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Monthly Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-light text-slate-900 mt-2">रु 1,60,000</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">+18.4% from last month</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Paid Agencies</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-light text-slate-900 mt-2">38 Partners</div>
          <div className="text-[11px] text-slate-500 mt-1">Khalti & FonePay integrated</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Invoices</span>
            <ArrowUpRight className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-light text-slate-900 mt-2">0 Past Due</div>
          <div className="text-[11px] text-slate-500 mt-1">100% collection rate</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Partner Subscription Tiers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3">Organization</th>
                <th className="pb-3">Subscription Plan</th>
                <th className="pb-3">Monthly Fee</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Renewal Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SAMPLE_SUBSCRIPTIONS.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-slate-900">{s.orgName}</td>
                  <td className="py-3.5 pr-3 text-slate-700 font-mono text-[11px]">{s.plan}</td>
                  <td className="py-3.5 pr-3 font-semibold text-slate-900">{s.amountNPR}</td>
                  <td className="py-3.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-500">{s.renewalDate}</td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Manage Plan
                    </button>
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

