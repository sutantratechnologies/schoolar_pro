'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Filter,
  Building2,
  Mail,
  Phone,
  FileText,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface PendingVerification {
  id: string;
  name: string;
  type: 'consultancy' | 'university';
  applicantName: string;
  applicantEmail: string;
  phone: string;
  licenseNumber: string;
  city: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_PENDING: PendingVerification[] = [
  {
    id: 'VER-001',
    name: 'Kathmandu International Studies',
    type: 'consultancy',
    applicantName: 'Bikram Thapa',
    applicantEmail: 'info@kismepal.com',
    phone: '+977 1 4429811',
    licenseNumber: 'MoEST-REG-2081-331',
    city: 'Kathmandu, Nepal',
    submittedDate: '2026-10-29',
    status: 'pending',
  },
  {
    id: 'VER-002',
    name: 'Pokhara Abroad Study Center',
    type: 'consultancy',
    applicantName: 'Suman Gurung',
    applicantEmail: 'contact@pokharastudy.edu.np',
    phone: '+977 61 520111',
    licenseNumber: 'MoEST-REG-2079-094',
    city: 'Pokhara, Nepal',
    submittedDate: '2026-10-30',
    status: 'pending',
  },
  {
    id: 'VER-003',
    name: 'Nagoya Future University Liaison',
    type: 'university',
    applicantName: 'Kenji Sato',
    applicantEmail: 'admissions-asia@nagoya-u.ac.jp',
    phone: '+81 52 789 5111',
    licenseNumber: 'MEXT-UNI-JP-391',
    city: 'Nagoya, Japan',
    submittedDate: '2026-10-31',
    status: 'pending',
  },
];

export default function AdminOrganizationsPage() {
  const [items, setItems] = useState<PendingVerification[]>(INITIAL_PENDING);
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PendingVerification | null>(INITIAL_PENDING[0]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleApprove = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'approved' } : i))
    );
    setActionNotice(`Approved partner credentials for "${name}". Workspace access unlocked.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleReject = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'rejected' } : i))
    );
    setActionNotice(`Rejected application for "${name}". Notification dispatched.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filtered = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
          Partner Verifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review government registration certificates, institutional credentials, and approve workspace access.
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500">Filter:</span>
        {['all', 'consultancy', 'university'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
              filterType === type
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {type === 'all' ? 'All Applicants' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Main Grid: List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Verification Queue */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer bg-white ${
                selectedItem?.id === item.id
                  ? 'border-[#4b37df] ring-2 ring-[#4b37df]/10 shadow-sm'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Authorized Contact: {item.applicantName} ({item.applicantEmail})</p>
                  <p className="text-xs text-slate-400">License: {item.licenseNumber} • {item.city}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                    item.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : item.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Submitted {item.submittedDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Detail Inspector Card */}
        <div>
          {selectedItem ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 sticky top-24 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#4b37df]" />
                  <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    {selectedItem.id} Details
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{selectedItem.name}</h3>
              </div>

              <div className="space-y-3 text-xs border-t border-b border-slate-100 py-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedItem.city}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Government License: <strong>{selectedItem.licenseNumber}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedItem.applicantEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedItem.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={selectedItem.status === 'approved'}
                  onClick={() => handleApprove(selectedItem.id, selectedItem.name)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Grant Workspace</span>
                </button>

                <button
                  type="button"
                  disabled={selectedItem.status === 'rejected'}
                  onClick={() => handleReject(selectedItem.id, selectedItem.name)}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Application</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-400 leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                Approving grants credentials for <strong>workspace.bidyago.com</strong>.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              Select an applicant to inspect credentials
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

