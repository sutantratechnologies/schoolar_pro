'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Briefcase,
  ArrowUpRight,
  LayoutDashboard,
} from 'lucide-react';
import {
  authClient,
  resolveActiveSession,
} from '@/lib/auth';
import { getAppUrl } from '@/lib/auth/targets';

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [sessionUser, setSessionUser] = useState<{
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null>(session?.user ? { ...session.user } : null);

  const user = sessionUser ?? (session?.user ? { ...session.user } : null);
  const [visible, setVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [mobileOrgOpen, setMobileOrgOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      // If we are on an internal page (not the root landing page with the huge hero), always show navbar
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        setVisible(true);
        return;
      }

      // Show full-size navbar only after scrolling down past the hero section (~450px or 60% viewport)
      const threshold = Math.min(window.innerHeight * 0.65, 500);
      if (window.scrollY > threshold) {
        setVisible(true);
      } else {
        setVisible(false);
        setMobileMenuOpen(false);
        setOrgDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOrgDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300 ease-in-out ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center group focus:outline-hidden"
            aria-label="BidyaGo Home"
          >
            <Image
              src="/bidyago_logo.png"
              alt="BidyaGo"
              width={160}
              height={40}
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-normal text-slate-600">
            <Link
              href="#scholarships"
              className="hover:text-slate-950 transition-colors"
            >
              Scholarships
            </Link>
            <Link
              href="#destinations"
              className="hover:text-slate-950 transition-colors"
            >
              Destinations
            </Link>

            {/* For Organizations Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setOrgDropdownOpen(true)}
              onMouseLeave={() => setOrgDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setOrgDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 py-2 hover:text-slate-950 transition-colors cursor-pointer ${
                  orgDropdownOpen ? 'text-slate-950 font-medium' : ''
                }`}
                aria-expanded={orgDropdownOpen}
                aria-haspopup="true"
              >
                <span>For Organizations</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    orgDropdownOpen ? 'rotate-180 text-slate-900' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Dropdown Menu Card (White Background) */}
              {orgDropdownOpen && (
                <div
                  className="absolute top-full -left-12 sm:left-1/2 sm:-translate-x-1/2 pt-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                  role="menu"
                >
                  <div className="w-[370px] sm:w-[410px] bg-white text-slate-900 border border-slate-200/90 rounded-2xl p-2.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                    {/* Item 1: For Universities */}
                    <Link
                      href="#for-colleges"
                      onClick={() => setOrgDropdownOpen(false)}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left block"
                      role="menuitem"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#edeafd] flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5 text-[#5542f6]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 tracking-tight group-hover:text-[#4b37df] transition-colors">
                            For Universities
                          </div>
                          <div className="text-xs text-slate-500 font-normal leading-snug mt-0.5">
                            Showcase programmes and connect with students.
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                    </Link>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 my-1 mx-2" />

                    {/* Item 2: For Consultancies & Universities */}
                    <a
                      href={getAppUrl('workspace', '/')}
                      onClick={() => setOrgDropdownOpen(false)}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left block"
                      role="menuitem"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#edeafd] flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 text-[#5542f6]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 tracking-tight group-hover:text-[#4b37df] transition-colors">
                            For Consultancies
                          </div>
                          <div className="text-xs text-slate-500 font-normal leading-snug mt-0.5">
                            Manage students, counsellors and applications.
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="#guides"
              className="hover:text-slate-950 transition-colors"
            >
              Guides
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-all shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Student Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                  title={(user.name || user.email) ?? undefined}
                >
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-[#4b37df] flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
                  </div>
                  <span className="text-xs font-medium text-slate-700 max-w-[100px] truncate">
                    {user.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-slate-100 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            href="#scholarships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-normal text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          >
            Scholarships
          </Link>
          <Link
            href="#destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-normal text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          >
            Destinations
          </Link>

          {/* Mobile Organizations Accordion (White Background) */}
          <div className="pt-1 pb-1">
            <button
              type="button"
              onClick={() => setMobileOrgOpen(!mobileOrgOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-normal text-slate-700 hover:bg-slate-50 hover:text-slate-950 cursor-pointer"
            >
              <span>For Organizations</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  mobileOrgOpen ? 'rotate-180 text-slate-900' : ''
                }`}
              />
            </button>

            {mobileOrgOpen && (
              <div className="mt-1 space-y-1 bg-white text-slate-900 border border-slate-200/80 rounded-2xl p-2 shadow-sm animate-in fade-in-0 duration-150">
                <Link
                  href="#for-colleges"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileOrgOpen(false);
                  }}
                  className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all text-left block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#edeafd] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-[#5542f6]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        For Universities
                      </div>
                      <div className="text-xs text-slate-500 font-normal leading-snug">
                        Showcase programmes and connect with students.
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 shrink-0 ml-2" />
                </Link>

                <div className="h-px bg-slate-100 my-1 mx-2" />

                <a
                  href={getAppUrl('workspace', '/')}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileOrgOpen(false);
                  }}
                  className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all text-left block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#edeafd] flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-[#5542f6]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        For Consultancies
                      </div>
                      <div className="text-xs text-slate-500 font-normal leading-snug">
                        Manage students, counsellors and applications.
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 shrink-0 ml-2" />
                </a>
              </div>
            )}
          </div>

          <Link
            href="#guides"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-normal text-slate-700 hover:bg-slate-50 hover:text-slate-950"
          >
            Guides
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3.5 py-2.5 flex items-center gap-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <div className="w-9 h-9 rounded-full bg-[#4b37df] text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user.name || 'Student Account'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-[#4b37df] rounded-full block transition-colors shadow-xs"
                >
                  Open Student Portal →
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-xs font-medium text-slate-600 hover:text-slate-900 block"
                >
                  My Profile & Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs sm:text-sm font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded-full cursor-pointer block"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs sm:text-sm font-normal text-white bg-slate-900 rounded-full text-center block"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
