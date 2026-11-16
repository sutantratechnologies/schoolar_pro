'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Eye,
  BookOpen,
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

export default function GuidesContentPage() {
  const [guides] = useState<ArticleGuide[]>([]);
  const [search, setSearch] = useState('');

  const filtered = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.destination.toLowerCase().includes(search.toLowerCase())
  );

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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Article / Guide</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides by title, category, or country..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-3 font-semibold">Title & Category</th>
                  <th className="pb-3 font-semibold">Country</th>
                  <th className="pb-3 font-semibold">Author</th>
                  <th className="pb-3 font-semibold">Views</th>
                  <th className="pb-3 font-semibold">Updated</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((guide) => (
                  <tr key={guide.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-semibold text-slate-900">{guide.title}</div>
                      <div className="text-[11px] text-purple-600">{guide.category}</div>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-700">{guide.destination}</td>
                    <td className="py-3.5 pr-3 text-slate-500">{guide.author}</td>
                    <td className="py-3.5 pr-3 font-mono font-medium text-slate-900">
                      {guide.views.toLocaleString()}
                    </td>
                    <td className="py-3.5 pr-3 text-slate-400 text-[11px]">{guide.lastUpdated}</td>
                    <td className="py-3.5 pr-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          guide.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : guide.status === 'DRAFT'
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {guide.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Preview Guide"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-800">No Articles or Guides Yet</h4>
            <p className="text-xs text-slate-400 font-light max-w-sm mx-auto">
              Publish scholarship advisories, visa guidelines, and SOP documentation manuals for students.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
