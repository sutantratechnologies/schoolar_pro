'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
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
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-200 font-semibold',
      },
      {
        id: 'admin-management',
        number: '10',
        title: 'Admin Management',
        href: '/dashboard/super',
        icon: UserCog,
        superOnly: true,
        badge: 'Root',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
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
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
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

interface AdminSidebarNavProps {
  isSuperAdmin: boolean;
}

export function AdminSidebarNav({ isSuperAdmin }: AdminSidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace('/login');
  };

  // Filter sections by search query and role access
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return NAV_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        // Enforce Super Admin visibility
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
  }, [searchQuery, isSuperAdmin]);

  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
      {/* Brand Header Inside Sidebar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 text-purple-300 flex items-center justify-center font-bold text-sm tracking-tight shadow-inner">
            BY
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider uppercase text-slate-200">
              BIDYAGO
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-purple-300">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </div>

        {isSuperAdmin && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/60 text-[10px] font-bold uppercase tracking-wider text-purple-300">
            <ShieldAlert className="w-3 h-3 text-purple-400" />
            Root
          </span>
        )}
      </div>

      {/* Quick Search */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick jump (e.g. 02, billing)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="p-3 space-y-5 max-h-[calc(100vh-18rem)] overflow-y-auto overscroll-contain">
        {filteredSections.map((section, idx) => (
          <div key={section.title || `section-${idx}`} className="space-y-1">
            {section.title && (
              <div className="px-3 pt-1 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </span>
                {section.title === 'SYSTEM CONTROL' && (
                  <span className="text-[9px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-100">
                    SUPER
                  </span>
                )}
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`text-[10px] font-mono tracking-tighter shrink-0 ${
                          active
                            ? 'text-purple-300 font-bold'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        {item.number}
                      </span>
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          active
                            ? 'text-purple-300'
                            : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                          active
                            ? 'bg-slate-800 text-purple-200 border-slate-700'
                            : item.badgeColor ||
                              'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400">
            No matching navigation items found.
          </div>
        )}
      </div>

      {/* External Subdomain Portals */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/40 space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Connected Applications
        </p>
        <a
          href={getAppUrl('main', '/')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200/80"
        >
          <span>Student Portal</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
        <a
          href={getAppUrl('workspace', '/')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200/80"
        >
          <span>Partner Workspace</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Sign Out Action */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Super Admin</span>
        </button>
      </div>
    </nav>
  );
}
