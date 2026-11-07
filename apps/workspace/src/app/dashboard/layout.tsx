import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { requireRole } from '@/lib/auth/session';
import { WorkspaceSidebarNav } from '@/components/WorkspaceSidebarNav';

export default async function WorkspaceDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(['COLLEGE', 'CONSULTANCY']);
  const isCollege = session.user.role === 'COLLEGE';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Partner Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3 focus:outline-hidden">
              <Image
                src="/bidyago_logo.png"
                alt="BidyaGo"
                width={130}
                height={34}
                className="h-8 w-auto object-contain brightness-0 invert"
                priority
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isCollege
                  ? 'bg-blue-900/60 border-blue-700 text-blue-300'
                  : 'bg-purple-900/60 border-purple-700 text-purple-300'
              }`}>
                {isCollege ? 'University Liaison' : 'Consultancy Workspace'}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">{session.user.name}</span>
              <span className="text-[10px] text-slate-400">{session.user.email}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-purple-300">
              {session.user.name ? session.user.name.slice(0, 2).toUpperCase() : 'OR'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar Navigation */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <WorkspaceSidebarNav isCollege={isCollege} />
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} BidyaGo Partner Workspace. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

