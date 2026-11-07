'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import {
  authClient,
  resolveActiveSession,
} from '@/lib/auth';

interface HeroSectionProps {
  onSearch?: (query: string, degree: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const { data: session } = authClient.useSession();
  const [sessionUser, setSessionUser] = useState<{
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null>(session?.user ? { ...session.user } : null);

  const user = sessionUser ?? (session?.user ? { ...session.user } : null);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      if (session?.user) {
        if (isMounted) setSessionUser({ ...session.user });
        return;
      }

      try {
        const resolved = await resolveActiveSession();
        if (isMounted) {
          if (resolved?.user) {
            setSessionUser({ ...resolved.user });
          } else {
            setSessionUser(null);
          }
        }
      } catch {
        if (isMounted) setSessionUser(null);
      }
    };

    void syncSession();

    const handleFocus = () => {
      void syncSession();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, [session]);
  const scrollToScholarships = () => {
    if (onSearch) {
      onSearch('', 'all');
    }
    const element = document.getElementById('scholarships');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGetStarted = () => {
    const element = document.getElementById('personalized-matching');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] sm:min-h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-14">
      {/* Full-Width Background Image: Iconic Abroad Study Destination */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2600&q=85')`,
        }}
      />

      {/* Primary Brand Blue Tint Overlay (#4b37df with low opacity) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4b37df]/40 via-[#4b37df]/25 to-slate-950/70 backdrop-brightness-95" />

      {/* 1. Top Center: Main Logo in Completely White */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center pt-2">
        <Image
          src="/bidyago_logo.png"
          alt="BidyaGo"
          width={180}
          height={45}
          className="h-8 sm:h-10 w-auto object-contain drop-shadow-lg select-none"
          style={{ filter: 'brightness(0) invert(1)' }}
          priority
        />
      </div>

      {/* 2. Middle Center: Two-Line Main Title, Subtitle, and Minimal Action Buttons */}
      <div className="relative z-10 my-auto text-center max-w-4xl mx-auto space-y-6 px-4 w-full">
        {/* Main Title in Two Lines (Slim & Light Minimalist Style) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.18] sm:leading-[1.15] max-w-4xl mx-auto">
          <span className="block">Your Future. Your Scholarship.</span>
          <span className="block mt-1 sm:mt-2 font-normal">Your Journey.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
          Discover global scholarships, explore opportunities, and plan your next academic journey.
        </p>

        {/* Minimal Action Buttons: "Explore Scholarships →" and "Get Started" / "Dashboard" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={scrollToScholarships}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-slate-900 text-xs sm:text-sm font-normal hover:bg-slate-100 transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Explore Scholarships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#4b37df] hover:bg-[#3f2cd6] text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={scrollToGetStarted}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-transparent hover:bg-white/10 text-white text-xs sm:text-sm font-normal border border-white/40 hover:border-white transition-all duration-200 cursor-pointer inline-flex items-center justify-center"
            >
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* 3. Bottom: Three Core Pillars (Clean, Normal Weight, No Background/Border) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/80 font-normal pt-4">
        <div className="flex items-center gap-2">
          <span className="text-white/60">✦</span>
          <span>Global Opportunities</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60">✦</span>
          <span>Trusted Information</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60">✦</span>
          <span>Smarter Applications</span>
        </div>
      </div>
    </section>
  );
}
