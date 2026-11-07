'use client';

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Mail,
  GraduationCap,
} from 'lucide-react';

interface StudentDirectoryItem {
  id: string;
  name: string;
  email: string;
  education: string;
  targetCountry: string;
  emailVerified: boolean;
  profileReadiness: number;
  registeredDate: string;
}

const SAMPLE_STUDENTS: StudentDirectoryItem[] = [
  { id: 'STU-101', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', education: "Bachelor's (TU, Nepal)", targetCountry: 'Japan 🇯🇵', emailVerified: true, profileReadiness: 94, registeredDate: 'Oct 28, 2026' },
  { id: 'STU-102', name: 'Pranisha Shrestha', email: 'pranisha.s@outlook.com', education: "+2 Science (St. Xavier's)", targetCountry: 'Australia 🇦🇺', emailVerified: true, profileReadiness: 88, registeredDate: 'Oct 29, 2026' },
  { id: 'STU-103', name: 'Rohan Thapa', email: 'rohan.t99@mailinator.com', education: 'Diploma in IT', targetCountry: 'South Korea 🇰🇷', emailVerified: true, profileReadiness: 72, registeredDate: 'Nov 01, 2026' },
  { id: 'STU-104', name: 'Sujata Adhikari', email: 'sujata.adh@gmail.com', education: "Master's in Public Health", targetCountry: 'United Kingdom 🇬🇧', emailVerified: false, profileReadiness: 45, registeredDate: 'Nov 04, 2026' },
];

export default function AdminStudentsPage() {
  const [students] = useState<StudentDirectoryItem[]>(SAMPLE_STUDENTS);
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900">
          Student Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review registered scholars, check email verification status, and monitor profile completion rates.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Education Level</th>
                <th className="py-3 px-4">Preferred Destination</th>
                <th className="py-3 px-4">Email Status</th>
                <th className="py-3 px-4">Profile Readiness</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      <div className="flex items-center gap-1.5 text-slate-400 font-normal text-[11px] mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{item.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      {item.education}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{item.targetCountry}</td>
                  <td className="py-3.5 px-4">
                    {item.emailVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4b37df] to-emerald-500 rounded-full"
                          style={{ width: `${item.profileReadiness}%` }}
                        />
                      </div>
                      <span className="font-medium text-slate-700 text-[11px]">{item.profileReadiness}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                    {item.registeredDate}
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
