'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Building2,
  Download,
} from 'lucide-react';

interface LookupResult {
  refId: string;
  orgName: string;
  orgType: string;
  licenseNumber: string;
  status: 'Verified Partner' | 'Under Review' | 'Additional Docs Required';
  statusColor: string;
  submittedAt: string;
  reviewedAt?: string;
  notes: string;
  steps: {
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending';
  }[];
}

const SAMPLE_STATUSES: Record<string, LookupResult> = {
  'ORG-842190': {
    refId: 'ORG-842190',
    orgName: 'Himalayan Education Foundation Pvt. Ltd.',
    orgType: 'Education Consultancy',
    licenseNumber: 'MoEST-REG-2080-142',
    status: 'Verified Partner',
    statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    submittedAt: 'October 12, 2026',
    reviewedAt: 'October 14, 2026',
    notes: 'MoEST License and Tax Clearance Certificate officially matched against the Nepal National Education Registry.',
    steps: [
      { title: 'Application Submitted', description: 'Application received and registered in queue', status: 'completed' },
      { title: 'MoEST License Validation', description: 'Cross-checked with Ministry records', status: 'completed' },
      { title: 'Tax & PAN Compliance Audit', description: 'Verified with Inland Revenue Department', status: 'completed' },
      { title: 'Partner Badge Issued', description: 'Organization portal access unlocked', status: 'completed' },
    ],
  },
  'ORG-102938': {
    refId: 'ORG-102938',
    orgName: 'Kathmandu International Studies',
    orgType: 'Education Consultancy',
    licenseNumber: 'MoEST-REG-2081-331',
    status: 'Under Review',
    statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
    submittedAt: 'October 29, 2026',
    notes: 'Documents under manual review by the compliance team. Estimated resolution within 24 hours.',
    steps: [
      { title: 'Application Submitted', description: 'Application received and registered in queue', status: 'completed' },
      { title: 'MoEST License Validation', description: 'Under active cross-check with Ministry records', status: 'in_progress' },
      { title: 'Tax & PAN Compliance Audit', description: 'Awaiting tax clearance confirmation', status: 'pending' },
      { title: 'Partner Badge Issued', description: 'Pending clearance', status: 'pending' },
    ],
  },
};

export default function OrganizationStatusPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSearched(true);
      const cleanKey = query.trim().toUpperCase();
      if (SAMPLE_STATUSES[cleanKey]) {
        setResult(SAMPLE_STATUSES[cleanKey]);
      } else {
        // Fallback demo result for any entered reference
        setResult({
          refId: cleanKey,
          orgName: 'Registered Education Enterprise',
          orgType: 'Education Consultancy',
          licenseNumber: 'MoEST-REG-VERIFY',
          status: 'Under Review',
          statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
          submittedAt: 'Recently Submitted',
          notes: 'Your credentials have been placed into the government database verification queue.',
          steps: [
            { title: 'Application Submitted', description: 'Application received', status: 'completed' },
            { title: 'MoEST License Validation', description: 'Cross-checking with regulatory registry', status: 'in_progress' },
            { title: 'Compliance Audit', description: 'Awaiting clearance', status: 'pending' },
            { title: 'Portal Credential Issuance', description: 'Pending review completion', status: 'pending' },
          ],
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-block group focus:outline-hidden" aria-label="BidyaGo Home">
              <Image
                src="/bidyago_logo.png"
                alt="BidyaGo"
                width={130}
                height={34}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              partners.bidyago.com
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/organizations/register"
              className="text-xs font-medium text-[#4b37df] hover:underline"
            >
              Register New Organization
            </Link>
            <Link
              href="/organizations"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-normal text-slate-400 uppercase tracking-widest block">
            Verification Tracker
          </span>
          <h1 className="text-3xl font-light text-slate-900">
            Check Institutional Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Track the verification progress of your consultancy or college partner application.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Application Ref (e.g. ORG-842190) or MoEST License No."
              className="flex-1 text-xs text-slate-900 focus:outline-hidden px-2 py-1.5"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-normal hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Checking...' : 'Check Status'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
            <span>Try sample references:</span>
            <button
              onClick={() => {
                setQuery('ORG-842190');
              }}
              className="text-[#4b37df] hover:underline"
            >
              ORG-842190 (Verified)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setQuery('ORG-102938');
              }}
              className="text-[#4b37df] hover:underline"
            >
              ORG-102938 (Under Review)
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && result && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {result.orgType}
                  </span>
                </div>
                <h2 className="text-xl font-medium text-slate-900">{result.orgName}</h2>
                <div className="text-xs text-slate-500">
                  License: <span className="font-mono text-slate-700">{result.licenseNumber}</span> • Ref: <span className="font-mono text-slate-700">{result.refId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${result.statusColor}`}>
                  {result.status}
                </span>
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Verification Steps
              </h3>
              <div className="space-y-3">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="pt-0.5">
                      {step.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {step.status === 'in_progress' && (
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="font-medium text-slate-900">{step.title}</div>
                      <div className="text-slate-500 mt-0.5">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1">
              <div className="font-medium text-slate-800">Compliance Notes:</div>
              <p>{result.notes}</p>
            </div>

            {result.status === 'Verified Partner' && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/organizations"
                  className="px-5 py-2.5 rounded-full bg-[#4b37df] text-white text-xs font-normal hover:bg-[#3d2cb8] transition-colors"
                >
                  Access Organization Dashboard
                </Link>
                <button
                  onClick={() => alert('Official Verified Partner Seal SVG downloaded.')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Verified Badge</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © 2026 BidyaGo Institutional Network. Dedicated portal for verified consultancies & universities.
      </footer>
    </div>
  );
}
