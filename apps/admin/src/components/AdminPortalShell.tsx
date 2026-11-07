'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarRange,
  Globe2,
  BookOpen,
  Landmark,
  Users,
  Building2,
  FileCheck2,
  UserCog,
  Bell,
  LifeBuoy,
  BarChart3,
  ScrollText,
  ShieldCheck,
  CreditCard,
  Cpu,
  Settings2,
  Lock,
  Search,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Plus,
} from 'lucide-react';
import type { CurrentSession } from '@sass-project/contracts';
import { authClient } from '@/lib/auth';
import { getAppUrl } from '@/lib/auth/targets';

interface NavItem {
  id: string;
  number: string;
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  superOnly?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        id: 'overview',
        number: '01',
        title: 'Dashboard Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'PLATFORM MANAGEMENT',
    items: [
      {
        id: 'scholarships',
        number: '02',
        title: 'Scholarships',
        href: '/dashboard/scholarships',
        icon: GraduationCap,
        badge: '1,420',
      },
      {
        id: 'cycles',
        number: '03',
        title: 'Scholarship Cycles',
        href: '/dashboard/cycles',
        icon: CalendarRange,
        badge: 'Active',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        id: 'destinations',
        number: '04',
        title: 'Countries & Destinations',
        href: '/dashboard/destinations',
        icon: Globe2,
        badge: '48',
      },
      {
        id: 'content',
        number: '05',
        title: 'Guides & Content',
        href: '/dashboard/content',
        icon: BookOpen,
      },
      {
        id: 'institutions',
        number: '06',
        title: 'Institutions',
        href: '/dashboard/institutions',
        icon: Landmark,
        badge: '260+',
      },
    ],
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      {
        id: 'students',
        number: '07',
        title: 'Students',
        href: '/dashboard/students',
        icon: Users,
        badge: '12.4k',
      },
      {
        id: 'organizations',
        number: '08',
        title: 'Organizations',
        href: '/dashboard/organizations',
        icon: Building2,
        badge: '84',
      },
      {
        id: 'applications',
        number: '09',
        title: 'Organization Applications',
        href: '/dashboard/applications',
        icon: FileCheck2,
        badge: '6 New',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
      },
      {
        id: 'admin-management',
        number: '10',
        title: 'Admin Management',
        href: '/dashboard/super',
        icon: UserCog,
        superOnly: true,
        badge: 'Root',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      },
    ],
  },
  {
    title: 'PLATFORM OPERATIONS',
    items: [
      {
        id: 'notifications',
        number: '11',
        title: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        badge: '3',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      },
      {
        id: 'support',
        number: '12',
        title: 'Support & Reports',
        href: '/dashboard/support',
        icon: LifeBuoy,
        badge: '12 open',
      },
      {
        id: 'analytics',
        number: '13',
        title: 'Analytics & Reports',
        href: '/dashboard/analytics',
        icon: BarChart3,
      },
      {
        id: 'activity-logs',
        number: '14',
        title: 'Activity Logs',
        href: '/dashboard/activity-logs',
        icon: ScrollText,
      },
    ],
  },
  {
    title: 'SYSTEM CONTROL',
    items: [
      {
        id: 'roles-permissions',
        number: '15',
        title: 'Roles & Permissions',
        href: '/dashboard/roles-permissions',
        icon: ShieldCheck,
        superOnly: true,
      },
      {
        id: 'billing',
        number: '16',
        title: 'Billing & Subscriptions',
        href: '/dashboard/billing',
        icon: CreditCard,
        superOnly: true,
      },
      {
        id: 'integrations',
        number: '17',
        title: 'Integrations',
        href: '/dashboard/integrations',
        icon: Cpu,
        superOnly: true,
      },
      {
        id: 'settings',
        number: '18',
        title: 'Platform Settings',
        href: '/dashboard/settings',
        icon: Settings2,
        superOnly: true,
      },
      {
        id: 'security',
        number: '19',
        title: 'Security & Access',
        href: '/dashboard/security',
        icon: Lock,
        superOnly: true,
      },
    ],
  },
];

export function AdminPortalShell({
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
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

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
    : 'AD';

  const isCurrentRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Filter sections by search query and role access
  const filteredSections = useMemo(() => {
    const query = sidebarSearch.trim().toLowerCase();

    return NAV_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        if (item.superOnly && !isSuperAdmin) {
          return false;
        }
        if (!query) return true;
        return (
          item.title.toLowerCase().includes(query) ||
          item.number.includes(query) ||
          section.title?.toLowerCase().includes(query)
        );
      });

      return {
        ...section,
        items,
      };
    }).filter((section) => section.items.length > 0);
  }, [sidebarSearch, isSuperAdmin]);

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
        {/* Top: Brand Header & Search */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <Image
                src="/bidyago_logo.png"
                alt="BidyaGo"
                width={120}
                height={30}
                className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  isSuperAdmin
                    ? 'text-[#4b37df] bg-[#4b37df]/10 border-[#4b37df]/20'
                    : 'text-rose-700 bg-rose-50 border-rose-200'
                }`}
              >
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search inside Sidebar */}
          <div className="px-3.5 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Jump to (e.g. 02, billing)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl placeholder:text-slate-400 text-slate-900 focus:outline-hidden focus:border-[#4b37df] focus:bg-white focus:ring-1 focus:ring-[#4b37df] transition-all"
              />
              {sidebarSearch && (
                <button
                  type="button"
                  onClick={() => setSidebarSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links Scroll Container */}
          <nav className="px-3 py-3 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
            {filteredSections.map((section, idx) => (
              <div key={section.title || `section-${idx}`} className="space-y-0.5">
                {section.title && (
                  <div className="px-3 pt-1 pb-1 flex items-center justify-between">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      {section.title}
                    </p>
                    {section.title === 'SYSTEM CONTROL' && (
                      <span className="text-[9px] font-semibold text-[#4b37df] bg-[#4b37df]/10 border border-[#4b37df]/20 px-1.5 py-0.2 rounded-md">
                        SUPER
                      </span>
                    )}
                  </div>
                )}
                {section.items.map((item) => {
                  const active = isCurrentRoute(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                        active
                          ? 'bg-[#4b37df] text-white shadow-sm shadow-[#4b37df]/25 font-semibold'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`text-[10px] font-mono tracking-tight shrink-0 font-medium ${
                            active
                              ? 'text-white/80'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          {item.number}.
                        </span>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-slate-700'
                          }`}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium border truncate shrink-0 ${
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

            {/* Connected Portals Quick Switcher */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Connected Portals
              </p>
              <a
                href={getAppUrl('main', '/')}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-all"
              >
                <span>Student Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </a>
              <a
                href={getAppUrl('workspace', '/')}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-all"
              >
                <span>Partner Workspace</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </a>
            </div>
          </nav>
        </div>

        {/* Bottom: User Card & Sign Out */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2.5">
            <Link
              href={isSuperAdmin ? '/dashboard/super' : '/dashboard'}
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4b37df] to-[#6d5ae6] text-white text-xs font-semibold flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {session?.user?.name || (isSuperAdmin ? 'Super Admin' : 'Admin')}
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

      {/* Main Content Area */}
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
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search admin tools, scholarships, users..."
                className="w-full pl-9 pr-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:bg-white focus:ring-1 focus:ring-[#4b37df] transition-all"
              />
            </div>
          </div>

          {/* Right: Status Pill, Add Action, Notifications & Profile Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Platform Live • v2.4</span>
            </span>

            <Link
              href="/dashboard/scholarships"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scholarship</span>
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
                    <span className="text-xs font-semibold text-slate-900">Admin Alerts</span>
                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] text-[#4b37df] hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-100">
                      <p className="font-medium text-amber-950">6 Organization Applications Pending</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">Consultancies waiting for credential verification.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                      <p className="font-medium text-purple-950">MEXT Scholarship Intake Active</p>
                      <p className="text-[11px] text-purple-700 mt-0.5">142 students submitted inquiries today.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <Link
              href={isSuperAdmin ? '/dashboard/super' : '/dashboard'}
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium flex items-center justify-center transition-colors shadow-2xs"
              title={isSuperAdmin ? 'Super Admin Management' : 'Admin Profile'}
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
