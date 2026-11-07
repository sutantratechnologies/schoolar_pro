'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Bookmark,
  GitCompare,
  FileText,
  FolderCheck,
  CheckSquare,
  Calendar,
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Search,
  GraduationCap,
  Plus,
} from 'lucide-react';
import type { CurrentSession } from '@sass-project/contracts';
import { authClient } from '@/lib/auth';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        name: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'DISCOVER',
    items: [
      {
        name: 'Explore Scholarships',
        href: '/dashboard/explore',
        icon: Compass,
      },
      {
        name: 'Recommended for Me',
        href: '/dashboard/recommended',
        icon: Sparkles,
        badge: '98% Match',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        name: 'Saved Scholarships',
        href: '/dashboard/saved',
        icon: Bookmark,
        badge: '4',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      },
      {
        name: 'Compare Scholarships',
        href: '/dashboard/compare',
        icon: GitCompare,
      },
    ],
  },
  {
    title: 'MY APPLICATIONS',
    items: [
      {
        name: 'Application Tracker',
        href: '/dashboard/applications',
        icon: FileText,
        badge: '2 Active',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        name: 'My Documents',
        href: '/dashboard/documents',
        icon: FolderCheck,
        badge: '3/4 Ready',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        name: 'Tasks & Checklist',
        href: '/dashboard/tasks',
        icon: CheckSquare,
        badge: '3 Due',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      },
      {
        name: 'Deadlines & Calendar',
        href: '/dashboard/calendar',
        icon: Calendar,
        badge: '8d left',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      {
        name: 'My Profile',
        href: '/dashboard/profile',
        icon: User,
        badge: '7 Sections',
        badgeColor: 'bg-purple-50 text-[#4b37df] border-purple-200',
      },
      {
        name: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        badge: '2',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
      },
      {
        name: 'Help & Support',
        href: '/dashboard/help',
        icon: HelpCircle,
      },
    ],
  },
];

export function StudentPortalShell({
  session,
  children,
}: {
  session: CurrentSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.replace('/login');
    } catch {
      router.replace('/login');
    } finally {
      setSigningOut(false);
    }
  };

  const initials = session?.user?.name
    ? session.user.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase())
        .join('')
    : 'ST';

  const isCurrentRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          role="presentation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <Image
                src="/bidyago_logo.png"
                alt="BidyaGo"
                width={124}
                height={32}
                className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
              <span className="text-[10px] font-semibold text-[#4b37df] bg-[#4b37df]/10 border border-[#4b37df]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Student
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Scroll Container */}
          <nav className="px-3.5 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {section.title && (
                  <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => {
                  const active = isCurrentRoute(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                        active
                          ? 'bg-[#4b37df] text-white shadow-sm shadow-[#4b37df]/25 font-semibold'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-slate-700'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium border truncate ${
                            active
                              ? 'bg-white/20 text-white border-white/30'
                              : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom: User Card & Sign Out */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2.5">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4b37df] to-[#6d5ae6] text-white text-xs font-semibold flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {session?.user?.name || 'Student'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarships, grants, deadlines... (/)"
                className="w-full pl-9 pr-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:bg-white focus:ring-1 focus:ring-[#4b37df] transition-all"
              />
            </div>
          </div>

          {/* Right: Quick Target Status, Notifications & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200/60">
              <GraduationCap className="w-3.5 h-3.5 text-[#4b37df]" />
              <span>Master’s Candidate • 2026/27</span>
            </span>

            <Link
              href="/dashboard/explore"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Explore Grants</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              </button>

              {/* Notification Flyout */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-semibold text-slate-900">Notifications</span>
                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] text-[#4b37df] hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                      <p className="font-medium text-purple-950">MEXT Japan Deadline in 8 Days</p>
                      <p className="text-[11px] text-purple-700 mt-0.5">Embassy physical submission closes May 15.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-medium text-slate-900">Australia Awards Matched</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Your profile is a 95% academic fit.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Link */}
            <Link
              href="/dashboard/profile"
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium flex items-center justify-center transition-colors shadow-2xs"
              title="My Academic Profile"
            >
              {initials}
            </Link>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
