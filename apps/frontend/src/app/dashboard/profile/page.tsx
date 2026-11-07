'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Globe2,
  DollarSign,
  Languages,
  Award,
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import {
  StudentProfile,
  EducationRecord,
  EducationLevel,
  FundingOption,
  Gender,
  PreferredContactMethod,
  INITIAL_STUDENT_PROFILE,
  calculateProfileReadiness,
} from '@/types/student-profile';
import {
  getStoredStudentProfile,
  saveStoredStudentProfile,
} from '@/lib/student-profile';

const POPULAR_DESTINATIONS = [
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Erasmus Mundus', flag: '🇪🇺' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' },
];

const SECTIONS = [
  { id: 'personal', label: 'A. Personal', icon: User, desc: 'Name, nationality & age' },
  { id: 'education', label: 'B. Education', icon: GraduationCap, desc: 'Degrees & GPA' },
  { id: 'study', label: 'C. Study Preferences', icon: Globe2, desc: 'Destinations & subjects' },
  { id: 'funding', label: 'D. Funding', icon: DollarSign, desc: 'Stipends & fee waivers' },
  { id: 'language', label: 'E. Languages', icon: Languages, desc: 'IELTS, TOEFL & JLPT' },
  { id: 'achievements', label: 'F. Achievements', icon: Award, desc: 'Research & work' },
  { id: 'readiness', label: 'G. Readiness', icon: FileText, desc: 'Transcripts & SOPs' },
];

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const loaded = getStoredStudentProfile();
    setProfile(loaded);
  }, []);

  const readinessScore = calculateProfileReadiness(profile);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoredStudentProfile(profile);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const toggleDestination = (dest: string) => {
    setProfile((prev) => {
      const exists = prev.studyPreferences.destinationCountries.includes(dest);
      const updated = exists
        ? prev.studyPreferences.destinationCountries.filter((d) => d !== dest)
        : [...prev.studyPreferences.destinationCountries, dest];
      return {
        ...prev,
        studyPreferences: {
          ...prev.studyPreferences,
          destinationCountries: updated,
        },
      };
    });
  };

  const handleAddEducation = () => {
    const newRecord: EducationRecord = {
      id: `edu-${Date.now()}`,
      level: 'plus_two',
      qualification: '',
      institution: '',
      fieldOfStudy: '',
      gpaOrPercentage: '',
      gradingSystem: 'percentage',
      graduationYear: '2020',
      isCurrentlyStudying: false,
    };
    setProfile((prev) => ({
      ...prev,
      educationRecords: [...prev.educationRecords, newRecord],
    }));
  };

  const handleRemoveEducation = (id: string) => {
    if (profile.educationRecords.length <= 1) return;
    setProfile((prev) => ({
      ...prev,
      educationRecords: prev.educationRecords.filter((rec) => rec.id !== id),
    }));
  };

  const handleUpdateEducation = (id: string, updates: Partial<EducationRecord>) => {
    setProfile((prev) => ({
      ...prev,
      educationRecords: prev.educationRecords.map((rec) =>
        rec.id === id ? { ...rec, ...updates } : rec
      ),
    }));
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 animate-fadeIn">
      {/* Top Profile Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4b37df] to-[#251590] text-white flex items-center justify-center text-xl font-medium shadow-xs shrink-0">
            {profile.personalInfo.fullName
              ? profile.personalInfo.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              : 'AS'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-light text-slate-900">
                {profile.personalInfo.fullName || 'Student Profile'}
              </h1>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Nationality: <strong>{profile.personalInfo.nationality} 🇳🇵</strong> • Target:{' '}
              <strong className="capitalize">{profile.studyPreferences.intendedAcademicLevel}</strong> in{' '}
              {profile.studyPreferences.destinationCountries.slice(0, 2).join(', ')}
            </p>
          </div>
        </div>

        {/* Readiness Meter & Wizard CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="space-y-1 sm:text-right">
            <span className="text-xs text-slate-500 block">Match Readiness</span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-[#4b37df] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900">{readinessScore}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/onboarding"
              className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4b37df]" />
              <span>Launch Wizard</span>
            </Link>

            <button
              type="button"
              onClick={() => handleSave()}
              className="px-5 py-2 rounded-full bg-[#4b37df] hover:bg-[#3f2cd6] text-white text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Student profile successfully updated! Scholarship matching recalculated.</span>
        </div>
      )}

      {/* 7 Section Tabs Header */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs flex items-center gap-1 overflow-x-auto">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#4b37df] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Form Content */}
      <form onSubmit={(e) => handleSave(e)} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        {/* SECTION A: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-medium text-slate-900">A. Personal Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Essential details required for nationality quotas and age-based scholarship eligibility (e.g. MEXT research age limits).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={profile.personalInfo.fullName}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, fullName: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={profile.personalInfo.dateOfBirth}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, dateOfBirth: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Gender</label>
                <select
                  value={profile.personalInfo.gender}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, gender: e.target.value as Gender },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non_binary">Non-binary</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Nationality *</label>
                <select
                  value={profile.personalInfo.nationality}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, nationality: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                >
                  <option value="Nepal">Nepal 🇳🇵</option>
                  <option value="India">India 🇮🇳</option>
                  <option value="Bangladesh">Bangladesh 🇧🇩</option>
                  <option value="Sri Lanka">Sri Lanka 🇱🇰</option>
                  <option value="Bhutan">Bhutan 🇧🇹</option>
                  <option value="Other">Other Country</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Current Residence Country *</label>
                <select
                  value={profile.personalInfo.currentCountry}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, currentCountry: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                >
                  <option value="Nepal">Nepal 🇳🇵</option>
                  <option value="Japan">Japan 🇯🇵</option>
                  <option value="Australia">Australia 🇦🇺</option>
                  <option value="United Kingdom">United Kingdom 🇬🇧</option>
                  <option value="Other">Other Country</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">City / Municipality</label>
                <input
                  type="text"
                  value={profile.personalInfo.city}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, city: e.target.value },
                    })
                  }
                  placeholder="e.g. Kathmandu"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={profile.personalInfo.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...profile.personalInfo, phone: e.target.value },
                    })
                  }
                  placeholder="+977 98XXXXXXXX"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Preferred Contact Method</label>
                <select
                  value={profile.personalInfo.preferredContact}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: {
                        ...profile.personalInfo,
                        preferredContact: e.target.value as PreferredContactMethod,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SECTION B: EDUCATIONAL BACKGROUND */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-medium text-slate-900">B. Educational Background</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic qualifications are essential for evaluating GPA, prerequisite fields, and eligibility for masters or PhD funding.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEducation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#4b37df]" />
                <span>Add Record</span>
              </button>
            </div>

            <div className="space-y-4">
              {profile.educationRecords.map((record, index) => (
                <div
                  key={record.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 relative"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                    <span className="text-xs font-medium text-slate-800">
                      Degree #{index + 1}: {record.qualification || 'New Qualification'}
                    </span>
                    {profile.educationRecords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(record.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Education Level *</label>
                      <select
                        value={record.level}
                        onChange={(e) =>
                          handleUpdateEducation(record.id, {
                            level: e.target.value as EducationLevel,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900"
                      >
                        <option value="bachelors">Bachelor’s Degree</option>
                        <option value="plus_two">Higher Secondary (+2 / A-Level)</option>
                        <option value="diploma">Diploma / Vocational</option>
                        <option value="masters">Master’s Degree</option>
                        <option value="phd">Doctoral / PhD</option>
                        <option value="see">Secondary School (SEE)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Qualification / Degree Name *</label>
                      <input
                        type="text"
                        required
                        value={record.qualification}
                        onChange={(e) =>
                          handleUpdateEducation(record.id, { qualification: e.target.value })
                        }
                        placeholder="e.g. B.Sc. Computer Science"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Institution / University *</label>
                      <input
                        type="text"
                        required
                        value={record.institution}
                        onChange={(e) =>
                          handleUpdateEducation(record.id, { institution: e.target.value })
                        }
                        placeholder="e.g. Tribhuvan University"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Field of Study *</label>
                      <input
                        type="text"
                        required
                        value={record.fieldOfStudy}
                        onChange={(e) =>
                          handleUpdateEducation(record.id, { fieldOfStudy: e.target.value })
                        }
                        placeholder="e.g. Computer Science"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">GPA / Percentage *</label>
                      <input
                        type="text"
                        required
                        value={record.gpaOrPercentage}
                        onChange={(e) =>
                          handleUpdateEducation(record.id, { gpaOrPercentage: e.target.value })
                        }
                        placeholder="e.g. 3.75 or 78%"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Graduation Year *</label>
                      <input
                        type="text"
                        required
                        value={record.graduationYear}
                        onChange={(e) =>
                          handleUpdateEducation(record.id, { graduationYear: e.target.value })
                        }
                        placeholder="e.g. 2024"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION C: STUDY PREFERENCES */}
        {activeTab === 'study' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-medium text-slate-900">C. Study Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us where you want to pursue your higher education and what degree you seek.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-800 block">
                Target Destinations (Select multiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POPULAR_DESTINATIONS.map((dest) => {
                  const isSelected = profile.studyPreferences.destinationCountries.includes(dest.name);
                  return (
                    <button
                      key={dest.name}
                      type="button"
                      onClick={() => toggleDestination(dest.name)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#4b37df]/5 border-[#4b37df] text-slate-900 ring-1 ring-[#4b37df]'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-xs font-medium">
                        {dest.flag} {dest.name}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center ${
                          isSelected ? 'bg-[#4b37df] border-[#4b37df] text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Intended Academic Level *</label>
                <select
                  value={profile.studyPreferences.intendedAcademicLevel}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      studyPreferences: {
                        ...profile.studyPreferences,
                        intendedAcademicLevel: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                >
                  <option value="masters">Master’s Degree</option>
                  <option value="bachelors">Bachelor’s Degree</option>
                  <option value="phd">PhD / Doctoral</option>
                  <option value="research_fellowship">Research Fellowship</option>
                  <option value="diploma">Diploma / Vocational</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Target Intake Year</label>
                <select
                  value={profile.studyPreferences.intendedIntakeYear}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      studyPreferences: {
                        ...profile.studyPreferences,
                        intendedIntakeYear: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                >
                  <option value="2026">2026 Intake</option>
                  <option value="2027">2027 Intake</option>
                  <option value="2028">2028 Intake</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Preferred Universities (Optional)</label>
              <input
                type="text"
                value={profile.studyPreferences.preferredUniversities}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    studyPreferences: {
                      ...profile.studyPreferences,
                      preferredUniversities: e.target.value,
                    },
                  })
                }
                placeholder="e.g. University of Tokyo, Kyoto University, Oxford, Melbourne"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION D: FUNDING PREFERENCES */}
        {activeTab === 'funding' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-medium text-slate-900">D. Funding Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial support preferences help BidyaGo rank fully-funded scholarships, stipends, and fee waivers.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-800 block">Overall Funding Preference *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'fully_funded', title: 'Fully Funded Priority', desc: '100% Tuition + Living Stipend + Flights' },
                  { key: 'fully_or_partial', title: 'Fully or Partially Funded', desc: 'Comprehensive grants or 50%+ tuition reduction' },
                  { key: 'tuition_waiver', title: 'Tuition Fee Waiver', desc: 'Free public university tuition (Germany, Norway)' },
                  { key: 'research_funding', title: 'Research / Graduate Assistantship', desc: 'Professor-funded RA/TA positions' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        fundingPreferences: {
                          ...profile.fundingPreferences,
                          fundingPreference: item.key as FundingOption,
                        },
                      })
                    }
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      profile.fundingPreferences.fundingPreference === item.key
                        ? 'bg-[#4b37df]/5 border-[#4b37df] ring-1 ring-[#4b37df]'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION E: LANGUAGE PROFICIENCY */}
        {activeTab === 'language' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-medium text-slate-900">E. Language Proficiency (Optional)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Language test scores are completely optional. Many scholarships do not require IELTS or offer language training upon arrival.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">English Proficiency Level</label>
                <select
                  value={profile.languageProficiency.englishProficiency}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      languageProficiency: {
                        ...profile.languageProficiency,
                        englishProficiency: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                >
                  <option value="">Not evaluated</option>
                  <option value="advanced">Advanced / Fluent</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="native_fluent">Native</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">IELTS Band Score</label>
                <input
                  type="text"
                  value={profile.languageProficiency.ieltsScore}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      languageProficiency: {
                        ...profile.languageProficiency,
                        ieltsScore: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. 7.5"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">JLPT Level (Japan 🇯🇵)</label>
                <select
                  value={profile.languageProficiency.jlptLevel}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      languageProficiency: {
                        ...profile.languageProficiency,
                        jlptLevel: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                >
                  <option value="">None / Not taken</option>
                  <option value="N5">N5</option>
                  <option value="N4">N4</option>
                  <option value="N3">N3</option>
                  <option value="N2">N2</option>
                  <option value="N1">N1</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SECTION F: ACHIEVEMENTS & EXPERIENCE */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-medium text-slate-900">F. Academic Achievements & Experience (Optional)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Highlight research papers, work history, and extracurricular leadership to unlock competitive fellowship scoring.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Academic Achievements & Honors</label>
                <textarea
                  rows={2}
                  value={profile.achievementsExperience.academicAchievements}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      achievementsExperience: {
                        ...profile.achievementsExperience,
                        academicAchievements: e.target.value,
                      },
                    })
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Research or Publication Experience</label>
                <textarea
                  rows={2}
                  value={profile.achievementsExperience.researchExperience}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      achievementsExperience: {
                        ...profile.achievementsExperience,
                        researchExperience: e.target.value,
                      },
                    })
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Work & Internship Experience</label>
                <textarea
                  rows={2}
                  value={profile.achievementsExperience.workExperience}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      achievementsExperience: {
                        ...profile.achievementsExperience,
                        workExperience: e.target.value,
                      },
                    })
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION G: APPLICATION READINESS */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-medium text-slate-900">G. Application Readiness Status (Optional)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track readiness milestones for transcripts, CVs, and recommendation letters to keep your application cycle organized.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Valid Passport', key: 'hasPassport' },
                { label: 'Academic CV / Resume', key: 'hasCV' },
                { label: 'Official Transcripts', key: 'hasTranscripts' },
                { label: 'Recommendation Letters (LOR)', key: 'hasRecommendations' },
                { label: 'Statement of Purpose (SOP)', key: 'hasSOP' },
              ].map((item) => (
                <div key={item.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-xs font-medium text-slate-800 block">{item.label}</span>
                  <select
                    value={(profile.applicationReadiness as any)[item.key]}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        applicationReadiness: {
                          ...profile.applicationReadiness,
                          [item.key]: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
                  >
                    <option value="">Not yet started</option>
                    <option value="yes">✓ Ready / Issued</option>
                    <option value="in_progress">In Draft / Requested</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save & Wizard Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/onboarding"
            className="text-xs text-[#4b37df] hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Need guided assistance? Launch the 5-step wizard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Trust & Transparency Callout */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-900">BidyaGo Student Privacy & Transparency Guarantee</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            BidyaGo never collects passport numbers, citizenship card scans, family bank balances, or medical records during registration. Your academic profile criteria is exclusively processed to calculate match fit and verify eligibility with official government embassies and universities.
          </p>
        </div>
      </div>
    </div>
  );
}
