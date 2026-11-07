'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

type OrgType = 'consultancy' | 'university';

export default function OrganizationRegisterPage() {
  const [orgType, setOrgType] = useState<OrgType>('consultancy');
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseOrCode, setLicenseOrCode] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [website, setWebsite] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the Institutional Verification Terms.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-40">
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
              href="/organizations/status"
              className="text-xs font-normal text-slate-500 hover:text-slate-900 transition-colors"
            >
              Check Verification Status
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
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        {submitted ? (
          <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/80 bg-white shadow-xs text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Application Received
              </span>
              <h1 className="text-2xl sm:text-3xl font-light text-slate-900">
                Institutional Verification Initiated
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                Thank you for applying to join the verified BidyaGo Institutional Network. Our compliance team will review your credentials against government databases within 2 business days.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 max-w-md mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Application Reference:</span>
                <span className="font-mono font-medium text-slate-900">ORG-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Organization:</span>
                <span className="font-medium text-slate-900">{orgName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Contact Email:</span>
                <span className="font-medium text-slate-900">{workEmail}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/organizations/status"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-normal hover:bg-slate-800 transition-colors"
              >
                Track Verification Status
              </Link>
              <Link
                href="/organizations"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                Return to Portal
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-normal text-slate-400 uppercase tracking-widest block">
                Partner Network Onboarding
              </span>
              <h1 className="text-3xl font-light text-slate-900">
                Register Your Institution
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Join certified consultancies and global universities on the official BidyaGo Platform.
              </p>
            </div>

            {/* Org Type Selector */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setOrgType('consultancy')}
                className={`py-3 px-4 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                  orgType === 'consultancy'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#4b37df]" />
                <span>Education Consultancy</span>
              </button>
              <button
                type="button"
                onClick={() => setOrgType('university')}
                className={`py-3 px-4 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                  orgType === 'university'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#4b37df]" />
                <span>College / University</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    {orgType === 'consultancy' ? 'Consultancy Legal Name' : 'University / College Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={orgType === 'consultancy' ? 'e.g. Kathmandu Global Education Pvt. Ltd.' : 'e.g. Kyoto Institute of Technology'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Contact Person Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Rajesh Khadka"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Official Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="e.g. info@organization.edu.np"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +977 1 4412345"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      {orgType === 'consultancy' ? 'MoEST Approval / License Number' : 'Accreditation Body / Edu Code'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseOrCode}
                      onChange={(e) => setLicenseOrCode(e.target.value)}
                      placeholder={orgType === 'consultancy' ? 'e.g. MoEST-REG-2080-492' : 'e.g. MEXT / TEQSA / QAA code'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Headquarters / Main Campus City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Kathmandu, Pokhara, Tokyo, London"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Official Website URL
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.example.edu.np"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Compliance & Strict Anti-Scam Verification</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    BidyaGo cross-checks government regulatory databases (Nepal Ministry of Education, Science and Technology, Department of Foreign Affairs, etc.). Submitting fraudulent registrations results in immediate permanent blacklist.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="terms-agreed"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <label htmlFor="terms-agreed" className="text-xs text-slate-600">
                    I certify that I am an authorized representative of this institution and all provided documentation is accurate under penalty of civil liability.
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-full bg-slate-900 text-white text-xs font-normal hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit for Verification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
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
