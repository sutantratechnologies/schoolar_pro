'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  GraduationCap,
  Globe2,
  DollarSign,
  Languages,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Award,
  FileText,
} from 'lucide-react';
import {
  StudentProfile,
  EducationRecord,
  EducationLevel,
  GradingSystem,
  FundingOption,
  CoveragePreference,
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
  { name: 'Japan', flag: '🇯🇵', desc: 'MEXT, JASSO, University Grants' },
  { name: 'Australia', flag: '🇦🇺', desc: 'Australia Awards, Research Grants' },
  { name: 'South Korea', flag: '🇰🇷', desc: 'GKS (Global Korea Scholarship)' },
  { name: 'United Kingdom', flag: '🇬🇧', desc: 'Chevening, Commonwealth, GREAT' },
  { name: 'Erasmus Mundus', flag: '🇪🇺', desc: 'Multi-country European Masters' },
  { name: 'Germany', flag: '🇩🇪', desc: 'DAAD EPOS & Zero Tuition Universities' },
  { name: 'United States', flag: '🇺🇸', desc: 'Fulbright, Assistantships, Fellowships' },
  { name: 'Canada', flag: '🇨🇦', desc: 'Vanier CGS, Provincial Grants' },
];

const POPULAR_FIELDS = [
  'Computer Science & AI',
  'Information Technology & Software',
  'Civil & Structural Engineering',
  'Mechanical & Electrical Engineering',
  'Public Health & Medicine',
  'Business Administration & MBA',
  'Data Science & Analytics',
  'Environmental Sciences & Forestry',
  'Economics & International Development',
  'Agriculture & Food Security',
];

const STEPS = [
  { id: 1, title: 'Personal Info', desc: 'Nationality & age eligibility', icon: User },
  { id: 2, title: 'Education', desc: 'Qualifications & grades', icon: GraduationCap },
  { id: 3, title: 'Study Preferences', desc: 'Destinations & degrees', icon: Globe2 },
  { id: 4, title: 'Funding', desc: 'Stipends & tuition waivers', icon: DollarSign },
  { id: 5, title: 'Language & Readiness', desc: 'IELTS, JLPT & documents', icon: Languages },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [isCompletedModal, setIsCompletedModal] = useState(false);
  const [customFieldInput, setCustomFieldInput] = useState('');

  useEffect(() => {
    const loaded = getStoredStudentProfile();
    setProfile(loaded);
  }, []);

  const readinessScore = calculateProfileReadiness(profile);

  const handleNextStep = () => {
    saveStoredStudentProfile(profile);
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setProfile((prev) => ({ ...prev, isCompleted: true }));
      saveStoredStudentProfile({ ...profile, isCompleted: true });
      setIsCompletedModal(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkipToNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompletedModal(true);
    }
  };

  // Education record handlers
  const handleAddEducation = () => {
    const newRecord: EducationRecord = {
      id: `edu-${Date.now()}`,
      level: 'bachelors',
      qualification: '',
      institution: '',
      fieldOfStudy: '',
      gpaOrPercentage: '',
      gradingSystem: 'gpa_4',
      graduationYear: `${new Date().getFullYear()}`,
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

  // Destination toggle
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

  // Field of study toggle
  const toggleField = (field: string) => {
    setProfile((prev) => {
      const exists = prev.studyPreferences.preferredFields.includes(field);
      const updated = exists
        ? prev.studyPreferences.preferredFields.filter((f) => f !== field)
        : [...prev.studyPreferences.preferredFields, field];
      return {
        ...prev,
        studyPreferences: {
          ...prev.studyPreferences,
          preferredFields: updated,
        },
      };
    });
  };

  const handleAddCustomField = () => {
    if (!customFieldInput.trim()) return;
    if (!profile.studyPreferences.preferredFields.includes(customFieldInput.trim())) {
      toggleField(customFieldInput.trim());
    }
    setCustomFieldInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-purple-100 selection:text-[#4b37df]">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group" aria-label="BidyaGo">
            <Image
              src="/bidyago_logo.png"
              alt="BidyaGo"
              width={130}
              height={34}
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="text-slate-300">|</span>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">
              Student Profile Onboarding
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden sm:inline">Profile Readiness:</span>
              <div className="w-20 sm:w-28 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-[#4b37df] to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
              <span className="font-semibold text-slate-900">{readinessScore}%</span>
            </div>

            <Link
              href="/dashboard"
              className="text-xs font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              Save & Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Step Progress Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Step <strong className="text-slate-900">{currentStep}</strong> of 5
            </span>
            <span className="font-medium text-[#4b37df]">{STEPS[currentStep - 1].title}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isPast = currentStep > s.id;
              const isCurrent = currentStep === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={`group text-left p-2.5 sm:p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-white border-[#4b37df] shadow-xs ring-2 ring-[#4b37df]/10'
                      : isPast
                        ? 'bg-white/80 border-emerald-300 hover:border-emerald-400'
                        : 'bg-white/40 border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full text-[11px] font-semibold flex items-center justify-center ${
                        isCurrent
                          ? 'bg-[#4b37df] text-white'
                          : isPast
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : s.id}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${
                        isCurrent
                          ? 'text-[#4b37df]'
                          : isPast
                            ? 'text-emerald-500'
                            : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <div className="mt-2 hidden sm:block">
                    <p className="text-xs font-medium text-slate-900 truncate">{s.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs space-y-8 animate-fadeIn">
          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider">
                  Section A • Personal Information
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mt-1">
                  Tell us a bit about yourself
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  BidyaGo uses your nationality and date of birth to automatically check citizenship and age limits for prestigious scholarships like MEXT Japan and UK Chevening.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                    <span>Full Legal Name</span>
                    <span className="text-[11px] text-slate-400">As on official documents</span>
                  </label>
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
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df]"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                    <span>Date of Birth</span>
                    <span className="text-[11px] text-emerald-600 font-normal">Needed for age eligibility</span>
                  </label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df]"
                  />
                </div>

                {/* Nationality (Default Nepal) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                    <span>Nationality</span>
                    <span className="text-[11px] text-[#4b37df] font-normal">Default: Nepal 🇳🇵</span>
                  </label>
                  <select
                    value={profile.personalInfo.nationality}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, nationality: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df]"
                  >
                    <option value="Nepal">Nepal 🇳🇵</option>
                    <option value="India">India 🇮🇳</option>
                    <option value="Bangladesh">Bangladesh 🇧🇩</option>
                    <option value="Sri Lanka">Sri Lanka 🇱🇰</option>
                    <option value="Bhutan">Bhutan 🇧🇹</option>
                    <option value="Pakistan">Pakistan 🇵🇰</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>

                {/* Current Residence Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Current Country of Residence</label>
                  <select
                    value={profile.personalInfo.currentCountry}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, currentCountry: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df]"
                  >
                    <option value="Nepal">Nepal 🇳🇵</option>
                    <option value="India">India 🇮🇳</option>
                    <option value="Japan">Japan 🇯🇵</option>
                    <option value="Australia">Australia 🇦🇺</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                    <span>City / Municipality</span>
                    <span className="text-[11px] text-slate-400">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={profile.personalInfo.city}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, city: e.target.value },
                      })
                    }
                    placeholder="e.g. Kathmandu, Pokhara, Lalitpur"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                    <span>Gender</span>
                    <span className="text-[11px] text-slate-400">Optional for diversity grants</span>
                  </label>
                  <select
                    value={profile.personalInfo.gender}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        personalInfo: { ...profile.personalInfo, gender: e.target.value as Gender },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non_binary">Non-binary</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                    <span>Phone / Mobile Number</span>
                    <span className="text-[11px] text-slate-400">Optional</span>
                  </label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white"
                  />
                </div>

                {/* Preferred Contact Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                    <span>Preferred Notification Channel</span>
                    <span className="text-[11px] text-slate-400">For deadline alerts</span>
                  </label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white"
                  >
                    <option value="email">Email Notification</option>
                    <option value="whatsapp">WhatsApp Alert</option>
                    <option value="phone">SMS / Phone</option>
                  </select>
                </div>
              </div>

              {/* Privacy Notice Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 block font-medium">BidyaGo Privacy Commitment</strong>
                  We do not ask for citizenship cards, passport scans, or bank accounts during registration. Your personal details are strictly utilized to compute academic eligibility for verified university and government grants.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATIONAL BACKGROUND */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider">
                    Section B • Educational Background
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mt-1">
                    Your Academic History
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Add your qualifications, GPA, and institution. You can add multiple education records (e.g., +2 and Bachelor’s) for comprehensive evaluation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#4b37df]" />
                  <span>Add Another Degree</span>
                </button>
              </div>

              {/* Education Cards */}
              <div className="space-y-5">
                {profile.educationRecords.map((record, index) => (
                  <div
                    key={record.id}
                    className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 relative group"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-medium text-slate-900">
                          {record.qualification || `Education Record #${index + 1}`}
                        </h4>
                      </div>

                      {profile.educationRecords.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(record.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 p-1 hover:bg-rose-50 rounded-md transition-colors"
                          title="Remove record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Education Level */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700">Education Level *</label>
                        <select
                          value={record.level}
                          onChange={(e) =>
                            handleUpdateEducation(record.id, {
                              level: e.target.value as EducationLevel,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900 focus:border-[#4b37df]"
                        >
                          <option value="bachelors">Bachelor’s Degree</option>
                          <option value="plus_two">Higher Secondary (+2 / A-Level / IB)</option>
                          <option value="diploma">Diploma / Vocational</option>
                          <option value="masters">Master’s Degree</option>
                          <option value="phd">Doctoral / PhD</option>
                          <option value="see">Secondary School (SEE / Class 10)</option>
                          <option value="other">Other Qualification</option>
                        </select>
                      </div>

                      {/* Qualification Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700">Degree / Qualification *</label>
                        <input
                          type="text"
                          required
                          value={record.qualification}
                          onChange={(e) =>
                            handleUpdateEducation(record.id, { qualification: e.target.value })
                          }
                          placeholder="e.g. B.Sc. Computer Science / +2 Science"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900 focus:border-[#4b37df]"
                        />
                      </div>

                      {/* Institution */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700">School / College / University *</label>
                        <input
                          type="text"
                          required
                          value={record.institution}
                          onChange={(e) =>
                            handleUpdateEducation(record.id, { institution: e.target.value })
                          }
                          placeholder="e.g. Tribhuvan University, Kathmandu Univ."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900 focus:border-[#4b37df]"
                        />
                      </div>

                      {/* Field of Study */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700">Major / Field of Study *</label>
                        <input
                          type="text"
                          required
                          value={record.fieldOfStudy}
                          onChange={(e) =>
                            handleUpdateEducation(record.id, { fieldOfStudy: e.target.value })
                          }
                          placeholder="e.g. Computer Science, Civil Engineering"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900 focus:border-[#4b37df]"
                        />
                      </div>

                      {/* Grading System */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700">Grading System *</label>
                        <select
                          value={record.gradingSystem}
                          onChange={(e) =>
                            handleUpdateEducation(record.id, {
                              gradingSystem: e.target.value as GradingSystem,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900 focus:border-[#4b37df]"
                        >
                          <option value="gpa_4">4.0 GPA Scale</option>
                          <option value="percentage">Percentage (%)</option>
                          <option value="cgpa_10">10.0 CGPA Scale</option>
                          <option value="division">Division / Honors (First Class)</option>
                          <option value="other">Other System</option>
                        </select>
                      </div>

                      {/* GPA or Percentage Value */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700">GPA or Score *</label>
                        <input
                          type="text"
                          required
                          value={record.gpaOrPercentage}
                          onChange={(e) =>
                            handleUpdateEducation(record.id, { gpaOrPercentage: e.target.value })
                          }
                          placeholder="e.g. 3.75 or 78%"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900 focus:border-[#4b37df]"
                        />
                      </div>

                      {/* Graduation Year */}
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
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-900 focus:border-[#4b37df]"
                        />
                      </div>

                      {/* Currently Studying Checkbox */}
                      <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id={`studying-${record.id}`}
                          checked={record.isCurrentlyStudying}
                          onChange={(e) =>
                            handleUpdateEducation(record.id, {
                              isCurrentlyStudying: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded-sm text-[#4b37df] border-slate-300 focus:ring-[#4b37df]"
                        />
                        <label
                          htmlFor={`studying-${record.id}`}
                          className="text-xs text-slate-600 cursor-pointer"
                        >
                          I am currently pursuing this degree (expected graduation:{' '}
                          <input
                            type="text"
                            placeholder="e.g. 2026"
                            value={record.expectedGraduationYear || ''}
                            onChange={(e) =>
                              handleUpdateEducation(record.id, {
                                expectedGraduationYear: e.target.value,
                              })
                            }
                            className="inline-block w-20 px-2 py-0.5 ml-1 text-xs border border-slate-200 rounded-md bg-white text-slate-900"
                          />
                          )
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: STUDY PREFERENCES */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider">
                  Section C • Study Preferences
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mt-1">
                  Where and what do you want to study?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Select your dream destinations and academic interests. BidyaGo filters thousands of grants to show you exact matching programs.
                </p>
              </div>

              {/* Destination Countries */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-800 block">
                  Target Destination Countries * <span className="text-slate-400 font-normal">(Select multiple)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {POPULAR_DESTINATIONS.map((dest) => {
                    const isSelected = profile.studyPreferences.destinationCountries.includes(dest.name);
                    return (
                      <button
                        key={dest.name}
                        type="button"
                        onClick={() => toggleDestination(dest.name)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#4b37df]/5 border-[#4b37df] text-slate-900 ring-1 ring-[#4b37df]'
                            : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{dest.flag}</span>
                          <span
                            className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#4b37df] border-[#4b37df] text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-slate-900">{dest.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{dest.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Intended Academic Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white"
                  >
                    <option value="masters">Master’s Degree (Graduate)</option>
                    <option value="bachelors">Undergraduate (Bachelor’s)</option>
                    <option value="phd">PhD / Doctoral Fellowship</option>
                    <option value="research_fellowship">Research Fellowship / Postdoc</option>
                    <option value="diploma">Vocational / Diploma</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Intended Intake Year</label>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white"
                  >
                    <option value="2026">2026 Cycle</option>
                    <option value="2027">2027 Cycle</option>
                    <option value="2028">2028 Cycle</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Study Duration</label>
                  <select
                    value={profile.studyPreferences.preferredStudyDuration}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        studyPreferences: {
                          ...profile.studyPreferences,
                          preferredStudyDuration: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white"
                  >
                    <option value="2_years">2 Years (Standard Masters)</option>
                    <option value="1_year">1 Year (Intensive UK/Europe)</option>
                    <option value="3_4_years">3 - 4 Years (PhD or Undergrad)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Preferred Subject Areas */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-medium text-slate-800 block">
                  Preferred Academic Fields *
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_FIELDS.map((field) => {
                    const isSelected = profile.studyPreferences.preferredFields.includes(field);
                    return (
                      <button
                        key={field}
                        type="button"
                        onClick={() => toggleField(field)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                          isSelected
                            ? 'bg-[#4b37df] border-[#4b37df] text-white shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {field}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Field */}
                <div className="flex items-center gap-2 pt-1 max-w-md">
                  <input
                    type="text"
                    value={customFieldInput}
                    onChange={(e) => setCustomFieldInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomField();
                      }
                    }}
                    placeholder="Other specific field (e.g. Robotics, Architecture)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FUNDING PREFERENCES */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider">
                  Section D • Funding Preferences
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mt-1">
                  What type of financial support do you need?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Tell us your funding priorities so BidyaGo can highlight fully-funded government grants and tuition waiver schemes without hiding viable partial awards.
                </p>
              </div>

              {/* Main Funding Options Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    key: 'fully_funded',
                    title: 'Fully Funded Priority',
                    desc: '100% Tuition Waiver + Monthly Living Stipend + Roundtrip Flight tickets (e.g. MEXT, Australia Awards, Chevening, GKS).',
                    badge: 'Recommended',
                  },
                  {
                    key: 'fully_or_partial',
                    title: 'Fully or Partially Funded',
                    desc: 'Open to comprehensive grants as well as substantial partial funding (50%+ tuition support).',
                    badge: 'Popular',
                  },
                  {
                    key: 'tuition_waiver',
                    title: 'Tuition Fee Waiver',
                    desc: 'Complete exemption from university fees (e.g. Public German and Norwegian universities).',
                    badge: 'No Fees',
                  },
                  {
                    key: 'research_funding',
                    title: 'Research Assistantship (RA / TA)',
                    desc: 'Graduate assistantships covering tuition plus research stipend paid by university professors.',
                    badge: 'Graduate',
                  },
                  {
                    key: 'partial_scholarship',
                    title: 'Partial Scholarship',
                    desc: 'Merit-based scholarships reducing tuition costs by 20% to 50%.',
                    badge: 'Merit',
                  },
                  {
                    key: 'any',
                    title: 'Any Available Funding',
                    desc: 'Explore all verified government, institutional, and university awards without restrictions.',
                    badge: 'All Grants',
                  },
                ].map((opt) => {
                  const isSelected = profile.fundingPreferences.fundingPreference === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          fundingPreferences: {
                            ...profile.fundingPreferences,
                            fundingPreference: opt.key as FundingOption,
                          },
                        })
                      }
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#4b37df]/5 border-[#4b37df] text-slate-900 ring-2 ring-[#4b37df]/20'
                          : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">{opt.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isSelected
                              ? 'bg-[#4b37df] text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Specific Support Breakdowns */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Specific Coverage Preferences (Optional)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Living Expenses */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Monthly Living Stipend</label>
                    <select
                      value={profile.fundingPreferences.livingExpensesCoverage}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          fundingPreferences: {
                            ...profile.fundingPreferences,
                            livingExpensesCoverage: e.target.value as CoveragePreference,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                    >
                      <option value="essential">Essential (Required)</option>
                      <option value="preferred">Preferred</option>
                      <option value="not_essential">Not Essential</option>
                    </select>
                  </div>

                  {/* Travel Support */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Flight & Airfare Support</label>
                    <select
                      value={profile.fundingPreferences.travelSupport}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          fundingPreferences: {
                            ...profile.fundingPreferences,
                            travelSupport: e.target.value as CoveragePreference,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                    >
                      <option value="essential">Essential (Required)</option>
                      <option value="preferred">Preferred</option>
                      <option value="not_essential">Not Essential</option>
                    </select>
                  </div>

                  {/* Application Fee */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Application Fee Waiver</label>
                    <select
                      value={profile.fundingPreferences.applicationFeeSupport}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          fundingPreferences: {
                            ...profile.fundingPreferences,
                            applicationFeeSupport: e.target.value as CoveragePreference,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                    >
                      <option value="preferred">Preferred</option>
                      <option value="essential">Essential (Required)</option>
                      <option value="not_essential">Not Essential</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: LANGUAGE PROFICIENCY & APPLICATION READINESS */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div>
                <span className="text-xs font-semibold text-[#4b37df] uppercase tracking-wider">
                  Section E, F & G • Language & Application Readiness
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mt-1">
                  Languages, Achievements & Readiness
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  All fields here are optional. You do NOT need IELTS, TOEFL, JLPT, or TOPIK to complete your profile—some grants waive tests or provide language preparatory years.
                </p>
              </div>

              {/* Language Proficiency Subsection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Languages className="w-4 h-4 text-[#4b37df]" />
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    E. Language Proficiency (Optional)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* English Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">English Proficiency</label>
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
                      <option value="">Not evaluated yet</option>
                      <option value="advanced">Advanced / Fluent</option>
                      <option value="intermediate">Intermediate (Working)</option>
                      <option value="native_fluent">Native Speaker</option>
                      <option value="beginner">Beginner</option>
                    </select>
                  </div>

                  {/* IELTS */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                      <span>IELTS Score</span>
                      <span className="text-[10px] text-slate-400">If taken</span>
                    </label>
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                    />
                  </div>

                  {/* Japanese / JLPT */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                      <span>JLPT Level 🇯🇵</span>
                      <span className="text-[10px] text-slate-400">For Japan</span>
                    </label>
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
                      <option value="N5">N5 (Basic)</option>
                      <option value="N4">N4 (Elementary)</option>
                      <option value="N3">N3 (Intermediate)</option>
                      <option value="N2">N2 (Business)</option>
                      <option value="N1">N1 (Fluent)</option>
                    </select>
                  </div>

                  {/* Korean / TOPIK */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                      <span>TOPIK Level 🇰🇷</span>
                      <span className="text-[10px] text-slate-400">For Korea</span>
                    </label>
                    <select
                      value={profile.languageProficiency.topikLevel}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          languageProficiency: {
                            ...profile.languageProficiency,
                            topikLevel: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900"
                    >
                      <option value="">None / Not taken</option>
                      <option value="level_1">TOPIK 1</option>
                      <option value="level_2">TOPIK 2</option>
                      <option value="level_3">TOPIK 3</option>
                      <option value="level_4">TOPIK 4</option>
                      <option value="level_5">TOPIK 5</option>
                      <option value="level_6">TOPIK 6</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic Achievements Subsection */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    F. Academic Achievements & Experience (Optional)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Academic Honors / Dean's List / Ranks</label>
                    <input
                      type="text"
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
                      placeholder="e.g. Dean's Merit Scholarship, Rank 2 in batch"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Research or Project Publications</label>
                    <input
                      type="text"
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
                      placeholder="e.g. Undergraduate capstone thesis on NLP"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Application Readiness Subsection */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    G. Application Readiness Status (Optional)
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Valid Passport', key: 'hasPassport' },
                    { label: 'Academic CV', key: 'hasCV' },
                    { label: 'Transcripts', key: 'hasTranscripts' },
                    { label: 'LORs (Referees)', key: 'hasRecommendations' },
                    { label: 'Statement of Purpose', key: 'hasSOP' },
                  ].map((item) => {
                    const currentVal = (profile.applicationReadiness as any)[item.key];
                    return (
                      <div key={item.key} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[11px] font-medium text-slate-700 block truncate">
                          {item.label}
                        </span>
                        <select
                          value={currentVal}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              applicationReadiness: {
                                ...profile.applicationReadiness,
                                [item.key]: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
                        >
                          <option value="">Not yet</option>
                          <option value="yes">✓ Ready</option>
                          <option value="in_progress">In Draft</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Step</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={handleSkipToNext}
                  className="px-4 py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              )}

              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#4b37df] hover:bg-[#3f2cd6] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
              >
                <span>{currentStep === 5 ? 'Complete Profile Setup' : 'Save & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Completion Celebration Modal */}
      {isCompletedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Profile Setup Complete
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
                Your Academic Matches Are Ready!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                We computed your criteria against verified government and university databases. You have unlocked direct eligibility insights for <strong>MEXT Japan</strong>, <strong>UK Chevening</strong>, <strong>Australia Awards</strong>, and <strong>Erasmus Mundus</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-around text-center">
              <div>
                <span className="text-2xl font-light text-[#4b37df]">98%</span>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Top Match Fit</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-2xl font-light text-slate-900">12</span>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Verified Grants</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-2xl font-light text-emerald-600">100%</span>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Free Support</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/dashboard/recommended"
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#4b37df] hover:bg-[#3f2cd6] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>View Recommended Grants</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto py-3 px-5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} BidyaGo. Built with transparency for global scholars.</p>
      </footer>
    </div>
  );
}
