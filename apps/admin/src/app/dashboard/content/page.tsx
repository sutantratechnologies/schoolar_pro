'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Eye,
} from 'lucide-react';

interface ArticleGuide {
  id: string;
  title: string;
  category: string;
  destination: string;
  author: string;
  views: number;
  lastUpdated: string;
  status: 'PUBLISHED' | 'DRAFT' | 'REVIEW';
}

const SAMPLE_GUIDES: ArticleGuide[] = [
  {
    id: 'GUIDE-101',
    title: 'Complete Guide to MEXT Embassy Recommendation Scholarship 2027/2028',
    category: 'Scholarship Application',
    destination: 'Japan',
    author: 'Editorial Team',
    views: 14200,
    lastUpdated: 'Nov 02, 2026',
    status: 'PUBLISHED',
  },
  {
    id: 'GUIDE-102',
    title: 'How to Write a Winning Statement of Purpose (SOP) for Japanese Universities',
    category: 'Documentation',
    destination: 'Japan',
    author: 'Academic Counselors',
    views: 9850,
    lastUpdated: 'Oct 28, 2026',
    status: 'PUBLISHED',
  },
  {
    id: 'GUIDE-103',
    title: 'Australia Student Visa Subclass 500: Genuine Student (GS) Requirements Explained',
    category: 'Visa & Immigration',
    destination: 'Australia',
    author: 'Compliance Lead',
    views: 11300,
    lastUpdated: 'Nov 04, 2026',
    status: 'PUBLISHED',
  },
  {
    id: 'GUIDE-104',
    title: 'Global Korea Scholarship (GKS) Undergraduate Track Roadmap',
    category: 'Scholarship Application',
    destination: 'South Korea',
    author: 'Editorial Team',
    views: 6400,
    lastUpdated: 'Nov 06, 2026',
    status: 'DRAFT',
  },
];

export default function GuidesContentPage() {
  const [guides] = useState<ArticleGuide[]>(SAMPLE_GUIDES);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              05
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Guides & Content
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author scholarship advisories, visa guides, essay guidelines, and student documentation manuals.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Article / Guide</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides by title, category, or country..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3">Title & Category</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Readership</th>
                <th className="pb-3">Last Updated</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guides.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-4 max-w-sm">
                    <div className="font-semibold text-slate-900 line-clamp-1">{g.title}</div>
                    <div className="text-[10px] text-purple-700 font-medium">{g.category}</div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-700">{g.destination}</td>
                  <td className="py-3.5 pr-3 text-slate-500">{g.author}</td>
                  <td className="py-3.5 pr-3">
                    <span className="inline-flex items-center gap-1 text-slate-700 font-mono font-medium">
                      <Eye className="w-3 h-3 text-slate-400" />
                      {g.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-500">{g.lastUpdated}</td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        g.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
