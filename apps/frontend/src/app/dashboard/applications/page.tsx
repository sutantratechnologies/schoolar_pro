'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  FileText,
} from 'lucide-react';

interface ApplicationItem {
  id: string;
  scholarshipTitle: string;
  country: string;
  flag: string;
  universityOrBody: string;
  stage: 'Drafting Documents' | 'Submitted to Embassy' | 'Interview Scheduled' | 'Award Finalized';
  stageColor: string;
  deadline: string;
  progressPercent: number;
  checklist: {
    title: string;
    completed: boolean;
  }[];
  officialPortal: string;
  notes: string;
}

const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-mext-2026',
    scholarshipTitle: 'MEXT Research & Graduate Scholarship 2026',
    country: 'Japan',
    flag: '🇯🇵',
    universityOrBody: 'Embassy of Japan in Nepal',
    stage: 'Drafting Documents',
    stageColor: 'bg-amber-50 text-amber-800 border-amber-200',
    deadline: 'May 15, 2026',
    progressPercent: 65,
    checklist: [
      { title: 'Statement of Purpose (Field of Study & Research Plan)', completed: true },
      { title: 'Certified Academic Transcripts & Degree Certificates', completed: true },
      { title: 'Letters of Recommendation (Dean/Academic Advisor)', completed: true },
      { title: 'Medical Certificate from Registered Hospital', completed: false },
      { title: 'Direct Physical Submission at Embassy in Panipokhari, Kathmandu', completed: false },
    ],
    officialPortal: 'https://www.np.emb-japan.go.jp/itpr_en/scholarship.html',
    notes: 'Research plan verified with university advisor. Awaiting final health check clearance from accredited hospital.',
  },
  {
    id: 'app-chevening-2026',
    scholarshipTitle: 'UK Chevening Scholarship 2026/27',
    country: 'United Kingdom',
    flag: '🇬🇧',
    universityOrBody: 'Foreign, Commonwealth & Development Office',
    stage: 'Drafting Documents',
    stageColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    deadline: 'November 4, 2026',
    progressPercent: 40,
    checklist: [
      { title: 'Leadership & Influence Essay (500 words)', completed: true },
      { title: 'Networking & Relationship Building Essay (500 words)', completed: true },
      { title: 'Studying in the UK & University Course Selection (500 words)', completed: false },
      { title: 'Post-study Career Plan Essay (500 words)', completed: false },
      { title: 'Proof of 2,800 Hours Work Experience', completed: false },
    ],
    officialPortal: 'https://www.chevening.org/scholarship/nepal/',
    notes: 'Drafting course selection rationale for 3 eligible Master courses in University of Edinburgh, Manchester, and Leeds.',
  },
];

export default function ApplicationsTrackerPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>('app-mext-2026');

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const toggleChecklist = (appId: string, checkIndex: number) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const updatedChecklist = [...app.checklist];
        updatedChecklist[checkIndex] = {
          ...updatedChecklist[checkIndex],
          completed: !updatedChecklist[checkIndex].completed,
        };
        const completedCount = updatedChecklist.filter((c) => c.completed).length;
        const newPercent = Math.round((completedCount / updatedChecklist.length) * 100);

        return {
          ...app,
          checklist: updatedChecklist,
          progressPercent: newPercent,
        };
      })
    );
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-light text-slate-900">Application Milestones & Checklist</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track document preparation, embassy deadlines, and submission milestones for your prospective scholarships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications Sidebar List */}
          <div className="space-y-3">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-1">
              Active Applications
            </div>

            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedAppId === app.id
                    ? 'bg-white border-[#4b37df] shadow-xs ring-1 ring-[#4b37df]/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{app.flag}</span>
                    <span className="text-xs font-medium text-slate-900">{app.country}</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${app.stageColor}`}>
                    {app.stage}
                  </span>
                </div>

                <div className="text-sm font-medium text-slate-900 line-clamp-1">
                  {app.scholarshipTitle}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Due {app.deadline}
                  </span>
                  <span className="font-medium text-slate-700">{app.progressPercent}%</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-[#4b37df] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${app.progressPercent}%` }}
                  />
                </div>
              </button>
            ))}

            <Link
              href="/scholarships"
              className="w-full p-4 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 bg-white/50 hover:bg-white text-slate-600 flex items-center justify-center gap-2 text-xs font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Track Another Scholarship</span>
            </Link>
          </div>

          {/* Application Detail View */}
          <div className="lg:col-span-2 space-y-6">
            {selectedApp && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedApp.flag}</span>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {selectedApp.country} • {selectedApp.universityOrBody}
                      </span>
                    </div>
                    <h2 className="text-xl font-medium text-slate-900">{selectedApp.scholarshipTitle}</h2>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Deadline: {selectedApp.deadline}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">Verified Government Track</span>
                    </div>
                  </div>

                  <a
                    href={selectedApp.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-normal rounded-full hover:bg-slate-800 transition-colors self-start"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-2">
                    <span>Document Checklist Completion</span>
                    <span className="text-[#4b37df] font-semibold">{selectedApp.progressPercent}% Ready</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#4b37df] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedApp.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Application Checklist (Click to toggle)
                  </h3>
                  <div className="space-y-2">
                    {selectedApp.checklist.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleChecklist(selectedApp.id, idx)}
                        className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                          item.completed
                            ? 'bg-slate-50 border-slate-200 text-slate-700'
                            : 'bg-white border-slate-200/80 text-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <div className="pt-0.5">
                          <CheckCircle2
                            className={`w-4 h-4 transition-colors ${
                              item.completed ? 'text-emerald-600 fill-emerald-50' : 'text-slate-300'
                            }`}
                          />
                        </div>
                        <div className="flex-1 text-xs">
                          <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                            {item.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Candidate Notes */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Candidate Notes & Action Plan</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedApp.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
