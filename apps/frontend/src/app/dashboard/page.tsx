'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Bookmark,
  FileCheck2,
  User,
  ArrowRight,
  Clock,
  Compass,
  LogOut,
} from 'lucide-react';
import type { CurrentSession } from '@sass-project/contracts';
import { authClient, fetchCurrentSession } from '@/lib/auth';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<CurrentSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    void fetchCurrentSession()
      .then((currentSession) => {
        if (!active) {
          return;
        }

        if (!currentSession) {
          router.replace('/login');
          return;
        }

        setSession(currentSession);
      })
      .catch(() => {
        if (active) {
          setSessionError('Unable to verify your session. Please try again.');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingSession(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        setSessionError(error.message || 'Unable to sign out. Please try again.');
        return;
      }

      router.replace('/login');
    } catch {
      setSessionError('Unable to reach the authentication service. Try again.');
    } finally {
      setSigningOut(false);
    }
  };

  if (loadingSession || (!session && !sessionError)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-600">
        Checking your session…
      </main>
    );
  }

  if (sessionError || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div role="alert" className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-800">
          {sessionError || 'Please sign in to continue.'}
          <div className="mt-4">
            <Link href="/login" className="font-medium text-[#4b37df] underline">
              Go to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const initials = session.user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Dashboard Header */}
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
              Student Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {session.user.name}
            </span>
            <Link
              href="/scholarships"
              className="text-xs font-medium text-slate-600 hover:text-slate-950 px-3 py-1.5"
            >
              Explore Grants
            </Link>
            <Link
              href="/dashboard/profile"
              className="w-8 h-8 rounded-full bg-[#4b37df] text-white text-xs font-semibold flex items-center justify-center"
            >
              {initials}
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      {/* Subnav */}
      <div className="bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 text-xs font-medium text-slate-500 overflow-x-auto">
          <Link href="/dashboard" className="py-3 border-b-2 border-slate-900 text-slate-900">
            Overview
          </Link>
          <Link href="/dashboard/profile" className="py-3 border-b-2 border-transparent hover:text-slate-900">
            Academic Profile
          </Link>
          <Link href="/dashboard/saved" className="py-3 border-b-2 border-transparent hover:text-slate-900">
            Saved Grants (4)
          </Link>
          <Link href="/dashboard/applications" className="py-3 border-b-2 border-transparent hover:text-slate-900">
            Application Tracker (2)
          </Link>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-normal text-slate-400 uppercase tracking-widest block">
              Student Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-light text-slate-900">
              Welcome back, {session.user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Target: Master’s in Computer Science • Destinations: Japan 🇯🇵 & Australia 🇦🇺
            </p>
          </div>

          <Link
            href="/scholarships"
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Match New Grants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-normal">Profile Matches</span>
              <GraduationCap className="w-4 h-4 text-[#4b37df]" />
            </div>
            <p className="text-2xl font-light text-slate-900 mt-2">18</p>
            <span className="text-[11px] text-emerald-600 mt-1 block">4 new full rides this week</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-normal">Saved Scholarships</span>
              <Bookmark className="w-4 h-4 text-[#4b37df]" />
            </div>
            <p className="text-2xl font-light text-slate-900 mt-2">4</p>
            <span className="text-[11px] text-slate-400 mt-1 block">MEXT, Chevening, GKS, DAAD</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-normal">Active Applications</span>
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-light text-slate-900 mt-2">2</p>
            <span className="text-[11px] text-blue-600 mt-1 block">1 awaiting SOP review</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-normal">Profile Readiness</span>
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-light text-slate-900 mt-2">85%</p>
            <span className="text-[11px] text-slate-400 mt-1 block">IELTS score updated</span>
          </div>
        </div>

        {/* Quick Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Tasks & Deadlines */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4b37df]" />
                <span>Upcoming Milestones</span>
              </h3>
              <Link href="/dashboard/applications" className="text-xs text-[#4b37df] hover:underline">
                View all tracker tasks →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-slate-900 block">MEXT Research Plan Draft Submission</span>
                  <span className="text-slate-400">Embassy of Japan in Nepal • In Progress</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">May 15, 2027</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-slate-900 block">Chevening Leadership Essay 2nd Polish</span>
                  <span className="text-slate-400">UK FCDO • Academic Referee Pending</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">Oct 28, 2027</span>
              </div>
            </div>
          </div>

          {/* Recommended Scholarships */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#4b37df]" />
                <span>Top Profile Matches</span>
              </h3>
              <Link href="/scholarships" className="text-xs text-[#4b37df] hover:underline">
                All 18 →
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">MEXT Japan University Recommendation</span>
                  <span className="text-emerald-700 font-medium">100% Ride</span>
                </div>
                <p className="text-slate-400 text-[11px]">Tokyo Institute of Technology • Computer Science</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">Australia Awards Nepal</span>
                  <span className="text-emerald-700 font-medium">Full Tuition + Air</span>
                </div>
                <p className="text-slate-400 text-[11px]">University of Melbourne • Information Systems</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
