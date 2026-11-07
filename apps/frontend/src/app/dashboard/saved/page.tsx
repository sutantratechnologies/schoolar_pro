'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  ExternalLink,
  Trash2,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
interface SavedScholarship {
  id: string;
  title: string;
  provider: string;
  country: string;
  countryCode: string;
  flag: string;
  degreeLevel: string[];
  fundingType: string;
  coverage: string[];
  deadline: string;
  deadlineDate: string;
  isOpen: boolean;
  isVerified: boolean;
  verificationSource: string;
  officialUrl: string;
  description: string;
  requirements: string[];
  tags: string[];
  academicFields: string[];
}

const INITIAL_SAVED_SCHOLARSHIPS: SavedScholarship[] = [
  {
    id: 'mext-japan-2026',
    title: 'MEXT Research & Graduate Scholarship',
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT)',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    degreeLevel: ['masters', 'phd'],
    fundingType: 'fully_funded',
    coverage: ['100% Tuition Waiver', 'Monthly Stipend: ¥144,000 (~$960/mo)', 'Round-trip Airfare', 'No Application Fee'],
    deadline: 'May 2026',
    deadlineDate: '2026-05-15',
    isOpen: true,
    isVerified: true,
    verificationSource: 'Official Embassy of Japan in Kathmandu',
    officialUrl: 'https://www.np.emb-japan.go.jp/itpr_en/scholarship.html',
    description: 'Premier Japanese government fellowship covering complete tuition, monthly living allowance, and round-trip flights from Kathmandu to Japan.',
    requirements: ['Under 35 years old', 'Bachelor degree with minimum 65%', 'English or Japanese proficiency'],
    tags: ['Government', 'Fully Funded', 'Research'],
    academicFields: ['Computer Science', 'Engineering', 'Natural Sciences', 'Social Sciences'],
  },
  {
    id: 'chevening-uk-2026',
    title: 'UK Chevening Scholarship 2026/27',
    provider: 'Foreign, Commonwealth & Development Office (UK FCDO)',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    degreeLevel: ['masters'],
    fundingType: 'fully_funded',
    coverage: ['Full University Tuition Fees', 'Monthly Living Allowance (~£1,350/mo)', 'Economy Travel to/from UK', 'Arrival & Visa Allowance'],
    deadline: 'Nov 2026',
    deadlineDate: '2026-11-04',
    isOpen: true,
    isVerified: true,
    verificationSource: 'British Embassy Kathmandu & Official Chevening Portal',
    officialUrl: 'https://www.chevening.org/scholarship/nepal/',
    description: 'Prestigious UK government international awards programme aimed at developing global leaders across all one-year Master’s courses.',
    requirements: ['Undergraduate degree equivalent to upper second-class 2:1', 'Minimum 2 years of work experience (2,800 hours)', 'Return to Nepal for min 2 years'],
    tags: ['Leadership', 'One-year Masters', 'FCDO'],
    academicFields: ['Public Policy', 'Development Studies', 'Data Science', 'Law', 'Economics'],
  },
  {
    id: 'australia-awards-2026',
    title: 'Australia Awards Scholarships - Intake 2026',
    provider: 'Department of Foreign Affairs and Trade (DFAT)',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    degreeLevel: ['masters'],
    fundingType: 'fully_funded',
    coverage: ['Full Tuition Fees', 'Return Air Travel', 'Establishment Allowance', 'Contribution to Living Expenses (CLE)', 'Overseas Student Health Cover (OSHC)'],
    deadline: 'April 2026',
    deadlineDate: '2026-04-30',
    isOpen: true,
    isVerified: true,
    verificationSource: 'Australian Embassy Nepal / DFAT Official',
    officialUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards',
    description: 'Long-term awards administered by the Australian Government offering study, research, and professional development in priority sectors.',
    requirements: ['Nepali citizen currently residing in Nepal', 'Minimum 3 years relevant work experience', 'IELTS 6.5 or equivalent'],
    tags: ['DFAT', 'Development', 'Priority Sectors'],
    academicFields: ['Education', 'Environmental Science', 'Healthcare', 'Infrastructure'],
  },
  {
    id: 'daad-germany-epos',
    title: 'DAAD EPOS Development-Related Postgraduate Courses',
    provider: 'German Academic Exchange Service (DAAD)',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    degreeLevel: ['masters', 'phd'],
    fundingType: 'fully_funded',
    coverage: ['Full Tuition (Free at German Public Universities)', 'Monthly Stipend: €934', 'Health, Accident & Personal Liability Insurance', 'Travel Allowance'],
    deadline: 'Varies by University (Aug - Dec 2026)',
    deadlineDate: '2026-10-31',
    isOpen: true,
    isVerified: true,
    verificationSource: 'DAAD Regional Office & Official Scholarship Database',
    officialUrl: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/',
    description: 'Scholarships for postgraduate training of foreign professionals from developing countries at German higher education institutions.',
    requirements: ['Bachelor degree completed within last 6 years', 'At least 2 years of professional experience', 'English or German proficiency'],
    tags: ['DAAD', 'Public Universities', 'Zero Tuition'],
    academicFields: ['Renewable Energy', 'Urban Planning', 'Public Health', 'Water Management'],
  },
];

export default function SavedScholarshipsPage() {
  const [savedList, setSavedList] = useState<SavedScholarship[]>(INITIAL_SAVED_SCHOLARSHIPS);
  const [countryFilter, setCountryFilter] = useState('all');
  const [removedAlert, setRemovedAlert] = useState<string | null>(null);

  const handleRemove = (id: string, title: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
    setRemovedAlert(`Removed "${title}" from your saved list`);
    setTimeout(() => setRemovedAlert(null), 3000);
  };

  const filtered = savedList.filter((item) => {
    if (countryFilter !== 'all' && item.country.toLowerCase() !== countryFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">
      {/* Title & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light text-slate-900">Saved Scholarships & Grants</h1>
            <p className="text-xs text-slate-500 mt-1">
              Keep track of verified official government scholarships, application cycles, and deadline reminders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Filter saved scholarships by destination"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 focus:outline-hidden"
              >
                <option value="all">All Destinations</option>
                <option value="japan">Japan 🇯🇵</option>
                <option value="united kingdom">United Kingdom 🇬🇧</option>
                <option value="australia">Australia 🇦🇺</option>
                <option value="germany">Germany 🇩🇪</option>
              </select>
            </div>

            <Link
              href="/scholarships"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4b37df] text-white text-xs font-normal rounded-full hover:bg-[#3d2cb8] transition-colors"
            >
              <span>+ Add More</span>
            </Link>
          </div>
        </div>

        {removedAlert && (
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-center justify-between">
            <span>{removedAlert}</span>
            <button
              onClick={() => setRemovedAlert(null)}
              className="text-amber-600 hover:text-amber-900 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Scholarships List */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No saved scholarships in this category</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Explore our directory of 100% verified embassy and government grant opportunities to bookmark your top options.
            </p>
            <div className="pt-2">
              <Link
                href="/scholarships"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-normal rounded-full hover:bg-slate-800"
              >
                <span>Browse Scholarships</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base">{item.flag}</span>
                    <span className="text-xs font-medium text-slate-700">{item.country}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      {item.fundingType === 'fully_funded' ? 'Fully Funded' : 'Tuition Waiver'}
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Deadline: {item.deadline}
                    </span>
                  </div>

                  <h3 className="text-base font-medium text-slate-900 hover:text-[#4b37df] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] text-slate-500">{item.verificationSource}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-normal rounded-full hover:bg-slate-800 transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <Link
                    href="/dashboard/applications"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <span>Track</span>
                  </Link>

                  <button
                    onClick={() => handleRemove(item.id, item.title)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                    title="Remove from saved"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
