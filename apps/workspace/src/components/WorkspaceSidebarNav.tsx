'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  ExternalLink,
  UserPlus,
  FileCheck,
} from 'lucide-react';
import { authClient } from '@/lib/auth';

interface WorkspaceSidebarNavProps {
  isCollege: boolean;
}

export function WorkspaceSidebarNav({ isCollege }: WorkspaceSidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace('/login');
  };

  const navItems = isCollege
    ? [
        {
          title: 'Admissions & Quotas',
          href: '/dashboard/college',
          icon: LayoutDashboard,
          active: pathname.startsWith('/dashboard/college'),
        },
        {
          title: 'Scholarship Grants',
          href: '/dashboard/college#programs',
          icon: GraduationCap,
          active: false,
        },
        {
          title: 'Applicant Leads',
          href: '/dashboard/college#leads',
          icon: Users,
          active: false,
        },
      ]
    : [
        {
          title: 'Consulting Pipeline',
          href: '/dashboard/consultancy',
          icon: LayoutDashboard,
          active: pathname.startsWith('/dashboard/consultancy'),
        },
        {
          title: 'Student Document Vault',
          href: '/dashboard/consultancy#vault',
          icon: FileCheck,
          active: false,
        },
        {
          title: 'Visa & Embassies',
          href: '/dashboard/consultancy#visas',
          icon: GraduationCap,
          active: false,
        },
      ];

  // Common items
  const commonItems = [
    {
      title: 'Team & Staff',
      href: '/dashboard/team',
      icon: UserPlus,
      active: pathname.startsWith('/dashboard/team'),
    },
    {
      title: 'Organization Profile',
      href: '/dashboard/settings',
      icon: Settings,
      active: pathname.startsWith('/dashboard/settings'),
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-6">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          {isCollege ? 'University Portal' : 'Agency Workspace'}
        </p>
        {[...navItems, ...commonItems].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                item.active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Platform Links
        </p>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <span>Student Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

