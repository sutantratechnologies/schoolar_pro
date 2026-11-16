'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  GraduationCap,
  LayoutGrid,
  List,
  ExternalLink,
  X,
} from 'lucide-react';
import { getCountryFlag } from '@/lib/countries';

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: string;
  programsOffered: number;
  partnershipType: 'DIRECT_PARTNER' | 'LISTED_GLOBAL' | 'SCHOLARSHIP_HOST';
  verified: boolean;
  coverImage: string;
  website?: string;
  description?: string;
}

const SAMPLE_INSTITUTIONS: University[] = [
  {
    id: 'UNI-TODAI',
    name: 'The University of Tokyo (UTokyo)',
    country: 'Japan',
    city: 'Tokyo',
    ranking: '#28 Global (QS)',
    programsOffered: 140,
    partnershipType: 'SCHOLARSHIP_HOST',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
    website: 'https://www.u-tokyo.ac.jp/en/',
    description: 'Premier national research university in Japan, primary destination for MEXT scholars.',
  },
  {
    id: 'UNI-KYODAI',
    name: 'Kyoto University',
    country: 'Japan',
    city: 'Kyoto',
    ranking: '#46 Global (QS)',
    programsOffered: 95,
    partnershipType: 'SCHOLARSHIP_HOST',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    website: 'https://www.kyoto-u.ac.jp/en',
    description: 'World-renowned for scientific innovation, Nobel laureates, and Asian research consortia.',
  },
  {
    id: 'UNI-UNIMELB',
    name: 'The University of Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    ranking: '#13 Global (QS)',
    programsOffered: 210,
    partnershipType: 'DIRECT_PARTNER',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    website: 'https://www.unimelb.edu.au',
    description: 'Australia’s top-ranked comprehensive university with high visa and work entitlement ratings.',
  },
  {
    id: 'UNI-SNU',
    name: 'Seoul National University',
    country: 'South Korea',
    city: 'Seoul',
    ranking: '#41 Global (QS)',
    programsOffered: 88,
    partnershipType: 'SCHOLARSHIP_HOST',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop',
    website: 'https://en.snu.ac.kr',
    description: 'Flagship national university of Korea, host to hundreds of GKS scholarship candidates.',
  },
  {
    id: 'UNI-OXFORD',
    name: 'University of Oxford',
    country: 'United Kingdom',
    city: 'Oxford',
    ranking: '#3 Global (QS)',
    programsOffered: 350,
    partnershipType: 'LISTED_GLOBAL',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?q=80&w=800&auto=format&fit=crop',
    website: 'https://www.ox.ac.uk',
    description: 'Oldest university in the English-speaking world, world-leading collegiate research institution.',
  },
  {
    id: 'UNI-HARVARD',
    name: 'Harvard University',
    country: 'United States',
    city: 'Cambridge, MA',
    ranking: '#4 Global (QS)',
    programsOffered: 280,
    partnershipType: 'LISTED_GLOBAL',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1576495199011-ef9030c20c18?q=80&w=800&auto=format&fit=crop',
    website: 'https://www.harvard.edu',
    description: 'Ivy League research power offering need-blind and merit-based global graduate assistance.',
  },
  {
    id: 'UNI-TUM',
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    city: 'Munich',
    ranking: '#28 Global (QS)',
    programsOffered: 178,
    partnershipType: 'SCHOLARSHIP_HOST',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=800&auto=format&fit=crop',
    website: 'https://www.tum.de/en/',
    description: 'Europe’s top technical university, featuring tuition-free and DAAD supported master programs.',
  },
  {
    id: 'UNI-TORONTO',
    name: 'University of Toronto',
    country: 'Canada',
    city: 'Toronto',
    ranking: '#21 Global (QS)',
    programsOffered: 260,
    partnershipType: 'DIRECT_PARTNER',
    verified: true,
    coverImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=800&auto=format&fit=crop',
    website: 'https://www.utoronto.ca',
    description: 'Canada’s leading academic institution, sponsor of Lester B. Pearson International Scholarships.',
  },
];

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<University[]>(SAMPLE_INSTITUTIONS);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUni, setNewUni] = useState({
    name: '',
    country: 'Japan',
    city: '',
    ranking: '#50 Global (QS)',
    programsOffered: 50,
    partnershipType: 'SCHOLARSHIP_HOST' as University['partnershipType'],
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
    website: '',
    description: '',
  });

  const filtered = useMemo(() => {
    return institutions.filter((u) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.ranking.toLowerCase().includes(q)
      );
    });
  }, [institutions, search]);

  const handleAddInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUni.name.trim()) return;

    const created: University = {
      id: `UNI-${Date.now().toString().slice(-4)}`,
      name: newUni.name,
      country: newUni.country,
      city: newUni.city,
      ranking: newUni.ranking,
      programsOffered: Number(newUni.programsOffered) || 1,
      partnershipType: newUni.partnershipType,
      verified: true,
      coverImage: newUni.coverImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
      website: newUni.website,
      description: newUni.description,
    };

    setInstitutions([created, ...institutions]);
    setShowAddModal(false);
    setNewUni({
      name: '',
      country: 'Japan',
      city: '',
      ranking: '#50 Global (QS)',
      programsOffered: 50,
      partnershipType: 'SCHOLARSHIP_HOST',
      coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
      website: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              06
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
              Colleges & Universities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official registry of partner universities, global scholarship host colleges, and academic institutions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add College</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges by name, country, city, or global ranking..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#4b37df]/20 focus:border-[#4b37df]"
            />
          </div>

          <div className="text-xs text-slate-500 whitespace-nowrap">
            Showing <strong className="text-slate-900 font-semibold">{filtered.length}</strong> institutions
          </div>
        </div>
      </div>

      {/* CARDS VIEW */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((u) => {
            const flag = getCountryFlag(u.country);
            return (
              <div
                key={u.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all group flex flex-col justify-between"
              >
                {/* College Cover Image Banner */}
                <div>
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={u.coverImage}
                      alt={u.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Floating Flag & Location */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-semibold shadow-xs">
                      <span>{flag}</span>
                      <span>{u.city}, {u.country}</span>
                    </div>

                    {/* Verified Badge */}
                    {u.verified && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}

                    {/* Ranking Badge on cover bottom */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#4b37df] text-white shadow-xs">
                        {u.ranking}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#4b37df] transition-colors line-clamp-2">
                        {u.name}
                      </h3>
                      <p className="font-mono text-[10px] text-slate-400">{u.id}</p>
                    </div>

                    {u.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {u.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1 text-slate-600">
                        <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="font-semibold text-slate-900">{u.programsOffered}</span> Programs
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                        {u.partnershipType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  {u.website && (
                    <a
                      href={u.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => alert(`Managing programs for ${u.name}`)}
                    className="flex-1 py-2 text-center text-xs font-semibold text-white bg-slate-900 hover:bg-[#4b37df] rounded-xl transition-colors cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">College / University</th>
                  <th className="py-3.5 px-4">Country & City</th>
                  <th className="py-3.5 px-4">Global Ranking</th>
                  <th className="py-3.5 px-4">Academic Programs</th>
                  <th className="py-3.5 px-4">Partnership Model</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const flag = getCountryFlag(u.country);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.coverImage}
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{u.name}</span>
                              {u.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400">{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span>{flag}</span>
                          <span>{u.city}, {u.country}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{u.ranking}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-purple-700">{u.programsOffered}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                          {u.partnershipType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => alert(`Managing programs for ${u.name}`)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add College Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Add New College / Institution</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddInstitution} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  College / University Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUni.name}
                  onChange={(e) => setNewUni({ ...newUni, name: e.target.value })}
                  placeholder="e.g. Stanford University"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={newUni.country}
                    onChange={(e) => setNewUni({ ...newUni, country: e.target.value })}
                    placeholder="e.g. United States"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newUni.city}
                    onChange={(e) => setNewUni({ ...newUni, city: e.target.value })}
                    placeholder="e.g. Stanford, CA"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">QS World Ranking</label>
                  <input
                    type="text"
                    value={newUni.ranking}
                    onChange={(e) => setNewUni({ ...newUni, ranking: e.target.value })}
                    placeholder="e.g. #5 Global (QS)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Programs Offered</label>
                  <input
                    type="number"
                    value={newUni.programsOffered}
                    onChange={(e) => setNewUni({ ...newUni, programsOffered: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Campus Cover Image URL
                </label>
                <input
                  type="url"
                  value={newUni.coverImage}
                  onChange={(e) => setNewUni({ ...newUni, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
                <input
                  type="url"
                  value={newUni.website}
                  onChange={(e) => setNewUni({ ...newUni, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Partnership Model</label>
                <select
                  value={newUni.partnershipType}
                  onChange={(e) => setNewUni({ ...newUni, partnershipType: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white"
                >
                  <option value="SCHOLARSHIP_HOST">SCHOLARSHIP_HOST</option>
                  <option value="DIRECT_PARTNER">DIRECT_PARTNER</option>
                  <option value="LISTED_GLOBAL">LISTED_GLOBAL</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-[#4b37df] text-white font-medium cursor-pointer shadow-xs"
                >
                  Save College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
