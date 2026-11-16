'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { PublicScholarship } from '@/lib/scholarships';
import ScholarshipCard from '@/components/ScholarshipCard';

interface FeaturedScholarshipsSectionProps {
  searchQuery?: string;
  selectedDegree?: string;
}

export default function FeaturedScholarshipsSection({
  searchQuery = '',
  selectedDegree = 'all',
}: FeaturedScholarshipsSectionProps) {
  const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bidyago_saved_scholarships');
      if (stored) setSavedIds(JSON.parse(stored));
    } catch {
      // Ignore
    }

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch('/api/scholarships');
        if (res.ok) {
          const json = await res.json();
          setScholarships(json.scholarships || []);
        }
      } catch (err) {
        console.error('Failed to load featured scholarships', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleSave = (id: string, slug: string) => {
    setSavedIds((prev) => {
      const isAlready = prev.includes(id) || prev.includes(slug);
      const next = isAlready
        ? prev.filter((item) => item !== id && item !== slug)
        : [...prev, slug || id];
      try {
        localStorage.setItem('bidyago_saved_scholarships', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const categories = [
    'All',
    'Government',
    'Merit-based',
    'Fully Funded',
    'Research',
    'University',
  ];

  const filtered = useMemo(() => {
    return scholarships.filter((sch) => {
      // Category filter
      if (activeCategory !== 'All') {
        const catLower = activeCategory.toLowerCase();
        const matchesCategory =
          sch.categories?.some((c) => c.toLowerCase().includes(catLower)) ||
          sch.providerType?.toLowerCase().includes(catLower) ||
          (catLower === 'fully funded' && sch.fundingClassification === 'FULLY_FUNDED');
        if (!matchesCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          sch.title?.toLowerCase().includes(q) ||
          sch.provider?.toLowerCase().includes(q) ||
          sch.destinationCountries?.some((c) => c.toLowerCase().includes(q)) ||
          sch.fieldsOfStudy?.some((f) => f.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Degree filter
      if (selectedDegree !== 'all') {
        const degLower = selectedDegree.toLowerCase();
        const matchDegree = sch.academicLevels?.some((d) =>
          d.toLowerCase().includes(degLower)
        );
        if (!matchDegree) return false;
      }

      return true;
    });
  }, [scholarships, activeCategory, searchQuery, selectedDegree]);

  return (
    <section id="scholarships" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-normal text-slate-400 uppercase tracking-widest block mb-2">
              Verified Directory
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight">
              Featured Scholarships & Fellowships
            </h2>
            <p className="mt-2 text-base text-slate-500 font-normal max-w-xl">
              100% verified government and embassy programs offering direct financial backing, tuition
              coverage, and living stipends for Nepali and international applicants.
            </p>
          </div>

          {/* Minimalist Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 text-[#4b37df] animate-spin" />
            <p className="text-xs text-slate-400 font-light">Loading verified scholarships...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <ScholarshipCard
                key={item.id}
                scholarship={item}
                savedIds={savedIds}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-500 font-normal">
              No scholarships found matching your criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
              }}
              className="mt-3 text-xs text-[#4b37df] hover:underline font-normal cursor-pointer"
            >
              Reset Category
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
