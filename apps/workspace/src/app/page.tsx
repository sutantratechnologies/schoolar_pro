'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function WorkspaceLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block focus:outline-hidden">
              <Image
                src="/bidyago_logo.png"
                alt="BidyaGo"
                width={150}
                height={38}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Partner Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors"
            >
              Staff Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              <span>Register Organization</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-purple-50/40 via-white to-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-700 bg-purple-100/70 px-4 py-1.5 rounded-full border border-purple-200">
              For Verified Consultancies & Universities
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-slate-900 tracking-tight leading-tight">
              Scale Your International Students & Manage Application Workflows
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Connect with verified student scholars from Nepal and South Asia. Track documents, manage counseling pipelines, and publish scholarship quotas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Access Partner Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium border border-slate-200 transition-all flex items-center justify-center"
              >
                Apply for Institutional Verification
              </Link>
            </div>
          </div>
        </section>

        {/* Two Partner Tracks Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
              Tailored Tools for Every Organization
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Dedicated workflows customized for educational agencies and global universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Consultancy Track Card */}
            <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-6 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">Education Consultancies</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Counsel students with verified government grant data, organize documents, assign counselors, and track embassy milestones.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Centralized Student Document Vault & SOP tracker</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Counselor team collaboration & role delegation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct lead discovery matching your destination expertise</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#4b37df] hover:underline"
              >
                <span>Consultancy Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* University Track Card */}
            <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-6 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">Universities & Colleges</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Liaison directly with prospective scholars, publish departmental tuition waivers, and manage institutional international quotas.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Publish official department scholarship grants</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Receive pre-screened international student leads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct embassy liaison and accreditation badges</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#4b37df] hover:underline"
              >
                <span>University Liaison Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 bg-slate-50 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} BidyaGo Partner Workspace. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
