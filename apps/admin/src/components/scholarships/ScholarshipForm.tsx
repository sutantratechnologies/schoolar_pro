'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  Clock,
  ChevronRight,
} from 'lucide-react';

export interface ScholarshipFormData {
  id?: string;
  // Section 1: Basic Info
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  provider: string;
  providerType: string;
  opportunityType: string;
  categories: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  officialWebsite: string;
  isFeatured: boolean;
  showOnHomepage: boolean;
  visibility: 'PUBLIC' | 'UNLISTED' | 'RESTRICTED';
  publicationStatus: 'DRAFT' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
  displayPriority: number;

  // Section 2: Study Information
  destinationCountries: string[];
  studyLocation: string;
  academicLevels: string[];
  fieldsOfStudy: string[];
  specificSubjects: string[];
  studyMode: 'On-campus' | 'Online' | 'Hybrid';
  studyDuration: string;
  instructionLanguages: string[];
  intakePeriod: string;
  participatingInstitutions: string[];

  // Section 3: Eligibility Criteria
  eligibleNationalities: string[];
  excludedNationalities: string[];
  nepaleseEligible: 'YES' | 'NO' | 'CONDITIONAL';
  residencyRequirements: string;
  minAge: number | '';
  maxAge: number | '';
  ageCalculationDate: string;
  ageExceptions: string;
  minGpa: number | '';
  gpaScale: string;
  minPercentage: number | '';
  requiredQualification: string;
  requiredBackground: string;
  graduationYearReq: string;
  academicPrerequisites: string;
  languageRequirements: {
    requiredLanguage?: string;
    ieltsOverall?: number | '';
    toeflMin?: number | '';
    pteMin?: number | '';
    jlptLevel?: string;
    topikLevel?: string;
    waiverAvailable?: 'YES' | 'NO' | 'CONDITIONAL';
    notes?: string;
  };
  otherEligibility: {
    workExperience?: string;
    researchExperience?: string;
    publications?: string;
    recommendations?: string;
    interviewRequired?: 'YES' | 'NO' | 'CONDITIONAL';
    restrictions?: string;
  };

  // Section 4: Funding & Benefits
  fundingClassification: string;
  tuitionCoverage: string;
  tuitionAmount: number | '';
  tuitionCurrency: string;
  monthlyStipend: number | '';
  stipendCurrency: string;
  stipendFrequency: string;
  accommodationSupport: string;
  accommodationAmount: number | '';
  travelAllowance: string;
  airfareCoverage: string;
  healthInsurance: string;
  researchAllowance: number | '';
  booksCoverage: string;
  applicationFeeCoverage: string;
  otherFinancialBenefits: Array<{
    title: string;
    description: string;
    amount?: number | '';
    currency?: string;
  }>;
  benefitsDescription: string;

  // Section 5: Application Details
  applicationRoute: string;
  applicationMethod: string;
  applicationPortalUrl: string;
  applicationGuideUrl: string;
  applicationFee: number | '';
  applicationFeeCurrency: string;
  interviewRequired: 'YES' | 'NO' | 'CONDITIONAL';
  entranceExamination: 'YES' | 'NO' | 'CONDITIONAL';
  selectionProcedure: string;
  contactEmail: string;
  contactWebsite: string;

  // Section 6: Required Documents
  requiredDocuments: Array<{
    id: string;
    name: string;
    description: string;
    mandatory: boolean;
    originalOrCopy: string;
    language: string;
    translationRequired: 'YES' | 'NO' | 'CONDITIONAL';
    attestationRequired: 'YES' | 'NO' | 'CONDITIONAL';
    formats: string[];
    condition?: string;
  }>;

  // Section 7: Scholarship Cycle
  initialCycle: {
    cycleName: string;
    applicationYear: number;
    intakeYear: number;
    intakeSemester: string;
    cycleOpeningDate: string;
    applicationDeadline: string;
    deadlineTimezone: string;
    selectionAnnouncementDate: string;
    programmeStartDate: string;
    programmeEndDate: string;
    cycleStatus: string;
    officialApplicationUrl: string;
  };

  // Section 8: Sources & Verification
  primaryOfficialSource: string;
  additionalSources: Array<{
    url: string;
    org: string;
    type: string;
  }>;
  sourceOrganization: string;
  sourceType: string;
  verificationNotes: string;
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'NEEDS_REVISION' | 'REJECTED';
  verificationChecklist: {
    exists?: boolean;
    nepaleseEligible?: boolean;
    levelCorrect?: boolean;
    fundingAccurate?: boolean;
    deadlineConfirmed?: boolean;
    routeConfirmed?: boolean;
    documentsConfirmed?: boolean;
    urlsWorking?: boolean;
  };
  nextReviewDate: string;

  // Section 9: SEO & Publishing
  seoTitle: string;
  seoDescription: string;
  socialSharingImage: string;
}

const SECTIONS = [
  { id: 'basic', label: '01. Basic Info', icon: Building, desc: 'Title, provider & category' },
  { id: 'study', label: '02. Study Info', icon: GraduationCap, desc: 'Destinations, levels & subjects' },
  { id: 'eligibility', label: '03. Eligibility', icon: ShieldCheck, desc: 'Nationality, GPA, Age & Language' },
  { id: 'funding', label: '04. Funding & Benefits', icon: DollarSign, desc: 'Tuition, stipend & allowances' },
  { id: 'application', label: '05. Application Details', icon: Clock, desc: 'Routes, deadlines & procedure' },
  { id: 'documents', label: '06. Required Documents', icon: FileText, desc: 'Document checklist & builder' },
  { id: 'cycle', label: '07. Scholarship Cycle', icon: Calendar, desc: 'Intake years & cycle status' },
  { id: 'verification', label: '08. Sources & Proof', icon: CheckCircle2, desc: 'Official URLs & 8-point check' },
  { id: 'publishing', label: '09. SEO & Publishing', icon: Sparkles, desc: 'Status, search SEO & launch' },
];

const PRESET_COUNTRIES = [
  'Japan', 'United Kingdom', 'Australia', 'United States', 'Germany',
  'South Korea', 'Canada', 'France', 'China', 'India', 'Netherlands',
  'Sweden', 'Norway', 'Switzerland', 'New Zealand', 'Singapore', 'Ireland',
];

const PRESET_LEVELS = [
  'Diploma', 'Undergraduate', "Bachelor's", "Master's",
  'PhD / Doctoral', 'Postdoctoral', 'Research', 'Exchange programme', 'Other',
];

const PRESET_FIELDS = [
  'Science & Technology', 'Engineering & Robotics', 'Computer Science & AI',
  'Medicine & Healthcare', 'Business & Management', 'Economics & Finance',
  'Humanities & Arts', 'Social Sciences & Law', 'Environmental Science & Climate',
  'Agriculture & Forestry', 'Architecture & Design',
];

const COMMON_DOCUMENTS = [
  { name: 'Academic Transcripts', desc: 'Certified marks sheets of all completed academic years.' },
  { name: 'Degree Certificate / Diploma', desc: 'Provisional or original degree graduation certificate.' },
  { name: 'Curriculum Vitae (CV / Resume)', desc: 'Detailed academic and professional resume.' },
  { name: 'Statement of Purpose (SOP)', desc: 'Personal statement stating academic motivation and future goals.' },
  { name: 'Letters of Recommendation', desc: 'Confidential letters signed by academic professors or mentors.' },
  { name: 'Valid Passport / Citizenship', desc: 'Scanned bio-data page of Nepali passport or citizenship certificate.' },
  { name: 'English Proficiency Certificate', desc: 'IELTS, TOEFL, or PTE score report.' },
  { name: 'Research Proposal', desc: 'Detailed research methodology and objectives (Graduate track).' },
  { name: 'Medical Health Certificate', desc: 'Certified health examination clearance from an accredited physician.' },
];

export function ScholarshipForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<ScholarshipFormData>;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Default values
  const [formData, setFormData] = useState<ScholarshipFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    provider: initialData?.provider || '',
    providerType: initialData?.providerType || 'Government',
    opportunityType: initialData?.opportunityType || 'Degree-seeking scholarship',
    categories: initialData?.categories || ['Government scholarship', 'Fully funded scholarship'],
    logoUrl: initialData?.logoUrl || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    officialWebsite: initialData?.officialWebsite || '',
    isFeatured: initialData?.isFeatured || false,
    showOnHomepage: initialData?.showOnHomepage !== false,
    visibility: initialData?.visibility || 'PUBLIC',
    publicationStatus: initialData?.publicationStatus || 'DRAFT',
    displayPriority: initialData?.displayPriority || 0,

    destinationCountries: initialData?.destinationCountries || ['Japan'],
    studyLocation: initialData?.studyLocation || '',
    academicLevels: initialData?.academicLevels || ["Master's"],
    fieldsOfStudy: initialData?.fieldsOfStudy || ['Science & Technology'],
    specificSubjects: initialData?.specificSubjects || [],
    studyMode: initialData?.studyMode || 'On-campus',
    studyDuration: initialData?.studyDuration || '2 Years',
    instructionLanguages: initialData?.instructionLanguages || ['English'],
    intakePeriod: initialData?.intakePeriod || 'Fall 2027',
    participatingInstitutions: initialData?.participatingInstitutions || [],

    eligibleNationalities: initialData?.eligibleNationalities || ['Nepal'],
    excludedNationalities: initialData?.excludedNationalities || [],
    nepaleseEligible: initialData?.nepaleseEligible || 'YES',
    residencyRequirements: initialData?.residencyRequirements || '',
    minAge: initialData?.minAge ?? '',
    maxAge: initialData?.maxAge ?? '',
    ageCalculationDate: initialData?.ageCalculationDate || '',
    ageExceptions: initialData?.ageExceptions || '',
    minGpa: initialData?.minGpa ?? '',
    gpaScale: initialData?.gpaScale || '4.0 scale',
    minPercentage: initialData?.minPercentage ?? '',
    requiredQualification: initialData?.requiredQualification || '',
    requiredBackground: initialData?.requiredBackground || '',
    graduationYearReq: initialData?.graduationYearReq || '',
    academicPrerequisites: initialData?.academicPrerequisites || '',
    languageRequirements: {
      requiredLanguage: initialData?.languageRequirements?.requiredLanguage || 'English',
      ieltsOverall: initialData?.languageRequirements?.ieltsOverall ?? '',
      toeflMin: initialData?.languageRequirements?.toeflMin ?? '',
      pteMin: initialData?.languageRequirements?.pteMin ?? '',
      jlptLevel: initialData?.languageRequirements?.jlptLevel || 'None',
      topikLevel: initialData?.languageRequirements?.topikLevel || 'None',
      waiverAvailable: initialData?.languageRequirements?.waiverAvailable || 'NO',
      notes: initialData?.languageRequirements?.notes || '',
    },
    otherEligibility: {
      workExperience: initialData?.otherEligibility?.workExperience || '',
      researchExperience: initialData?.otherEligibility?.researchExperience || '',
      publications: initialData?.otherEligibility?.publications || '',
      recommendations: initialData?.otherEligibility?.recommendations || '2 academic reference letters',
      interviewRequired: initialData?.otherEligibility?.interviewRequired || 'YES',
      restrictions: initialData?.otherEligibility?.restrictions || '',
    },

    fundingClassification: initialData?.fundingClassification || 'Fully funded',
    tuitionCoverage: initialData?.tuitionCoverage || 'Covered',
    tuitionAmount: initialData?.tuitionAmount ?? '',
    tuitionCurrency: initialData?.tuitionCurrency || 'USD',
    monthlyStipend: initialData?.monthlyStipend ?? '',
    stipendCurrency: initialData?.stipendCurrency || 'USD',
    stipendFrequency: initialData?.stipendFrequency || 'Monthly',
    accommodationSupport: initialData?.accommodationSupport || 'Covered',
    accommodationAmount: initialData?.accommodationAmount ?? '',
    travelAllowance: initialData?.travelAllowance || 'Covered',
    airfareCoverage: initialData?.airfareCoverage || 'Covered',
    healthInsurance: initialData?.healthInsurance || 'Covered',
    researchAllowance: initialData?.researchAllowance ?? '',
    booksCoverage: initialData?.booksCoverage || 'Covered',
    applicationFeeCoverage: initialData?.applicationFeeCoverage || 'Covered',
    otherFinancialBenefits: initialData?.otherFinancialBenefits || [
      { title: 'International Roundtrip Airfare', description: 'Economy flights to and from home country covered.' },
      { title: 'Settlement / Arrival Grant', description: 'One-time initial cash allowance upon arrival.' },
    ],
    benefitsDescription: initialData?.benefitsDescription || '',

    applicationRoute: initialData?.applicationRoute || 'Apply through official scholarship portal',
    applicationMethod: initialData?.applicationMethod || 'Online',
    applicationPortalUrl: initialData?.applicationPortalUrl || '',
    applicationGuideUrl: initialData?.applicationGuideUrl || '',
    applicationFee: initialData?.applicationFee ?? 0,
    applicationFeeCurrency: initialData?.applicationFeeCurrency || 'USD',
    interviewRequired: initialData?.interviewRequired || 'YES',
    entranceExamination: initialData?.entranceExamination || 'NO',
    selectionProcedure: initialData?.selectionProcedure || '',
    contactEmail: initialData?.contactEmail || '',
    contactWebsite: initialData?.contactWebsite || '',

    requiredDocuments: initialData?.requiredDocuments || [
      {
        id: 'doc-1',
        name: 'Academic Transcripts',
        description: 'Certified marksheets of secondary & higher education.',
        mandatory: true,
        originalOrCopy: 'Certified Copy',
        language: 'English',
        translationRequired: 'YES',
        attestationRequired: 'YES',
        formats: ['PDF'],
        condition: 'All applicants',
      },
      {
        id: 'doc-2',
        name: 'Degree Graduation Certificate',
        description: 'Official degree or provisional certificate.',
        mandatory: true,
        originalOrCopy: 'Certified Copy',
        language: 'English',
        translationRequired: 'YES',
        attestationRequired: 'YES',
        formats: ['PDF'],
        condition: 'All applicants',
      },
      {
        id: 'doc-3',
        name: 'Statement of Purpose (SOP)',
        description: 'Academic goals and career roadmap.',
        mandatory: true,
        originalOrCopy: 'Original',
        language: 'English',
        translationRequired: 'NO',
        attestationRequired: 'NO',
        formats: ['PDF'],
        condition: 'All applicants',
      },
    ],

    initialCycle: {
      cycleName: initialData?.initialCycle?.cycleName || '2027/2028 Academic Intake',
      applicationYear: initialData?.initialCycle?.applicationYear || 2027,
      intakeYear: initialData?.initialCycle?.intakeYear || 2027,
      intakeSemester: initialData?.initialCycle?.intakeSemester || 'Fall',
      cycleOpeningDate: initialData?.initialCycle?.cycleOpeningDate || '',
      applicationDeadline: initialData?.initialCycle?.applicationDeadline || '',
      deadlineTimezone: initialData?.initialCycle?.deadlineTimezone || 'UTC+05:45',
      selectionAnnouncementDate: initialData?.initialCycle?.selectionAnnouncementDate || '',
      programmeStartDate: initialData?.initialCycle?.programmeStartDate || '',
      programmeEndDate: initialData?.initialCycle?.programmeEndDate || '',
      cycleStatus: initialData?.initialCycle?.cycleStatus || 'OPEN',
      officialApplicationUrl: initialData?.initialCycle?.officialApplicationUrl || '',
    },

    primaryOfficialSource: initialData?.primaryOfficialSource || '',
    additionalSources: initialData?.additionalSources || [],
    sourceOrganization: initialData?.sourceOrganization || '',
    sourceType: initialData?.sourceType || 'Government website',
    verificationNotes: initialData?.verificationNotes || '',
    verificationStatus: initialData?.verificationStatus || 'VERIFIED',
    verificationChecklist: initialData?.verificationChecklist || {
      exists: true,
      nepaleseEligible: true,
      levelCorrect: true,
      fundingAccurate: true,
      deadlineConfirmed: true,
      routeConfirmed: true,
      documentsConfirmed: true,
      urlsWorking: true,
    },
    nextReviewDate: initialData?.nextReviewDate || '',

    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    socialSharingImage: initialData?.socialSharingImage || '',
  });

  // Calculate live completeness
  const completeness = useMemo(() => {
    let earned = 0;
    const missing: string[] = [];

    // Title & slug
    if (formData.title.trim().length > 3) earned += 15; else missing.push('Title');
    if (formData.provider.trim().length > 1) earned += 10; else missing.push('Provider');
    if (formData.destinationCountries.length > 0) earned += 10; else missing.push('Destination countries');
    if (formData.academicLevels.length > 0) earned += 10; else missing.push('Academic levels');
    if (formData.shortDescription.trim().length > 10) earned += 10; else missing.push('Short description');
    if (formData.description.trim().length > 20) earned += 10; else missing.push('Full description');
    if (formData.primaryOfficialSource.startsWith('http')) earned += 15; else missing.push('Official source URL');
    if (formData.requiredDocuments.length > 0) earned += 10; else missing.push('Required documents');
    if (formData.initialCycle.applicationDeadline) earned += 10; else missing.push('Application deadline');

    return { score: earned, missing };
  }, [formData]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug && isEdit ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      seoTitle: prev.seoTitle ? prev.seoTitle : `${val} 2027/2028 - BidyaGo`,
    }));
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat],
      };
    });
  };

  const toggleCountry = (country: string) => {
    setFormData((prev) => {
      const exists = prev.destinationCountries.includes(country);
      return {
        ...prev,
        destinationCountries: exists
          ? prev.destinationCountries.filter((c) => c !== country)
          : [...prev.destinationCountries, country],
      };
    });
  };

  const toggleLevel = (lvl: string) => {
    setFormData((prev) => {
      const exists = prev.academicLevels.includes(lvl);
      return {
        ...prev,
        academicLevels: exists ? prev.academicLevels.filter((l) => l !== lvl) : [...prev.academicLevels, lvl],
      };
    });
  };

  const toggleField = (fld: string) => {
    setFormData((prev) => {
      const exists = prev.fieldsOfStudy.includes(fld);
      return {
        ...prev,
        fieldsOfStudy: exists ? prev.fieldsOfStudy.filter((f) => f !== fld) : [...prev.fieldsOfStudy, fld],
      };
    });
  };

  // Document builder handlers
  const addDocument = (preset?: { name: string; desc: string }) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: preset?.name || 'New Document Requirement',
      description: preset?.desc || '',
      mandatory: true,
      originalOrCopy: 'Certified Copy',
      language: 'English',
      translationRequired: 'YES' as const,
      attestationRequired: 'NO' as const,
      formats: ['PDF'],
      condition: 'All applicants',
    };
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: [...prev.requiredDocuments, newDoc],
    }));
  };

  const removeDocument = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((d) => d.id !== id),
    }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Policy check: Cannot publish unless verified
    if (formData.publicationStatus === 'PUBLISHED' && formData.verificationStatus !== 'VERIFIED') {
      setErrorMessage('Policy Error: Only officially verified scholarships can be marked as PUBLISHED. Please verify the checklist in Section 08 first or keep as DRAFT / PENDING_VERIFICATION.');
      setActiveSection('verification');
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isEdit && initialData?.id
        ? `/api/admin/scholarships/${initialData.id}`
        : '/api/admin/scholarships';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save scholarship');
      }

      setSuccessMessage(isEdit ? 'Scholarship programme updated successfully!' : 'Scholarship created successfully!');
      setTimeout(() => {
        router.push('/dashboard/scholarships');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/scholarships"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                {isEdit ? 'Edit Scholarship Programme' : 'Create New Scholarship Programme'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                formData.publicationStatus === 'PUBLISHED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : formData.publicationStatus === 'VERIFIED'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {formData.publicationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-step verified registry for BidyaGo global scholarship opportunities.
            </p>
          </div>
        </div>

        {/* Live Completeness & Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Data Quality
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    completeness.score >= 80 ? 'bg-emerald-500' : completeness.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${completeness.score}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-900">{completeness.score}%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] disabled:bg-slate-300 text-white text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Programme'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-2xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 rounded-2xl flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Sidebar Navigation + Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Rail */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-3 shadow-2xs space-y-1 sticky top-6">
            <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Form Sections
            </div>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-medium transition-all flex items-start gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-[#4b37df] text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <div>{sec.label}</div>
                    <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-purple-100' : 'text-slate-400'}`}>
                      {sec.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Content Area */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-8">
          {/* SECTION 1: BASIC INFORMATION */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">01. Basic Information</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Primary identity, naming, official organisation, and high-level opportunity category.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Scholarship Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. MEXT Japanese Government (Monbukagakusho) Scholarship"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Slug (URL Key) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="mext-japanese-government-scholarship"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Provider / Funding Organisation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="e.g. Ministry of Education (MEXT), Japan"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Provider Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.providerType}
                      onChange={(e) => setFormData({ ...formData, providerType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-hidden focus:border-[#4b37df]"
                    >
                      <option value="Government">Government</option>
                      <option value="University">University</option>
                      <option value="Private organization">Private organization</option>
                      <option value="Foundation">Foundation</option>
                      <option value="International organization">International organization</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Opportunity Classification
                    </label>
                    <select
                      value={formData.opportunityType}
                      onChange={(e) => setFormData({ ...formData, opportunityType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-hidden focus:border-[#4b37df]"
                    >
                      <option value="Degree-seeking scholarship">Degree-seeking scholarship</option>
                      <option value="Exchange opportunity">Exchange opportunity</option>
                      <option value="Research opportunity">Research opportunity</option>
                      <option value="Fellowship">Fellowship</option>
                      <option value="Internship">Internship</option>
                      <option value="Short-term programme">Short-term programme</option>
                    </select>
                  </div>
                </div>

                {/* Categories Multi-Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Scholarship Categories (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Government scholarship', 'University scholarship', 'Merit-based scholarship',
                      'Need-based scholarship', 'Research scholarship', 'Exchange programme',
                      'Fellowship', 'Fully funded scholarship', 'Partial funding scholarship',
                    ].map((cat) => {
                      const selected = formData.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            selected
                              ? 'bg-[#4b37df] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Short description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Short Description (Summary Card) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence overview for cards and listings..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#4b37df]"
                  />
                </div>

                {/* Full description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Description (Markdown / Details) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive program details, historical context, key rules..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 font-mono focus:outline-hidden focus:border-[#4b37df]"
                  />
                </div>

                {/* Official website & Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Official Programme Website <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.officialWebsite}
                      onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#4b37df]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.coverImageUrl}
                      onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#4b37df]"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#4b37df] focus:ring-[#4b37df]"
                    />
                    <span>Mark as Featured Programme</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showOnHomepage}
                      onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                      className="w-4 h-4 rounded text-[#4b37df] focus:ring-[#4b37df]"
                    />
                    <span>Display on Homepage</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: STUDY INFORMATION */}
          {activeSection === 'study' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">02. Study Information</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Destination countries, eligible degree levels, fields of study, and study modes.
                </p>
              </div>

              <div className="space-y-5">
                {/* Destination Countries */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Destination Countries <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COUNTRIES.map((country) => {
                      const selected = formData.destinationCountries.includes(country);
                      return (
                        <button
                          key={country}
                          type="button"
                          onClick={() => toggleCountry(country)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            selected
                              ? 'bg-[#4b37df] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {country}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Academic Levels */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Eligible Academic Levels <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_LEVELS.map((lvl) => {
                      const selected = formData.academicLevels.includes(lvl);
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => toggleLevel(lvl)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            selected
                              ? 'bg-[#4b37df] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fields of study */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Eligible Fields of Study <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_FIELDS.map((fld) => {
                      const selected = formData.fieldsOfStudy.includes(fld);
                      return (
                        <button
                          key={fld}
                          type="button"
                          onClick={() => toggleField(fld)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            selected
                              ? 'bg-[#4b37df] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {fld}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Study Mode <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.studyMode}
                      onChange={(e: any) => setFormData({ ...formData, studyMode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="On-campus">On-campus</option>
                      <option value="Online">Online</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Study Duration
                    </label>
                    <input
                      type="text"
                      value={formData.studyDuration}
                      onChange={(e) => setFormData({ ...formData, studyDuration: e.target.value })}
                      placeholder="e.g. 4-5 Years (Undergrad), 2 Years (Master)"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Intake / Start Period
                    </label>
                    <input
                      type="text"
                      value={formData.intakePeriod}
                      onChange={(e) => setFormData({ ...formData, intakePeriod: e.target.value })}
                      placeholder="e.g. Fall (September/October 2027)"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Study Location / University Coverage
                  </label>
                  <input
                    type="text"
                    value={formData.studyLocation}
                    onChange={(e) => setFormData({ ...formData, studyLocation: e.target.value })}
                    placeholder="e.g. National, public, and designated private universities across Japan"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: ELIGIBILITY CRITERIA */}
          {activeSection === 'eligibility' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">03. Eligibility Criteria</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Core criteria used by BidyaGo to match students with high confidence.
                </p>
              </div>

              {/* Subsection A: Nationality & Residency */}
              <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  A. Nationality & Residency Requirements
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nepalese Applicants Eligible? <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.nepaleseEligible}
                      onChange={(e: any) => setFormData({ ...formData, nepaleseEligible: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="YES">YES - Officially Eligible</option>
                      <option value="CONDITIONAL">CONDITIONAL - Depends on Track/Quota</option>
                      <option value="NO">NO - Nepalese Ineligible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Residency Condition
                    </label>
                    <input
                      type="text"
                      value={formData.residencyRequirements}
                      onChange={(e) => setFormData({ ...formData, residencyRequirements: e.target.value })}
                      placeholder="e.g. Must be currently residing in Nepal at application time"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Subsection B: Age requirements */}
              <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  B. Age Requirements
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum Age</label>
                    <input
                      type="number"
                      value={formData.minAge}
                      onChange={(e) => setFormData({ ...formData, minAge: e.target.value ? Number(e.target.value) : '' })}
                      placeholder="e.g. 17"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Maximum Age</label>
                    <input
                      type="number"
                      value={formData.maxAge}
                      onChange={(e) => setFormData({ ...formData, maxAge: e.target.value ? Number(e.target.value) : '' })}
                      placeholder="e.g. 35 (leave blank if none)"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age Calculation Rule</label>
                    <input
                      type="text"
                      value={formData.ageCalculationDate}
                      onChange={(e) => setFormData({ ...formData, ageCalculationDate: e.target.value })}
                      placeholder="e.g. As of April 1, 2027"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Subsection C: Academic requirements */}
              <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  C. Academic & GPA Requirements
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.minGpa}
                      onChange={(e) => setFormData({ ...formData, minGpa: e.target.value ? Number(e.target.value) : '' })}
                      placeholder="e.g. 3.20"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">GPA Scale</label>
                    <select
                      value={formData.gpaScale}
                      onChange={(e) => setFormData({ ...formData, gpaScale: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="4.0 scale">4.0 scale</option>
                      <option value="5.0 scale">5.0 scale</option>
                      <option value="10.0 scale">10.0 scale</option>
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Other">Other Grading System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum % Equivalent</label>
                    <input
                      type="number"
                      value={formData.minPercentage}
                      onChange={(e) => setFormData({ ...formData, minPercentage: e.target.value ? Number(e.target.value) : '' })}
                      placeholder="e.g. 70"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Required Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.requiredQualification}
                    onChange={(e) => setFormData({ ...formData, requiredQualification: e.target.value })}
                    placeholder="e.g. 4-year Bachelor degree in Engineering or relevant field"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Subsection D: Language requirements */}
              <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  D. Language Testing Requirements
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">IELTS Min Overall</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.languageRequirements.ieltsOverall}
                      onChange={(e) => setFormData({
                        ...formData,
                        languageRequirements: {
                          ...formData.languageRequirements,
                          ieltsOverall: e.target.value ? Number(e.target.value) : '',
                        },
                      })}
                      placeholder="e.g. 6.5"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">TOEFL iBT Min</label>
                    <input
                      type="number"
                      value={formData.languageRequirements.toeflMin}
                      onChange={(e) => setFormData({
                        ...formData,
                        languageRequirements: {
                          ...formData.languageRequirements,
                          toeflMin: e.target.value ? Number(e.target.value) : '',
                        },
                      })}
                      placeholder="e.g. 80"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">PTE Academic Min</label>
                    <input
                      type="number"
                      value={formData.languageRequirements.pteMin}
                      onChange={(e) => setFormData({
                        ...formData,
                        languageRequirements: {
                          ...formData.languageRequirements,
                          pteMin: e.target.value ? Number(e.target.value) : '',
                        },
                      })}
                      placeholder="e.g. 58"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">English Waiver Available?</label>
                    <select
                      value={formData.languageRequirements.waiverAvailable}
                      onChange={(e: any) => setFormData({
                        ...formData,
                        languageRequirements: {
                          ...formData.languageRequirements,
                          waiverAvailable: e.target.value,
                        },
                      })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="NO">NO - Test Mandatory</option>
                      <option value="YES">YES - With MOI Certificate</option>
                      <option value="CONDITIONAL">CONDITIONAL - Course Specific</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: FUNDING & BENEFITS */}
          {activeSection === 'funding' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">04. Funding & Financial Benefits</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Itemized breakdown of tuition, living stipend, airfare, accommodation, and coverage states.
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Funding Classification <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.fundingClassification}
                      onChange={(e) => setFormData({ ...formData, fundingClassification: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white font-semibold text-[#4b37df]"
                    >
                      <option value="Fully funded">Fully funded (Full Ride)</option>
                      <option value="Partially funded">Partially funded</option>
                      <option value="Tuition only">Tuition only</option>
                      <option value="Living allowance only">Living allowance only</option>
                      <option value="Other financial support">Other financial support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tuition Fee Coverage <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.tuitionCoverage}
                      onChange={(e) => setFormData({ ...formData, tuitionCoverage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="Covered">Fully Covered (100% Exemption)</option>
                      <option value="Partially covered">Partially covered (e.g. 50%)</option>
                      <option value="Not covered">Not covered</option>
                      <option value="Depends on circumstances">Depends on circumstances</option>
                    </select>
                  </div>
                </div>

                {/* Monthly Stipend & Currency */}
                <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Living Allowance / Monthly Stipend
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Stipend Amount</label>
                      <input
                        type="number"
                        value={formData.monthlyStipend}
                        onChange={(e) => setFormData({ ...formData, monthlyStipend: e.target.value ? Number(e.target.value) : '' })}
                        placeholder="e.g. 144000"
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Currency</label>
                      <select
                        value={formData.stipendCurrency}
                        onChange={(e) => setFormData({ ...formData, stipendCurrency: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                      >
                        <option value="JPY">JPY (¥ - Japanese Yen)</option>
                        <option value="GBP">GBP (£ - British Pound)</option>
                        <option value="AUD">AUD ($ - Australian Dollar)</option>
                        <option value="USD">USD ($ - US Dollar)</option>
                        <option value="EUR">EUR (€ - Euro)</option>
                        <option value="KRW">KRW (₩ - South Korean Won)</option>
                        <option value="CAD">CAD ($ - Canadian Dollar)</option>
                        <option value="NPR">NPR (Rs - Nepali Rupee)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Frequency</label>
                      <select
                        value={formData.stipendFrequency}
                        onChange={(e) => setFormData({ ...formData, stipendFrequency: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Fortnightly">Fortnightly (Every 2 weeks)</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Annually">Annually</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Benefit Coverage States */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Airfare / Flight</label>
                    <select
                      value={formData.airfareCoverage}
                      onChange={(e) => setFormData({ ...formData, airfareCoverage: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="Covered">Covered (Roundtrip Flights)</option>
                      <option value="Partially covered">Partially covered (One-way)</option>
                      <option value="Not covered">Not covered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Health Insurance</label>
                    <select
                      value={formData.healthInsurance}
                      onChange={(e) => setFormData({ ...formData, healthInsurance: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="Covered">Covered (100%)</option>
                      <option value="Partially covered">Partially covered</option>
                      <option value="Not covered">Not covered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Accommodation</label>
                    <select
                      value={formData.accommodationSupport}
                      onChange={(e) => setFormData({ ...formData, accommodationSupport: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="Covered">Covered (Free Dorm/Housing)</option>
                      <option value="Partially covered">Partially covered / Subsidized</option>
                      <option value="Not specified">Not specified (Paid via Stipend)</option>
                      <option value="Not covered">Not covered</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: APPLICATION DETAILS */}
          {activeSection === 'application' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">05. Application Details</h2>
                <p className="text-xs text-slate-500 mt-1">
                  How applicants submit their documents and navigate selection stages.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Application Route <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.applicationRoute}
                      onChange={(e) => setFormData({ ...formData, applicationRoute: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="Apply through embassy">1. Apply through embassy</option>
                      <option value="Apply directly to university">2. Apply directly to university</option>
                      <option value="Apply through official scholarship portal">3. Apply through official scholarship portal</option>
                      <option value="Apply through participating institution">4. Apply through participating institution</option>
                      <option value="Apply through BidyaGo (Authorized)">5. Apply through BidyaGo (Authorized)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Application Method <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.applicationMethod}
                      onChange={(e) => setFormData({ ...formData, applicationMethod: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline / postal">Offline / postal</option>
                      <option value="Online and offline">Online and offline</option>
                      <option value="Institution-dependent">Institution-dependent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Application Portal URL
                    </label>
                    <input
                      type="url"
                      value={formData.applicationPortalUrl}
                      onChange={(e) => setFormData({ ...formData, applicationPortalUrl: e.target.value })}
                      placeholder="https://apply..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Official Application Guide URL
                    </label>
                    <input
                      type="url"
                      value={formData.applicationGuideUrl}
                      onChange={(e) => setFormData({ ...formData, applicationGuideUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Interview Required?</label>
                    <select
                      value={formData.interviewRequired}
                      onChange={(e: any) => setFormData({ ...formData, interviewRequired: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                      <option value="CONDITIONAL">CONDITIONAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Entrance Examination?</label>
                    <select
                      value={formData.entranceExamination}
                      onChange={(e: any) => setFormData({ ...formData, entranceExamination: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                      <option value="CONDITIONAL">CONDITIONAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="admissions@scholarship.org"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Selection Procedure & Interview Stages
                  </label>
                  <textarea
                    rows={3}
                    value={formData.selectionProcedure}
                    onChange={(e) => setFormData({ ...formData, selectionProcedure: e.target.value })}
                    placeholder="e.g. 1. Document screening, 2. Written language and subject examination, 3. In-person oral interview..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: REQUIRED DOCUMENTS */}
          {activeSection === 'documents' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">06. Required Documents Builder</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Custom document builder with mandatory switches, attestation, and translation requirements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addDocument()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Document</span>
                </button>
              </div>

              {/* Quick Add Presets */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Quick Add Common Documents
                </div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_DOCUMENTS.map((doc) => (
                    <button
                      key={doc.name}
                      type="button"
                      onClick={() => addDocument(doc)}
                      className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#4b37df] hover:text-[#4b37df] text-[11px] text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      + {doc.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-4">
                {formData.requiredDocuments.map((doc, idx) => (
                  <div
                    key={doc.id || idx}
                    className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 relative group hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={doc.name}
                          onChange={(e) => {
                            const updated = [...formData.requiredDocuments];
                            updated[idx].name = e.target.value;
                            setFormData({ ...formData, requiredDocuments: updated });
                          }}
                          placeholder="Document Title"
                          className="font-semibold text-xs sm:text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-[#4b37df] focus:outline-hidden px-1 py-0.5 w-full"
                        />
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={doc.mandatory}
                            onChange={(e) => {
                              const updated = [...formData.requiredDocuments];
                              updated[idx].mandatory = e.target.checked;
                              setFormData({ ...formData, requiredDocuments: updated });
                            }}
                            className="rounded text-[#4b37df]"
                          />
                          <span className={doc.mandatory ? 'font-semibold text-rose-600' : ''}>
                            {doc.mandatory ? 'Mandatory' : 'Optional'}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={doc.description}
                      onChange={(e) => {
                        const updated = [...formData.requiredDocuments];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, requiredDocuments: updated });
                      }}
                      placeholder="Instructions, attestation guidelines, or applicability..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Type</span>
                        <select
                          value={doc.originalOrCopy}
                          onChange={(e) => {
                            const updated = [...formData.requiredDocuments];
                            updated[idx].originalOrCopy = e.target.value;
                            setFormData({ ...formData, requiredDocuments: updated });
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                        >
                          <option value="Certified Copy">Certified Copy</option>
                          <option value="Original">Original</option>
                          <option value="Digital Upload">Digital Upload</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Translation</span>
                        <select
                          value={doc.translationRequired}
                          onChange={(e: any) => {
                            const updated = [...formData.requiredDocuments];
                            updated[idx].translationRequired = e.target.value;
                            setFormData({ ...formData, requiredDocuments: updated });
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                          <option value="CONDITIONAL">CONDITIONAL</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Attestation</span>
                        <select
                          value={doc.attestationRequired}
                          onChange={(e: any) => {
                            const updated = [...formData.requiredDocuments];
                            updated[idx].attestationRequired = e.target.value;
                            setFormData({ ...formData, requiredDocuments: updated });
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                        >
                          <option value="NO">NO</option>
                          <option value="YES">YES</option>
                          <option value="CONDITIONAL">CONDITIONAL</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Applicable Condition</span>
                        <input
                          type="text"
                          value={doc.condition || ''}
                          onChange={(e) => {
                            const updated = [...formData.requiredDocuments];
                            updated[idx].condition = e.target.value;
                            setFormData({ ...formData, requiredDocuments: updated });
                          }}
                          placeholder="e.g. Research track only"
                          className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: SCHOLARSHIP CYCLE */}
          {activeSection === 'cycle' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">07. Scholarship Cycle</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Intake year-specific dates, opening periods, and deadlines. Preserves historical cycles.
                </p>
              </div>

              <div className="p-6 bg-slate-50/70 rounded-3xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cycle Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.initialCycle.cycleName}
                      onChange={(e) => setFormData({
                        ...formData,
                        initialCycle: { ...formData.initialCycle, cycleName: e.target.value },
                      })}
                      placeholder="e.g. MEXT 2027 Research & Undergraduate Intake"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cycle Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.initialCycle.cycleStatus}
                      onChange={(e) => setFormData({
                        ...formData,
                        initialCycle: { ...formData.initialCycle, cycleStatus: e.target.value },
                      })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white font-semibold text-[#4b37df]"
                    >
                      <option value="OPEN">OPEN - Accepting Applications</option>
                      <option value="CLOSING_SOON">CLOSING_SOON - Urgent Deadline</option>
                      <option value="UPCOMING">UPCOMING - Opening Soon</option>
                      <option value="CLOSED">CLOSED</option>
                      <option value="SELECTION_IN_PROGRESS">SELECTION_IN_PROGRESS</option>
                      <option value="RESULTS_ANNOUNCED">RESULTS_ANNOUNCED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Application Year</label>
                    <input
                      type="number"
                      value={formData.initialCycle.applicationYear}
                      onChange={(e) => setFormData({
                        ...formData,
                        initialCycle: { ...formData.initialCycle, applicationYear: Number(e.target.value) },
                      })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Intake Year</label>
                    <input
                      type="number"
                      value={formData.initialCycle.intakeYear}
                      onChange={(e) => setFormData({
                        ...formData,
                        initialCycle: { ...formData.initialCycle, intakeYear: Number(e.target.value) },
                      })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Intake Semester</label>
                    <select
                      value={formData.initialCycle.intakeSemester}
                      onChange={(e) => setFormData({
                        ...formData,
                        initialCycle: { ...formData.initialCycle, intakeSemester: e.target.value },
                      })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="Fall">Fall (Aug / Sep / Oct)</option>
                      <option value="Spring">Spring (Jan / Feb / Mar / Apr)</option>
                      <option value="Summer">Summer</option>
                      <option value="Winter">Winter</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cycle Opening Date</label>
                    <input
                      type="date"
                      value={formData.initialCycle.cycleOpeningDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        initialCycle: { ...formData.initialCycle, cycleOpeningDate: e.target.value },
                      })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Application Deadline <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.initialCycle.applicationDeadline}
                      onChange={(e) => setFormData({
                        ...formData,
                        initialCycle: { ...formData.initialCycle, applicationDeadline: e.target.value },
                      })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white font-medium text-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deadline Timezone</label>
                    <input
                      type="text"
                      value={formData.initialCycle.deadlineTimezone}
                      onChange={(e) => setFormData({
                        ...formData,
                        initialCycle: { ...formData.initialCycle, deadlineTimezone: e.target.value },
                      })}
                      placeholder="UTC+05:45 (Nepal)"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: SOURCES & VERIFICATION */}
          {activeSection === 'verification' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">08. Official Sources & Verification</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Required before publishing. All opportunities on BidyaGo must be cross-verified against official authoritative sources.
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Primary Official Source URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.primaryOfficialSource}
                      onChange={(e) => setFormData({ ...formData, primaryOfficialSource: e.target.value })}
                      placeholder="https://www.np.emb-japan.go.jp/..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Source Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.sourceType}
                      onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    >
                      <option value="Government website">Government website</option>
                      <option value="Embassy website">Embassy website</option>
                      <option value="University website">University website</option>
                      <option value="Official scholarship portal">Official scholarship portal</option>
                      <option value="Official programme document">Official programme document</option>
                      <option value="Other authoritative source">Other authoritative source</option>
                    </select>
                  </div>
                </div>

                {/* 8-Point Verification Checklist */}
                <div className="p-6 bg-purple-50/50 rounded-3xl border border-purple-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4b37df] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>8-Point Mandatory Verification Checklist</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Verify each item against official government / embassy documents before setting status to VERIFIED:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { key: 'exists', label: '1. Scholarship programme actually exists' },
                      { key: 'nepaleseEligible', label: '2. Nepalese applicants eligibility confirmed' },
                      { key: 'levelCorrect', label: '3. Academic degree levels match official guidelines' },
                      { key: 'fundingAccurate', label: '4. Tuition & stipend amounts accurate' },
                      { key: 'deadlineConfirmed', label: '5. Application deadline & intake period confirmed' },
                      { key: 'routeConfirmed', label: '6. Application route (Embassy/Univ) confirmed' },
                      { key: 'documentsConfirmed', label: '7. Required document list verified' },
                      { key: 'urlsWorking', label: '8. Official URLs are live and tested' },
                    ].map((item) => {
                      const checked = Boolean((formData.verificationChecklist as any)[item.key]);
                      return (
                        <label
                          key={item.key}
                          className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors ${
                            checked
                              ? 'bg-white border-purple-300 shadow-2xs font-medium text-slate-900'
                              : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                verificationChecklist: {
                                  ...formData.verificationChecklist,
                                  [item.key]: e.target.checked,
                                },
                              });
                            }}
                            className="w-4 h-4 rounded text-[#4b37df] focus:ring-[#4b37df]"
                          />
                          <span>{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Verification Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.verificationStatus}
                      onChange={(e: any) => setFormData({ ...formData, verificationStatus: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold bg-white ${
                        formData.verificationStatus === 'VERIFIED'
                          ? 'border-emerald-300 text-emerald-700 bg-emerald-50/50'
                          : 'border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="VERIFIED">VERIFIED - Cleared for Publishing</option>
                      <option value="NEEDS_REVISION">NEEDS_REVISION - Requires Further Evidence</option>
                      <option value="UNVERIFIED">UNVERIFIED - In Review</option>
                      <option value="REJECTED">REJECTED - Inaccurate / Ineligible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Next Review Date
                    </label>
                    <input
                      type="date"
                      value={formData.nextReviewDate}
                      onChange={(e) => setFormData({ ...formData, nextReviewDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Auditor Verification Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.verificationNotes}
                    onChange={(e) => setFormData({ ...formData, verificationNotes: e.target.value })}
                    placeholder="Document bulletin numbers, phone confirmation notes with embassy, or specific clauses..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: SEO & PUBLISHING */}
          {activeSection === 'publishing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">09. SEO & Publishing Control</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage public visibility, Google search metadata, and final release state.
                </p>
              </div>

              <div className="space-y-5">
                <div className="p-6 bg-slate-50/60 rounded-3xl border border-slate-200/80 space-y-4">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Publication Decision
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Publication Status <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.publicationStatus}
                        onChange={(e: any) => setFormData({ ...formData, publicationStatus: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white font-semibold"
                      >
                        <option value="DRAFT">DRAFT (Internal only)</option>
                        <option value="PENDING_VERIFICATION">PENDING_VERIFICATION (Awaiting review)</option>
                        <option value="VERIFIED">VERIFIED (Ready to publish)</option>
                        <option value="PUBLISHED">PUBLISHED (Live on Student Portal)</option>
                        <option value="UNPUBLISHED">UNPUBLISHED (Temporarily hidden)</option>
                        <option value="ARCHIVED">ARCHIVED (Historical record)</option>
                      </select>
                      {formData.publicationStatus === 'PUBLISHED' && formData.verificationStatus !== 'VERIFIED' && (
                        <p className="text-[11px] text-rose-600 font-medium mt-1.5">
                          ⚠️ Warning: Only verified scholarships can be published. Switch Section 08 to VERIFIED first.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Display Priority (Higher shows first)
                      </label>
                      <input
                        type="number"
                        value={formData.displayPriority}
                        onChange={(e) => setFormData({ ...formData, displayPriority: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="e.g. MEXT Japanese Government Scholarship for Nepali Students 2027"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="Brief description formatted for Google search snippets (150-160 characters)..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Navigation Controls (Next / Prev) */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={activeSection === SECTIONS[0].id}
              onClick={() => {
                const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
                if (currentIndex > 0) setActiveSection(SECTIONS[currentIndex - 1].id);
              }}
              className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous Section
            </button>

            <div className="flex items-center gap-3">
              {activeSection !== SECTIONS[SECTIONS.length - 1].id ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
                    if (currentIndex < SECTIONS.length - 1) setActiveSection(SECTIONS[currentIndex + 1].id);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                >
                  <span>Continue to {SECTIONS[SECTIONS.findIndex((s) => s.id === activeSection) + 1]?.label}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] disabled:bg-slate-300 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish / Register Scholarship'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
