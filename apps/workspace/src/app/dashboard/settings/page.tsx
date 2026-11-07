'use client';

import React from 'react';
import {
  CheckCircle2,
} from 'lucide-react';

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
          Organization Profile & Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review institutional accreditation, government registration credentials, and workspace preferences.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
              ORG
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Kathmandu International Studies</h2>
              <p className="text-xs text-slate-400">Institutional ID: ORG-KTM-2081-331</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verified Partner
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400">Official Registration / MoEST License</span>
            <p className="font-medium text-slate-800">MoEST-REG-2081-331</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Authorized Primary Representative</span>
            <p className="font-medium text-slate-800">Bikram Thapa (Managing Director)</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Headquarters Address</span>
            <p className="font-medium text-slate-800">Putalisadak, Kathmandu, Nepal</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Official Communications Email</span>
            <p className="font-medium text-slate-800">info@kismepal.com</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 space-y-1">
          <strong className="text-slate-700">Subdomain Deployment:</strong>
          <p>This workspace is configured to operate under <code>workspace.bidyago.com</code> with dedicated session cookies isolated from the student portal.</p>
        </div>
      </div>
    </div>
  );
}
