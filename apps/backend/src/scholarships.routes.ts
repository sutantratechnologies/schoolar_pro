import { Router, type Request, type Response } from 'express';
import { prisma } from '@sass-project/database';
import { auth } from '@sass-project/auth/server';
import { fromNodeHeaders } from 'better-auth/node';

export const scholarshipsRouter: Router = Router();

// Middleware to extract active session
async function getSession(req: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    return authSession;
  } catch {
    return null;
  }
}

// Helper to compute completeness score
export function calculateCompleteness(s: any): { score: number; missing: string[] } {
  const missing: string[] = [];
  let totalPoints = 0;
  let earnedPoints = 0;

  function check(condition: boolean, points: number, label: string) {
    totalPoints += points;
    if (condition) {
      earnedPoints += points;
    } else {
      missing.push(label);
    }
  }

  // Section 1: Basic Info (20 pts)
  check(Boolean(s.title && s.title.trim().length > 3), 4, 'Scholarship title');
  check(Boolean(s.slug && s.slug.trim().length > 2), 2, 'Slug');
  check(Boolean(s.shortDescription && s.shortDescription.trim().length > 10), 4, 'Short description');
  check(Boolean(s.description && s.description.trim().length > 20), 4, 'Full description');
  check(Boolean(s.provider && s.provider.trim().length > 1), 2, 'Scholarship provider');
  check(Boolean(s.providerType), 2, 'Provider type');
  check(Array.isArray(s.categories) && s.categories.length > 0, 2, 'Scholarship category');

  // Section 2: Study Info (15 pts)
  check(Array.isArray(s.destinationCountries) && s.destinationCountries.length > 0, 5, 'Destination country');
  check(Array.isArray(s.academicLevels) && s.academicLevels.length > 0, 4, 'Eligible academic levels');
  check(Array.isArray(s.fieldsOfStudy) && s.fieldsOfStudy.length > 0, 3, 'Eligible fields of study');
  check(Boolean(s.studyMode), 3, 'Study mode');

  // Section 3: Eligibility Criteria (15 pts)
  check(Boolean(s.nepaleseEligible), 4, 'Nepalese applicant eligibility status');
  check(Boolean(s.requiredQualification || s.academicPrerequisites), 4, 'Academic qualification or prerequisites');
  check(Boolean(s.languageRequirements && Object.keys(s.languageRequirements).length > 0), 4, 'Language requirements');
  check(Boolean(s.minGpa || s.minPercentage || s.requiredBackground), 3, 'Academic background or GPA requirement');

  // Section 4: Funding & Benefits (15 pts)
  check(Boolean(s.fundingClassification), 5, 'Funding classification');
  check(Boolean(s.tuitionCoverage), 4, 'Tuition coverage detail');
  check(Boolean(s.monthlyStipend !== undefined || s.stipendFrequency), 3, 'Living allowance / stipend detail');
  check(Boolean(s.airfareCoverage || s.healthInsurance || s.accommodationSupport), 3, 'Travel / Health / Accommodation benefits');

  // Section 5: Application Details (15 pts)
  check(Boolean(s.applicationRoute), 5, 'Application route');
  check(Boolean(s.applicationMethod), 4, 'Application method');
  check(Boolean(s.applicationPortalUrl || s.officialWebsite), 3, 'Application portal or website URL');
  check(Boolean(s.selectionProcedure || s.contactEmail), 3, 'Selection procedure or contact');

  // Section 6: Required Documents (10 pts)
  check(Array.isArray(s.requiredDocuments) && s.requiredDocuments.length > 0, 10, 'Required document checklist');

  // Section 8: Sources & Verification (10 pts)
  check(Boolean(s.primaryOfficialSource && s.primaryOfficialSource.startsWith('http')), 6, 'Primary official source URL');
  check(Boolean(s.sourceType), 4, 'Source type');

  const score = Math.round((earnedPoints / Math.max(totalPoints, 1)) * 100);
  return { score, missing };
}

// In-Memory Seed Storage for Instant Zero-Downtime Resilience
let IN_MEMORY_SCHOLARSHIPS: any[] = [
  {
    id: 'sch_mext_japan',
    title: 'MEXT Japanese Government (Monbukagakusho) Scholarship',
    slug: 'mext-japanese-government-scholarship',
    shortDescription: 'Premier Japanese Government scholarship offering full tuition exemption, monthly stipend of ¥143,000–¥145,000, and roundtrip international airfare.',
    description: `### Overview\nThe Ministry of Education, Culture, Sports, Science and Technology (MEXT) of Japan offers scholarships to international students who wish to study in graduate and undergraduate courses at Japanese universities.\n\n### Tracks\n1. **Embassy Recommendation:** Applications submit through the Embassy of Japan in Nepal.\n2. **University Recommendation:** Direct application to Japanese partner universities.`,
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT)',
    providerType: 'Government',
    opportunityType: 'Degree-seeking scholarship',
    categories: ['Government scholarship', 'Merit-based scholarship', 'Fully funded scholarship'],
    logoUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=128&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
    officialWebsite: 'https://www.np.emb-japan.go.jp/itpr_en/mext.html',
    isFeatured: true,
    showOnHomepage: true,
    visibility: 'PUBLIC',
    publicationStatus: 'PUBLISHED',
    publishedAt: new Date('2026-01-10T00:00:00Z'),
    displayPriority: 10,
    destinationCountries: ['Japan'],
    studyLocation: 'National, Public, and Private Universities across Japan',
    academicLevels: ["Bachelor's", "Master's", "PhD / Doctoral", "Research"],
    fieldsOfStudy: ['Science & Technology', 'Engineering', 'Humanities', 'Social Sciences', 'Medical Sciences', 'Agriculture'],
    specificSubjects: ['Robotics', 'Artificial Intelligence', 'Economics', 'International Relations', 'Biotechnology'],
    studyMode: 'On-campus',
    studyDuration: '4 to 5 years (Undergraduate) / 2 to 3 years (Postgraduate)',
    instructionLanguages: ['English', 'Japanese'],
    intakePeriod: 'April / October 2027',
    participatingInstitutions: ['University of Tokyo', 'Kyoto University', 'Osaka University', 'Tohoku University'],
    eligibleNationalities: ['Nepal', 'India', 'Bangladesh', 'Sri Lanka', 'Global'],
    excludedNationalities: ['Japan'],
    nepaleseEligible: 'YES',
    residencyRequirements: 'Must be residing outside Japan at the time of application.',
    minAge: 17,
    maxAge: 35,
    ageCalculationDate: 'As of April 1 of the intake year',
    ageExceptions: 'Undergraduate candidates must be born on or after April 2, 2002. Research candidates born on or after April 2, 1990.',
    minGpa: 3.2,
    gpaScale: '4.0 scale',
    minPercentage: 75.0,
    requiredQualification: 'Higher Secondary (+2) for Undergrad / Bachelor for Masters / Master for PhD',
    requiredBackground: 'Strong academic record in the relevant field of study.',
    graduationYearReq: 'Graduated within last 3 years or expected to graduate before departure.',
    academicPrerequisites: 'Candidates must clear written examinations conducted by the Japanese Embassy in Kathmandu.',
    languageRequirements: {
      requiredLanguage: 'English or Japanese',
      ieltsOverall: 6.5,
      ieltsBands: { listening: 6.0, reading: 6.0, writing: 6.0, speaking: 6.0 },
      toeflMin: 80,
      pteMin: 58,
      jlptLevel: 'N2 (Optional but recommended for Humanities)',
      waiverAvailable: 'YES',
      notes: 'Applicants proficient in English do not require JLPT for English-taught research programs.'
    },
    otherEligibility: {
      workExperience: 'Not required',
      researchExperience: 'Recommended for Doctoral applicants',
      publications: 'Valuable for Research / PhD track',
      recommendations: '2 academic letters required',
      interviewRequired: 'YES',
      medicalClearance: 'Prescribed MEXT Medical Certificate'
    },
    fundingClassification: 'Fully funded',
    tuitionCoverage: 'Covered',
    tuitionAmount: 0,
    tuitionCurrency: 'JPY',
    monthlyStipend: 144000,
    stipendCurrency: 'JPY',
    stipendFrequency: 'Monthly',
    accommodationSupport: 'Partially covered',
    accommodationAmount: 25000,
    travelAllowance: 'Covered',
    airfareCoverage: 'Covered',
    healthInsurance: 'Covered',
    researchAllowance: 50000,
    booksCoverage: 'Partially covered',
    applicationFeeCoverage: 'Covered',
    otherFinancialBenefits: [
      { title: 'Subsidized University Dormitory', description: 'Access to subsidized international student dormitories.', amount: 20000, currency: 'JPY' },
      { title: 'Intensive Japanese Language Training', description: '6-month preparatory Japanese language instruction covered 100%.', amount: 300000, currency: 'JPY' }
    ],
    benefitsDescription: 'Exemption from examination, matriculation, and tuition fees at national universities. Roundtrip economy class airfare from Kathmandu to Tokyo.',
    applicationRoute: 'Apply through embassy',
    applicationMethod: 'Online and offline',
    applicationPortalUrl: 'https://www.np.emb-japan.go.jp/itpr_en/mext.html',
    applicationGuideUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext_scholarship/',
    applicationFee: 0,
    applicationFeeCurrency: 'USD',
    interviewRequired: 'YES',
    entranceExamination: 'YES',
    selectionProcedure: 'Document screening followed by written subject exams (Math, English, Japanese, Science) and oral interview at the Embassy in Kathmandu.',
    contactEmail: 'cultural-emb@km.mofa.go.jp',
    contactWebsite: 'https://www.np.emb-japan.go.jp',
    requiredDocuments: [
      { id: 'doc-1', name: 'Application Form', description: 'Official MEXT prescribed application form with photograph.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-2', name: 'Field of Study and Research Plan', description: 'Detailed research proposal (for Graduate / Research track).', mandatory: true, originalOrCopy: 'Original', language: 'English or Japanese', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF', 'DOCX'], condition: 'Research / Masters / PhD applicants only' },
      { id: 'doc-3', name: 'Academic Transcripts', description: 'Certified marks sheets of all attended academic years.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'YES', attestationRequired: 'YES', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-4', name: 'Graduation / Degree Certificate', description: 'Provisional or original degree certificate issued by accredited institution.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'YES', attestationRequired: 'YES', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-5', name: 'Recommendation Letter', description: 'Letter from dean, academic advisor, or institution head.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-6', name: 'Medical Certificate', description: 'Standardized MEXT health clearance filled by registered physician.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'Shortlisted applicants' },
      { id: 'doc-7', name: 'Valid Passport / Citizenship', description: 'Scanned copy of bio-data page of Nepali passport.', mandatory: true, originalOrCopy: 'Copy', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF', 'JPG'], condition: 'All applicants' }
    ],
    applicationTracks: [
      { id: 'trk-1', name: 'Embassy Recommendation (Kathmandu)', route: 'Apply through embassy', deadline: 'May 15, 2027', eligibility: 'Open to all eligible Nepali citizens through the Embassy of Japan.', documents: 'Standard MEXT package + Embassy registration slip.', procedureUrl: 'https://www.np.emb-japan.go.jp' },
      { id: 'trk-2', name: 'University Recommendation', route: 'Apply directly to university', deadline: 'December 20, 2026', eligibility: 'Requires pre-approval from a Japanese university professor.', documents: 'Acceptance letter from prospective supervisor + university application.', procedureUrl: 'https://www.studyinjapan.go.jp' }
    ],
    conditionsAndExceptions: [
      { id: 'cond-1', type: 'Restriction', title: 'Military / Medical Internship', description: 'Active military personnel or civilian employees of armed forces are ineligible.' },
      { id: 'cond-2', type: 'Condition', title: 'Arrival Window', description: 'Selected grantees must arrive in Japan during the designated arrival period.' }
    ],
    primaryOfficialSource: 'https://www.np.emb-japan.go.jp/itpr_en/mext.html',
    additionalSources: [
      { url: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext_scholarship/', org: 'JASSO Study in Japan', type: 'Official scholarship portal' },
      { url: 'https://www.mext.go.jp/en/', org: 'MEXT Japan Ministry', type: 'Government website' }
    ],
    sourceOrganization: 'Embassy of Japan in Nepal',
    sourceType: 'Embassy website',
    lastVerifiedDate: new Date('2026-10-15T00:00:00Z'),
    verifiedById: 'admin-1',
    verificationNotes: 'Verified directly with Embassy of Japan Kathmandu press bulletin and official guidelines.',
    verificationStatus: 'VERIFIED',
    verificationChecklist: {
      exists: true,
      nepaleseEligible: true,
      levelCorrect: true,
      fundingAccurate: true,
      deadlineConfirmed: true,
      routeConfirmed: true,
      documentsConfirmed: true,
      urlsWorking: true
    },
    verificationHistory: [
      { verifiedBy: 'Super Admin', date: '2026-10-15', status: 'VERIFIED', notes: 'Full verification against 2027 guideline bulletin.' },
      { verifiedBy: 'Lead Auditor', date: '2026-05-12', status: 'VERIFIED', notes: 'Initial cycle audit complete.' }
    ],
    nextReviewDate: new Date('2027-01-15T00:00:00Z'),
    seoTitle: 'MEXT Japanese Government Scholarship for Nepali Students 2027',
    seoDescription: 'Complete guide to MEXT Japanese Government scholarship for undergraduate and graduate studies in Japan. 100% tuition, monthly stipend, and flights.',
    socialSharingImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
    cycles: [
      {
        id: 'cyc_mext_2027',
        scholarshipId: 'sch_mext_japan',
        cycleName: 'MEXT 2027 Intake Cycle',
        applicationYear: 2027,
        intakeYear: 2027,
        intakeSemester: 'Fall',
        cycleOpeningDate: new Date('2027-04-01T00:00:00Z'),
        applicationDeadline: new Date('2027-05-20T23:59:59Z'),
        deadlineTimezone: 'UTC+05:45',
        selectionAnnouncementDate: new Date('2027-08-15T00:00:00Z'),
        programmeStartDate: new Date('2027-10-01T00:00:00Z'),
        programmeEndDate: new Date('2031-09-30T00:00:00Z'),
        cycleStatus: 'OPEN',
        officialApplicationUrl: 'https://www.np.emb-japan.go.jp/itpr_en/mext.html'
      },
      {
        id: 'cyc_mext_2028',
        scholarshipId: 'sch_mext_japan',
        cycleName: 'MEXT 2028 Advance Planning Cycle',
        applicationYear: 2028,
        intakeYear: 2028,
        intakeSemester: 'Fall',
        cycleOpeningDate: new Date('2028-04-01T00:00:00Z'),
        applicationDeadline: new Date('2028-05-20T23:59:59Z'),
        deadlineTimezone: 'UTC+05:45',
        cycleStatus: 'UPCOMING',
        officialApplicationUrl: 'https://www.np.emb-japan.go.jp/itpr_en/mext.html'
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-10-15T00:00:00Z')
  },
  {
    id: 'sch_chevening_uk',
    title: 'Chevening UK Government Master’s Scholarships',
    slug: 'chevening-uk-government-scholarship',
    shortDescription: 'UK government’s global scholarship programme offering full financial support for a one-year Master’s degree at any UK university.',
    description: `### Overview\nChevening is the UK government’s international awards programme aimed at developing global leaders. Funded by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations.\n\n### Benefits\n- University tuition fees\n- A monthly stipend\n- Travel costs to and from the UK\n- Arrival allowance and homeward departure allowance\n- The cost of one visa application`,
    provider: 'Foreign, Commonwealth & Development Office (FCDO)',
    providerType: 'Government',
    opportunityType: 'Degree-seeking scholarship',
    categories: ['Government scholarship', 'Merit-based scholarship', 'Fully funded scholarship', 'Fellowship'],
    logoUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=128&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1200&q=80',
    officialWebsite: 'https://www.chevening.org/scholarship/nepal/',
    isFeatured: true,
    showOnHomepage: true,
    visibility: 'PUBLIC',
    publicationStatus: 'PUBLISHED',
    publishedAt: new Date('2026-08-01T00:00:00Z'),
    displayPriority: 9,
    destinationCountries: ['United Kingdom'],
    studyLocation: 'Any accredited higher education institution in the United Kingdom',
    academicLevels: ["Master's"],
    fieldsOfStudy: ['Public Policy', 'Climate Change', 'Human Rights', 'Economics', 'Healthcare', 'Engineering'],
    specificSubjects: ['International Development', 'Renewable Energy', 'Data Science', 'Law'],
    studyMode: 'On-campus',
    studyDuration: '1 Year (12 months taught Master’s)',
    instructionLanguages: ['English'],
    intakePeriod: 'September / October 2027',
    participatingInstitutions: ['University of Oxford', 'University of Cambridge', 'LSE', 'UCL', 'University of Edinburgh'],
    eligibleNationalities: ['Nepal', 'Global (160+ partner countries)'],
    excludedNationalities: ['United Kingdom'],
    nepaleseEligible: 'YES',
    residencyRequirements: 'Must return to country of citizenship for a minimum of two years after award ends.',
    minAge: 21,
    maxAge: null,
    ageExceptions: 'No upper age limit for Chevening awards.',
    minGpa: 3.0,
    gpaScale: '4.0 scale',
    minPercentage: 65.0,
    requiredQualification: 'Undergraduate degree that enables entry into a postgraduate programme at a UK university (equivalent to an upper second-class 2:1 honours degree in the UK).',
    requiredBackground: 'At least two years of work experience (equivalent to 2,800 hours).',
    academicPrerequisites: 'Applicants must apply to three eligible UK university courses and receive an unconditional offer from at least one.',
    languageRequirements: {
      requiredLanguage: 'English',
      ieltsOverall: 6.5,
      ieltsBands: { listening: 5.5, reading: 5.5, writing: 5.5, speaking: 5.5 },
      toeflMin: 79,
      pteMin: 58,
      waiverAvailable: 'CONDITIONAL',
      notes: 'English test score requirements depend on the individual UK university course chosen.'
    },
    otherEligibility: {
      workExperience: 'Minimum 2,800 hours of documented work experience.',
      returnObligation: 'Must return to Nepal for at least 2 years post study.',
      previousUKGovAward: 'Cannot have previously studied in the UK with UK government-funded scholarship.'
    },
    fundingClassification: 'Fully funded',
    tuitionCoverage: 'Covered',
    tuitionAmount: 0,
    tuitionCurrency: 'GBP',
    monthlyStipend: 1350,
    stipendCurrency: 'GBP',
    stipendFrequency: 'Monthly',
    accommodationSupport: 'Covered',
    accommodationAmount: 0,
    travelAllowance: 'Covered',
    airfareCoverage: 'Covered',
    healthInsurance: 'Covered',
    researchAllowance: 0,
    booksCoverage: 'Covered',
    applicationFeeCoverage: 'Covered',
    otherFinancialBenefits: [
      { title: 'UK Student Visa Exemption Fee', description: 'Reimbursement of UK Tier 4 visa fee.', amount: 490, currency: 'GBP' },
      { title: 'Arrival & Departure Allowances', description: 'Cash settlement allowance upon UK touchdown and departure.', amount: 500, currency: 'GBP' }
    ],
    benefitsDescription: 'Covers 100% university tuition fees, monthly living stipend, return economy flights, arrival allowance, and travel grants for Chevening events.',
    applicationRoute: 'Apply through official scholarship portal',
    applicationMethod: 'Online',
    applicationPortalUrl: 'https://www.chevening.org/apply/',
    applicationGuideUrl: 'https://www.chevening.org/guidance/',
    applicationFee: 0,
    applicationFeeCurrency: 'GBP',
    interviewRequired: 'YES',
    entranceExamination: 'NO',
    selectionProcedure: 'Online application with 4 leadership & networking essays, followed by shortlisting and panel interview at the British Embassy in Kathmandu.',
    contactEmail: 'nepal@chevening.org',
    contactWebsite: 'https://www.chevening.org/scholarship/nepal/',
    requiredDocuments: [
      { id: 'doc-ch-1', name: 'Four Leadership & Networking Essays', description: 'Leadership influence, networking, study in the UK, and long-term career plan.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['TXT'], condition: 'All applicants' },
      { id: 'doc-ch-2', name: 'Undergraduate Degree Certificate & Transcripts', description: 'Complete official academic records.', mandatory: true, originalOrCopy: 'Copy', language: 'English', translationRequired: 'YES', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-ch-3', name: 'Two Reference Letters', description: 'Academic and professional references who know your leadership qualities.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'Shortlisted candidates' },
      { id: 'doc-ch-4', name: 'Three Eligible UK University Choices', description: 'Applications must list 3 valid 1-year Master’s courses.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' }
    ],
    applicationTracks: [
      { id: 'trk-ch-1', name: 'Chevening Nepal Standard Award', route: 'Apply through official scholarship portal', deadline: 'Early November 2026', eligibility: 'Open to all eligible Nepali citizens with 2+ years work experience.', documents: 'Essays, Degree, 2 references, Unconditional offer.', procedureUrl: 'https://www.chevening.org/apply/' }
    ],
    conditionsAndExceptions: [
      { id: 'cond-ch-1', type: 'Obligation', title: 'Two-year repatriation rule', description: 'Grantees must return to their home country for at least 2 years following completion of studies.' }
    ],
    primaryOfficialSource: 'https://www.chevening.org/scholarship/nepal/',
    additionalSources: [
      { url: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office', org: 'UK Government FCDO', type: 'Government website' }
    ],
    sourceOrganization: 'Chevening Secretariat / British Embassy Kathmandu',
    sourceType: 'Official scholarship portal',
    lastVerifiedDate: new Date('2026-09-01T00:00:00Z'),
    verifiedById: 'admin-1',
    verificationNotes: 'Cross-checked with British High Commission Kathmandu announcements and Chevening portal.',
    verificationStatus: 'VERIFIED',
    verificationChecklist: {
      exists: true,
      nepaleseEligible: true,
      levelCorrect: true,
      fundingAccurate: true,
      deadlineConfirmed: true,
      routeConfirmed: true,
      documentsConfirmed: true,
      urlsWorking: true
    },
    verificationHistory: [
      { verifiedBy: 'Super Admin', date: '2026-09-01', status: 'VERIFIED', notes: 'Cycle 2027 parameters verified.' }
    ],
    nextReviewDate: new Date('2027-02-01T00:00:00Z'),
    seoTitle: 'Chevening UK Scholarship for Nepal 2027 - Application & Guidelines',
    seoDescription: 'Apply for Chevening Scholarship 2027 in Nepal. 100% funding for one-year Master’s in the UK, including flights, stipend, and tuition.',
    socialSharingImage: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1200&q=80',
    cycles: [
      {
        id: 'cyc_chevening_2027',
        scholarshipId: 'sch_chevening_uk',
        cycleName: 'Chevening 2027/2028 Academic Year',
        applicationYear: 2027,
        intakeYear: 2027,
        intakeSemester: 'Fall',
        cycleOpeningDate: new Date('2026-08-05T00:00:00Z'),
        applicationDeadline: new Date('2026-11-05T12:00:00Z'),
        deadlineTimezone: 'UTC+00:00',
        selectionAnnouncementDate: new Date('2027-06-01T00:00:00Z'),
        programmeStartDate: new Date('2027-09-20T00:00:00Z'),
        programmeEndDate: new Date('2028-09-20T00:00:00Z'),
        cycleStatus: 'CLOSING_SOON',
        officialApplicationUrl: 'https://www.chevening.org/apply/'
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z')
  },
  {
    id: 'sch_australia_awards',
    title: 'Australia Awards Scholarships',
    slug: 'australia-awards-scholarships-nepal',
    shortDescription: 'Long-term development awards administered by DFAT providing full tuition, return airfare, establishment allowance, and fortnightly living stipend.',
    description: `### Overview\nAustralia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade (DFAT). They provide opportunities for people from developing countries, particularly those in the Indo-Pacific region, to undertake full-time postgraduate study at participating Australian universities.`,
    provider: 'Department of Foreign Affairs and Trade (DFAT)',
    providerType: 'Government',
    opportunityType: 'Degree-seeking scholarship',
    categories: ['Government scholarship', 'Merit-based scholarship', 'Fully funded scholarship'],
    logoUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=128&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80',
    officialWebsite: 'https://www.australiaawardsnepal.org/',
    isFeatured: true,
    showOnHomepage: true,
    visibility: 'PUBLIC',
    publicationStatus: 'PUBLISHED',
    publishedAt: new Date('2026-02-01T00:00:00Z'),
    displayPriority: 8,
    destinationCountries: ['Australia'],
    studyLocation: 'Australian Universities and Higher Education Institutions',
    academicLevels: ["Master's", "PhD / Doctoral"],
    fieldsOfStudy: ['Economic Development', 'Education', 'Environment & Climate', 'Governance', 'Health & Gender Inclusion'],
    specificSubjects: ['Water Resource Management', 'Public Health', 'Infrastructure Planning'],
    studyMode: 'On-campus',
    studyDuration: 'Up to 2 years (Masters) / 4 years (PhD)',
    instructionLanguages: ['English'],
    intakePeriod: 'January / February 2028',
    participatingInstitutions: ['Australian National University', 'University of Melbourne', 'University of Sydney', 'UNSW Sydney'],
    eligibleNationalities: ['Nepal'],
    excludedNationalities: ['Australia', 'New Zealand'],
    nepaleseEligible: 'YES',
    residencyRequirements: 'Must be a citizen of Nepal and currently residing in Nepal.',
    minAge: 18,
    maxAge: null,
    minGpa: 3.0,
    gpaScale: '4.0 scale',
    minPercentage: 60.0,
    requiredQualification: 'Equivalent of an Australian Bachelor degree with solid academic standing.',
    requiredBackground: 'Minimum 3 years relevant work experience in Nepal.',
    languageRequirements: {
      requiredLanguage: 'English',
      ieltsOverall: 6.5,
      ieltsBands: { listening: 6.0, reading: 6.0, writing: 6.0, speaking: 6.0 },
      toeflMin: 84,
      pteMin: 58,
      waiverAvailable: 'CONDITIONAL',
      notes: 'Applicants with disability or from designated target groups may receive English support.'
    },
    otherEligibility: {
      workExperience: 'At least 3 years of post-qualification full-time work experience.',
      returnObligation: 'Must return to Nepal for minimum 2 years post graduation.'
    },
    fundingClassification: 'Fully funded',
    tuitionCoverage: 'Covered',
    tuitionAmount: 0,
    tuitionCurrency: 'AUD',
    monthlyStipend: 2500,
    stipendCurrency: 'AUD',
    stipendFrequency: 'Monthly',
    accommodationSupport: 'Partially covered',
    accommodationAmount: 0,
    travelAllowance: 'Covered',
    airfareCoverage: 'Covered',
    healthInsurance: 'Covered',
    researchAllowance: 1000,
    booksCoverage: 'Covered',
    applicationFeeCoverage: 'Covered',
    otherFinancialBenefits: [
      { title: 'Establishment Allowance', description: 'One-off payment of AUD 5,000 towards accommodation, books, and study materials upon arrival.', amount: 5000, currency: 'AUD' },
      { title: 'Contribution to Living Expenses (CLE)', description: 'Fortnightly living allowance determined by DFAT.', amount: 1250, currency: 'AUD' },
      { title: 'Overseas Student Health Cover (OSHC)', description: 'Basic medical cover for the awardee for the duration of the scholarship.', amount: 1800, currency: 'AUD' }
    ],
    benefitsDescription: 'Full tuition fees, return air travel, establishment allowance, contribution to living expenses, health cover, and introductory academic program (IAP).',
    applicationRoute: 'Apply through official scholarship portal',
    applicationMethod: 'Online',
    applicationPortalUrl: 'https://oasis.dfat.gov.au/',
    applicationGuideUrl: 'https://www.australiaawardsnepal.org/how-to-apply/',
    applicationFee: 0,
    applicationFeeCurrency: 'AUD',
    interviewRequired: 'YES',
    entranceExamination: 'NO',
    selectionProcedure: 'Application via OASIS portal, assessment against development criteria, followed by panel interview in Kathmandu.',
    contactEmail: 'inquiries@australiaawardsnepal.org',
    contactWebsite: 'https://www.australiaawardsnepal.org',
    requiredDocuments: [
      { id: 'doc-aa-1', name: 'Passport Bio-data Page', description: 'Certified copy of valid Nepali passport.', mandatory: true, originalOrCopy: 'Copy', language: 'English', translationRequired: 'NO', attestationRequired: 'YES', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-aa-2', name: 'Academic Certificates and Transcripts', description: 'Bachelor degree certificates and mark sheets attested by notary.', mandatory: true, originalOrCopy: 'Copy', language: 'English', translationRequired: 'YES', attestationRequired: 'YES', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-aa-3', name: 'Curriculum Vitae (CV)', description: 'Detailed employment and academic CV.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-aa-4', name: 'Development Impact Plan (Re-integration Plan)', description: 'Statement explaining how the skills acquired will benefit Nepal.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' }
    ],
    applicationTracks: [
      { id: 'trk-aa-1', name: 'Public Sector / Government Track', route: 'Apply through official scholarship portal', deadline: 'April 30, 2027', eligibility: 'Permanent civil servants nominated by Government of Nepal.', documents: 'Official Ministry nomination letter + standard documents.', procedureUrl: 'https://www.australiaawardsnepal.org' },
      { id: 'trk-aa-2', name: 'Open / Private Sector Track', route: 'Apply through official scholarship portal', deadline: 'April 30, 2027', eligibility: 'Open competition for private, NGO, and academic sector leaders.', documents: 'Standard OASIS application package.', procedureUrl: 'https://www.australiaawardsnepal.org' }
    ],
    conditionsAndExceptions: [],
    primaryOfficialSource: 'https://www.australiaawardsnepal.org/',
    additionalSources: [
      { url: 'https://www.dfat.gov.au/people-to-people/australia-awards', org: 'DFAT Canberra', type: 'Government website' }
    ],
    sourceOrganization: 'Australia Awards Nepal Office',
    sourceType: 'Official scholarship portal',
    lastVerifiedDate: new Date('2026-08-20T00:00:00Z'),
    verifiedById: 'admin-1',
    verificationNotes: 'Verified against Australia Awards Nepal 2028 country profile.',
    verificationStatus: 'VERIFIED',
    verificationChecklist: {
      exists: true,
      nepaleseEligible: true,
      levelCorrect: true,
      fundingAccurate: true,
      deadlineConfirmed: true,
      routeConfirmed: true,
      documentsConfirmed: true,
      urlsWorking: true
    },
    verificationHistory: [
      { verifiedBy: 'Super Admin', date: '2026-08-20', status: 'VERIFIED', notes: 'Country priorities verified.' }
    ],
    nextReviewDate: new Date('2027-01-10T00:00:00Z'),
    seoTitle: 'Australia Awards Scholarships Nepal 2027/2028 Guide',
    seoDescription: 'Apply for fully-funded Australia Awards Scholarships in Australia for Nepali professionals. Covers tuition, flights, and fortnightly living stipend.',
    socialSharingImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80',
    cycles: [
      {
        id: 'cyc_aust_2028',
        scholarshipId: 'sch_australia_awards',
        cycleName: 'Australia Awards 2028 Intake',
        applicationYear: 2027,
        intakeYear: 2028,
        intakeSemester: 'Spring',
        cycleOpeningDate: new Date('2027-02-01T00:00:00Z'),
        applicationDeadline: new Date('2027-04-30T23:59:59Z'),
        deadlineTimezone: 'UTC+05:45',
        selectionAnnouncementDate: new Date('2027-09-30T00:00:00Z'),
        programmeStartDate: new Date('2028-01-15T00:00:00Z'),
        programmeEndDate: new Date('2030-01-15T00:00:00Z'),
        cycleStatus: 'OPEN',
        officialApplicationUrl: 'https://oasis.dfat.gov.au/'
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-08-20T00:00:00Z')
  },
  {
    id: 'sch_gks_korea',
    title: 'Global Korea Scholarship (GKS / KGSP)',
    slug: 'global-korea-scholarship-gks-kgsp',
    shortDescription: 'National Institute for International Education (NIIED) scholarship offering free Korean language training, full tuition, settlement allowance, and KRW 1,000,000/mo.',
    description: `### Overview\nThe Global Korea Scholarship (GKS) is designed to provide international students with opportunities to study at higher education institutions in Korea in pursuit of academic degrees, which will enhance international education exchange and deepen mutual friendship between Korea and participating countries.`,
    provider: 'National Institute for International Education (NIIED)',
    providerType: 'Government',
    opportunityType: 'Degree-seeking scholarship',
    categories: ['Government scholarship', 'Merit-based scholarship', 'Fully funded scholarship'],
    logoUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=128&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=80',
    officialWebsite: 'https://www.studyinkorea.go.kr/',
    isFeatured: true,
    showOnHomepage: true,
    visibility: 'PUBLIC',
    publicationStatus: 'PUBLISHED',
    publishedAt: new Date('2026-03-01T00:00:00Z'),
    displayPriority: 7,
    destinationCountries: ['South Korea'],
    studyLocation: 'Korean Universities accredited by NIIED',
    academicLevels: ["Bachelor's", "Master's", "PhD / Doctoral", "Research"],
    fieldsOfStudy: ['Engineering', 'Information Technology', 'Natural Sciences', 'Korean Studies', 'Business Administration'],
    specificSubjects: ['Semiconductor Engineering', 'Robotics', 'International Trade'],
    studyMode: 'On-campus',
    studyDuration: '1 year language + 4 years (Undergraduate) or 2 years (Masters) or 3 years (PhD)',
    instructionLanguages: ['Korean', 'English'],
    intakePeriod: 'March / September 2027',
    participatingInstitutions: ['Seoul National University', 'KAIST', 'Korea University', 'Yonsei University', 'POSTECH'],
    eligibleNationalities: ['Nepal', 'Global'],
    excludedNationalities: ['South Korea'],
    nepaleseEligible: 'YES',
    residencyRequirements: 'Must hold foreign citizenship and both parents must not be Korean citizens.',
    minAge: 18,
    maxAge: 40,
    minGpa: 3.2,
    gpaScale: '4.0 scale',
    minPercentage: 80.0,
    requiredQualification: 'High School Diploma (Undergrad) / Bachelor’s Degree (Graduate) / Master’s Degree (PhD)',
    languageRequirements: {
      requiredLanguage: 'English or Korean',
      topikLevel: 'TOPIK 3 for degree entry (1 year language training provided)',
      ieltsOverall: 6.0,
      toeflMin: 78,
      waiverAvailable: 'YES',
      notes: 'Applicants with TOPIK 5 or 6 receive KRW 100,000 extra stipend per month.'
    },
    otherEligibility: {
      medicalClearance: 'Must be in good health, both mentally and physically.',
      previousGKS: 'Previous GKS scholars cannot re-apply except under specific alumni track.'
    },
    fundingClassification: 'Fully funded',
    tuitionCoverage: 'Covered',
    tuitionAmount: 0,
    tuitionCurrency: 'KRW',
    monthlyStipend: 1000000,
    stipendCurrency: 'KRW',
    stipendFrequency: 'Monthly',
    accommodationSupport: 'Covered',
    accommodationAmount: 0,
    travelAllowance: 'Covered',
    airfareCoverage: 'Covered',
    healthInsurance: 'Covered',
    researchAllowance: 210000,
    booksCoverage: 'Covered',
    applicationFeeCoverage: 'Covered',
    otherFinancialBenefits: [
      { title: 'Settlement Allowance', description: 'One-time initial settlement grant of KRW 200,000.', amount: 200000, currency: 'KRW' },
      { title: 'Korean Language Training Fee', description: 'One full year of mandatory Korean language immersion fully covered.', amount: 4000000, currency: 'KRW' },
      { title: 'Degree Completion Grant', description: 'One-time bonus of KRW 100,000 upon graduation.', amount: 100000, currency: 'KRW' }
    ],
    benefitsDescription: 'Airfare, settlement allowance, monthly stipend, medical insurance, Korean language training costs, tuition up to KRW 5 million/semester.',
    applicationRoute: 'Apply through embassy',
    applicationMethod: 'Online and offline',
    applicationPortalUrl: 'https://www.studyinkorea.go.kr/',
    applicationGuideUrl: 'https://overseas.mofa.go.kr/np-en/index.do',
    applicationFee: 0,
    applicationFeeCurrency: 'KRW',
    interviewRequired: 'YES',
    entranceExamination: 'NO',
    selectionProcedure: 'First round review at Embassy of the Republic of Korea in Kathmandu, second round by NIIED selection committee, third round by Korean universities.',
    contactEmail: 'konepemb@mofa.go.kr',
    contactWebsite: 'https://overseas.mofa.go.kr/np-en/index.do',
    requiredDocuments: [
      { id: 'doc-gks-1', name: 'GKS Application Form', description: 'Form 1 with photograph.', mandatory: true, originalOrCopy: 'Original', language: 'English or Korean', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-gks-2', name: 'Personal Statement', description: 'Form 2 addressing motivation, education background, and values.', mandatory: true, originalOrCopy: 'Original', language: 'English or Korean', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-gks-3', name: 'Statement of Purpose / Study Plan', description: 'Form 3 detailing Korean language learning plan and major study goal.', mandatory: true, originalOrCopy: 'Original', language: 'English or Korean', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-gks-4', name: 'Letters of Recommendation', description: 'Form 5 signed in sealed envelope from 2 recommending teachers/professors.', mandatory: true, originalOrCopy: 'Original', language: 'English or Korean', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-gks-5', name: 'Proof of Citizenship & Family Relation', description: 'Birth certificate or citizenship translation proving applicant and parents nationality.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'YES', attestationRequired: 'YES', formats: ['PDF'], condition: 'All applicants' }
    ],
    applicationTracks: [
      { id: 'trk-gks-1', name: 'Embassy Track (Nepal Quota)', route: 'Apply through embassy', deadline: 'Mid-March (Graduate) / Mid-October (Undergraduate)', eligibility: 'Enables application to up to three Korean universities.', documents: 'One original package + 3 authenticated photocopies.', procedureUrl: 'https://overseas.mofa.go.kr/np-en/' },
      { id: 'trk-gks-2', name: 'University Track', route: 'Apply directly to university', deadline: 'Late April / Late October', eligibility: 'Single choice university direct application via participating university.', documents: 'Direct submission to chosen Korean university admissions office.', procedureUrl: 'https://www.studyinkorea.go.kr/' }
    ],
    conditionsAndExceptions: [],
    primaryOfficialSource: 'https://www.studyinkorea.go.kr/',
    additionalSources: [
      { url: 'https://overseas.mofa.go.kr/np-en/index.do', org: 'Embassy of the Republic of Korea in Nepal', type: 'Embassy website' }
    ],
    sourceOrganization: 'NIIED / Korean Embassy Nepal',
    sourceType: 'Government website',
    lastVerifiedDate: new Date('2026-09-10T00:00:00Z'),
    verifiedById: 'admin-1',
    verificationNotes: 'GKS Graduate 2027 and Undergrad 2027 guidelines verified.',
    verificationStatus: 'VERIFIED',
    verificationChecklist: {
      exists: true,
      nepaleseEligible: true,
      levelCorrect: true,
      fundingAccurate: true,
      deadlineConfirmed: true,
      routeConfirmed: true,
      documentsConfirmed: true,
      urlsWorking: true
    },
    verificationHistory: [
      { verifiedBy: 'Super Admin', date: '2026-09-10', status: 'VERIFIED', notes: 'GKS Quotas for Nepal verified.' }
    ],
    nextReviewDate: new Date('2027-02-15T00:00:00Z'),
    seoTitle: 'Global Korea Scholarship (GKS/KGSP) Nepal 2027 Guidelines',
    seoDescription: 'Complete application details for GKS Korea Scholarship for Nepali students. Monthly 1M KRW stipend, full tuition, settlement grant, and flights.',
    socialSharingImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=80',
    cycles: [
      {
        id: 'cyc_gks_2027',
        scholarshipId: 'sch_gks_korea',
        cycleName: 'GKS 2027 Graduate Intake',
        applicationYear: 2027,
        intakeYear: 2027,
        intakeSemester: 'Fall',
        cycleOpeningDate: new Date('2027-02-15T00:00:00Z'),
        applicationDeadline: new Date('2027-03-20T17:00:00Z'),
        deadlineTimezone: 'UTC+05:45',
        selectionAnnouncementDate: new Date('2027-06-25T00:00:00Z'),
        programmeStartDate: new Date('2027-09-01T00:00:00Z'),
        programmeEndDate: new Date('2030-08-31T00:00:00Z'),
        cycleStatus: 'OPEN',
        officialApplicationUrl: 'https://www.studyinkorea.go.kr/'
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-09-10T00:00:00Z')
  },
  {
    id: 'sch_daad_germany',
    title: 'DAAD EPOS Development-Related Postgraduate Courses',
    slug: 'daad-epos-development-postgraduate-courses',
    shortDescription: 'German Academic Exchange Service scholarship providing full tuition waiver, €934 monthly stipend, travel allowance, and comprehensive health insurance.',
    description: `### Overview\nWith its development-oriented postgraduate study programmes (EPOS), the DAAD promotes the training of specialists from developed and newly industrialised countries. Well-trained local experts, who are networked with international partners, play an important part in the sustainable development of their countries.`,
    provider: 'German Academic Exchange Service (DAAD)',
    providerType: 'International organization',
    opportunityType: 'Degree-seeking scholarship',
    categories: ['International organization', 'Merit-based scholarship', 'Fully funded scholarship'],
    logoUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=128&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80',
    officialWebsite: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/',
    isFeatured: false,
    showOnHomepage: true,
    visibility: 'PUBLIC',
    publicationStatus: 'PUBLISHED',
    publishedAt: new Date('2026-05-01T00:00:00Z'),
    displayPriority: 6,
    destinationCountries: ['Germany'],
    studyLocation: 'German Universities participating in EPOS consortium',
    academicLevels: ["Master's", "PhD / Doctoral"],
    fieldsOfStudy: ['Economic Sciences', 'Development Cooperation', 'Engineering', 'Environmental Sciences', 'Public Health', 'Agricultural Science'],
    specificSubjects: ['Renewable Energy Management', 'Global Health', 'Urban Management', 'Water Engineering'],
    studyMode: 'On-campus',
    studyDuration: '12 to 24 months (Master’s) / 36 months (PhD)',
    instructionLanguages: ['English', 'German'],
    intakePeriod: 'October 2027',
    participatingInstitutions: ['University of Bonn', 'Technical University of Munich', 'Heidelberg University', 'TU Dresden'],
    eligibleNationalities: ['Nepal', 'DAC List of ODA Recipients'],
    excludedNationalities: ['Germany', 'EU countries'],
    nepaleseEligible: 'YES',
    residencyRequirements: 'Must be from a developing country and have at least 2 years of professional experience.',
    minAge: 21,
    maxAge: null,
    minGpa: 3.0,
    gpaScale: '4.0 scale',
    minPercentage: 65.0,
    requiredQualification: 'Four-year Bachelor’s degree in a related subject.',
    requiredBackground: 'At least two years of professional experience in a relevant field.',
    languageRequirements: {
      requiredLanguage: 'English or German depending on programme',
      ieltsOverall: 6.5,
      ieltsBands: { listening: 6.0, reading: 6.0, writing: 6.0, speaking: 6.0 },
      toeflMin: 88,
      waiverAvailable: 'CONDITIONAL',
      notes: 'For German-taught programs, minimum DSH 2 or TestDaF 4 required.'
    },
    otherEligibility: {
      workExperience: 'Mandatory minimum 2 years of relevant professional work experience.',
      academicRecency: 'Academic degree should generally not be older than 6 years.'
    },
    fundingClassification: 'Fully funded',
    tuitionCoverage: 'Covered',
    tuitionAmount: 0,
    tuitionCurrency: 'EUR',
    monthlyStipend: 934,
    stipendCurrency: 'EUR',
    stipendFrequency: 'Monthly',
    accommodationSupport: 'Partially covered',
    accommodationAmount: 300,
    travelAllowance: 'Covered',
    airfareCoverage: 'Covered',
    healthInsurance: 'Covered',
    researchAllowance: 460,
    booksCoverage: 'Covered',
    applicationFeeCoverage: 'Covered',
    otherFinancialBenefits: [
      { title: 'Rent Subsidy and Family Supplement', description: 'Additional rent allowance if rent exceeds normal threshold.', amount: 200, currency: 'EUR' },
      { title: 'Preparatory German Language Course', description: 'DAAD covers up to 6 months of German language preparation prior to study.', amount: 1500, currency: 'EUR' }
    ],
    benefitsDescription: 'Monthly stipend of €934 for Master’s candidates (€1,300 for doctoral candidates), payments towards health, accident and personal liability insurance, travel allowance.',
    applicationRoute: 'Apply directly to university',
    applicationMethod: 'Online',
    applicationPortalUrl: 'https://www.daad.de/epos',
    applicationGuideUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    applicationFee: 0,
    applicationFeeCurrency: 'EUR',
    interviewRequired: 'CONDITIONAL',
    entranceExamination: 'NO',
    selectionProcedure: 'Direct application to the respective German university course. Shortlisted candidates are nominated by the university to the DAAD selection committee.',
    contactEmail: 'postgraduate-courses@daad.de',
    contactWebsite: 'https://www.daad.de',
    requiredDocuments: [
      { id: 'doc-daad-1', name: 'DAAD Application Form', description: 'Signed and completed official DAAD application form.', mandatory: true, originalOrCopy: 'Original', language: 'English or German', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-daad-2', name: 'Hand-signed CV (Europass format)', description: 'Updated Europass CV with handwritten date and signature.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-daad-3', name: 'Hand-signed Letter of Motivation', description: 'Motivation statement with precise reference to the course (max 2 pages).', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-daad-4', name: 'Letter of Recommendation from Employer', description: 'Official letterhead signed reference by employer confirming current employment and 2+ years experience.', mandatory: true, originalOrCopy: 'Original', language: 'English', translationRequired: 'NO', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-daad-5', name: 'Certificate of Employment', description: 'Proof of at least two years of relevant work experience after bachelor’s degree.', mandatory: true, originalOrCopy: 'Copy', language: 'English', translationRequired: 'YES', attestationRequired: 'NO', formats: ['PDF'], condition: 'All applicants' },
      { id: 'doc-daad-6', name: 'Certified Academic Certificates & Transcripts', description: 'Academic degree and grading scale explanation.', mandatory: true, originalOrCopy: 'Copy', language: 'English', translationRequired: 'YES', attestationRequired: 'YES', formats: ['PDF'], condition: 'All applicants' }
    ],
    applicationTracks: [
      { id: 'trk-daad-1', name: 'Direct EPOS Course Admission', route: 'Apply directly to university', deadline: 'Varies by course (Aug 31 to Dec 15 annually)', eligibility: 'Open to professionals from Nepal with relevant bachelor degree and 2+ years experience.', documents: 'DAAD EPOS dossier sent directly to the university.', procedureUrl: 'https://www.daad.de/epos' }
    ],
    conditionsAndExceptions: [],
    primaryOfficialSource: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/',
    additionalSources: [
      { url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/', org: 'DAAD Portal', type: 'Official scholarship portal' }
    ],
    sourceOrganization: 'DAAD Bonn, Germany',
    sourceType: 'Official scholarship portal',
    lastVerifiedDate: new Date('2026-07-15T00:00:00Z'),
    verifiedById: 'admin-1',
    verificationNotes: 'Course brochure and dates verified for 2027/2028.',
    verificationStatus: 'VERIFIED',
    verificationChecklist: {
      exists: true,
      nepaleseEligible: true,
      levelCorrect: true,
      fundingAccurate: true,
      deadlineConfirmed: true,
      routeConfirmed: true,
      documentsConfirmed: true,
      urlsWorking: true
    },
    verificationHistory: [
      { verifiedBy: 'Super Admin', date: '2026-07-15', status: 'VERIFIED', notes: 'EPOS university deadlines cross-checked.' }
    ],
    nextReviewDate: new Date('2027-03-01T00:00:00Z'),
    seoTitle: 'DAAD EPOS Scholarships Germany 2027 for Nepal',
    seoDescription: 'Study in Germany with DAAD EPOS scholarship. €934/month stipend, full tuition waiver, flights, and family allowances for Master’s & PhD.',
    socialSharingImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80',
    cycles: [
      {
        id: 'cyc_daad_2027',
        scholarshipId: 'sch_daad_germany',
        cycleName: 'DAAD EPOS 2027/2028 Intake',
        applicationYear: 2027,
        intakeYear: 2027,
        intakeSemester: 'Fall',
        cycleOpeningDate: new Date('2026-08-01T00:00:00Z'),
        applicationDeadline: new Date('2026-12-15T23:59:59Z'),
        deadlineTimezone: 'UTC+01:00',
        selectionAnnouncementDate: new Date('2027-04-15T00:00:00Z'),
        programmeStartDate: new Date('2027-10-01T00:00:00Z'),
        programmeEndDate: new Date('2029-09-30T00:00:00Z'),
        cycleStatus: 'OPEN',
        officialApplicationUrl: 'https://www.daad.de/epos'
      }
    ],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-07-15T00:00:00Z')
  }
];

// 1. GET /api/admin/scholarships - List with filters & metrics
scholarshipsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    const isStaff = role === 'ADMIN' || role === 'SUPER_ADMIN';

    const search = String(req.query.search || '').trim().toLowerCase();
    const status = String(req.query.status || 'ALL');
    const verificationStatus = String(req.query.verificationStatus || 'ALL');
    const funding = String(req.query.funding || 'ALL');
    const country = String(req.query.country || 'ALL');
    const level = String(req.query.level || 'ALL');
    const sort = String(req.query.sort || 'priority');

    // Try database first; fall back to resilient in-memory store
    let items = IN_MEMORY_SCHOLARSHIPS;

    try {
      const dbScholarships = await prisma.scholarship.findMany({
        include: {
          cycles: {
            orderBy: { applicationYear: 'desc' },
          },
        },
        orderBy: [{ displayPriority: 'desc' }, { updatedAt: 'desc' }],
      });
      if (dbScholarships && dbScholarships.length > 0) {
        items = dbScholarships;
      }
    } catch {
      // Postgres offline/unseeded - use in-memory store cleanly
    }

    // Filter items
    let filtered = items.filter((s) => {
      // Public view only sees published scholarships
      if (!isStaff && s.publicationStatus !== 'PUBLISHED') {
        return false;
      }

      if (search) {
        const matchesTitle = s.title?.toLowerCase().includes(search);
        const matchesProvider = s.provider?.toLowerCase().includes(search);
        const matchesCountries = Array.isArray(s.destinationCountries) &&
          s.destinationCountries.some((c: string) => c.toLowerCase().includes(search));
        const matchesSlug = s.slug?.toLowerCase().includes(search);
        if (!matchesTitle && !matchesProvider && !matchesCountries && !matchesSlug) {
          return false;
        }
      }

      if (status !== 'ALL' && s.publicationStatus !== status) {
        return false;
      }

      if (verificationStatus !== 'ALL' && s.verificationStatus !== verificationStatus) {
        return false;
      }

      if (funding !== 'ALL' && s.fundingClassification !== funding) {
        return false;
      }

      if (country !== 'ALL') {
        const hasCountry = Array.isArray(s.destinationCountries) &&
          s.destinationCountries.some((c: string) => c.toLowerCase() === country.toLowerCase());
        if (!hasCountry) return false;
      }

      if (level !== 'ALL') {
        const hasLevel = Array.isArray(s.academicLevels) &&
          s.academicLevels.some((l: string) => l.toLowerCase().includes(level.toLowerCase()));
        if (!hasLevel) return false;
      }

      return true;
    });

    // Sorting
    if (sort === 'priority') {
      filtered.sort((a, b) => (b.displayPriority ?? 0) - (a.displayPriority ?? 0));
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Attach completeness score and current active cycle
    const enriched = filtered.map((s) => {
      const { score, missing } = calculateCompleteness(s);
      const activeCycle = s.cycles?.find((c: any) => c.cycleStatus === 'OPEN' || c.cycleStatus === 'CLOSING_SOON') || s.cycles?.[0];
      return {
        ...s,
        completenessScore: score,
        missingFields: missing,
        activeCycle: activeCycle || null,
        cyclesCount: s.cycles?.length || 0,
      };
    });

    // Compute metrics
    const metrics = {
      total: items.length,
      published: items.filter((s) => s.publicationStatus === 'PUBLISHED').length,
      pendingVerification: items.filter((s) => s.verificationStatus === 'UNVERIFIED' || s.verificationStatus === 'NEEDS_REVISION').length,
      verified: items.filter((s) => s.verificationStatus === 'VERIFIED').length,
      avgCompleteness: Math.round(
        items.reduce((acc, curr) => acc + calculateCompleteness(curr).score, 0) / Math.max(items.length, 1)
      ),
    };

    res.json({
      scholarships: enriched,
      metrics,
      totalCount: enriched.length,
    });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ message: 'Failed to retrieve scholarships.' });
  }
});

// 2. GET /api/admin/scholarships/:id - Single scholarship detail
scholarshipsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = String(rawId);

    // Try database first
    let item: any = null;
    try {
      item = await prisma.scholarship.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
          cycles: {
            orderBy: { applicationYear: 'desc' },
          },
          createdBy: { select: { id: true, name: true, email: true } },
          verifiedBy: { select: { id: true, name: true, email: true } },
        },
      });
    } catch {
      // Fallback
    }

    if (!item) {
      item = IN_MEMORY_SCHOLARSHIPS.find((s) => s.id === id || s.slug === id);
    }

    if (!item) {
      res.status(404).json({ message: 'Scholarship programme not found.' });
      return;
    }

    const { score, missing } = calculateCompleteness(item);

    res.json({
      scholarship: {
        ...item,
        completenessScore: score,
        missingFields: missing,
      },
    });
  } catch (error) {
    console.error('Error fetching scholarship detail:', error);
    res.status(500).json({ message: 'Failed to retrieve scholarship detail.' });
  }
});

// 3. POST /api/admin/scholarships - Create new scholarship programme
scholarshipsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (!session?.user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const body = req.body;
    if (!body.title || !body.title.trim()) {
      res.status(400).json({ message: 'Scholarship title is required.' });
      return;
    }
    if (!body.provider || !body.provider.trim()) {
      res.status(400).json({ message: 'Scholarship provider is required.' });
      return;
    }

    // Auto-generate slug if not provided
    const slug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newId = `sch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    const scholarshipRecord: any = {
      id: newId,
      title: body.title.trim(),
      slug,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      provider: body.provider.trim(),
      providerType: body.providerType || 'Government',
      opportunityType: body.opportunityType || 'Degree-seeking scholarship',
      categories: Array.isArray(body.categories) ? body.categories : ['Government scholarship'],
      logoUrl: body.logoUrl || null,
      coverImageUrl: body.coverImageUrl || null,
      officialWebsite: body.officialWebsite || body.primaryOfficialSource || '',
      isFeatured: Boolean(body.isFeatured),
      showOnHomepage: body.showOnHomepage !== false,
      visibility: body.visibility || 'PUBLIC',
      publicationStatus: body.publicationStatus || 'DRAFT',
      publishedAt: body.publicationStatus === 'PUBLISHED' ? now : null,
      displayPriority: Number(body.displayPriority || 0),

      // Section 2: Study Information
      destinationCountries: Array.isArray(body.destinationCountries) ? body.destinationCountries : [],
      studyLocation: body.studyLocation || null,
      academicLevels: Array.isArray(body.academicLevels) ? body.academicLevels : [],
      fieldsOfStudy: Array.isArray(body.fieldsOfStudy) ? body.fieldsOfStudy : [],
      specificSubjects: Array.isArray(body.specificSubjects) ? body.specificSubjects : [],
      studyMode: body.studyMode || 'On-campus',
      studyDuration: body.studyDuration || null,
      instructionLanguages: Array.isArray(body.instructionLanguages) ? body.instructionLanguages : ['English'],
      intakePeriod: body.intakePeriod || null,
      participatingInstitutions: Array.isArray(body.participatingInstitutions) ? body.participatingInstitutions : [],

      // Section 3: Eligibility
      eligibleNationalities: Array.isArray(body.eligibleNationalities) ? body.eligibleNationalities : ['Nepal'],
      excludedNationalities: Array.isArray(body.excludedNationalities) ? body.excludedNationalities : [],
      nepaleseEligible: body.nepaleseEligible || 'YES',
      residencyRequirements: body.residencyRequirements || null,
      minAge: body.minAge ? Number(body.minAge) : null,
      maxAge: body.maxAge ? Number(body.maxAge) : null,
      ageCalculationDate: body.ageCalculationDate || null,
      ageExceptions: body.ageExceptions || null,
      minGpa: body.minGpa ? Number(body.minGpa) : null,
      gpaScale: body.gpaScale || '4.0 scale',
      minPercentage: body.minPercentage ? Number(body.minPercentage) : null,
      requiredQualification: body.requiredQualification || null,
      requiredBackground: body.requiredBackground || null,
      graduationYearReq: body.graduationYearReq || null,
      academicPrerequisites: body.academicPrerequisites || null,
      languageRequirements: body.languageRequirements || {},
      otherEligibility: body.otherEligibility || {},

      // Section 4: Funding & Benefits
      fundingClassification: body.fundingClassification || 'Fully funded',
      tuitionCoverage: body.tuitionCoverage || 'Covered',
      tuitionAmount: body.tuitionAmount ? Number(body.tuitionAmount) : null,
      tuitionCurrency: body.tuitionCurrency || 'USD',
      monthlyStipend: body.monthlyStipend ? Number(body.monthlyStipend) : null,
      stipendCurrency: body.stipendCurrency || 'USD',
      stipendFrequency: body.stipendFrequency || 'Monthly',
      accommodationSupport: body.accommodationSupport || 'Not specified',
      accommodationAmount: body.accommodationAmount ? Number(body.accommodationAmount) : null,
      travelAllowance: body.travelAllowance || 'Not covered',
      airfareCoverage: body.airfareCoverage || 'Covered',
      healthInsurance: body.healthInsurance || 'Covered',
      researchAllowance: body.researchAllowance ? Number(body.researchAllowance) : null,
      booksCoverage: body.booksCoverage || null,
      applicationFeeCoverage: body.applicationFeeCoverage || null,
      otherFinancialBenefits: Array.isArray(body.otherFinancialBenefits) ? body.otherFinancialBenefits : [],
      benefitsDescription: body.benefitsDescription || null,

      // Section 5: Application Details
      applicationRoute: body.applicationRoute || 'Apply through official scholarship portal',
      applicationMethod: body.applicationMethod || 'Online',
      applicationPortalUrl: body.applicationPortalUrl || null,
      applicationGuideUrl: body.applicationGuideUrl || null,
      applicationFee: body.applicationFee ? Number(body.applicationFee) : 0,
      applicationFeeCurrency: body.applicationFeeCurrency || 'USD',
      interviewRequired: body.interviewRequired || 'NO',
      entranceExamination: body.entranceExamination || 'NO',
      selectionProcedure: body.selectionProcedure || null,
      contactEmail: body.contactEmail || null,
      contactWebsite: body.contactWebsite || null,

      // Section 6 & Tracks
      requiredDocuments: Array.isArray(body.requiredDocuments) ? body.requiredDocuments : [],
      applicationTracks: Array.isArray(body.applicationTracks) ? body.applicationTracks : [],
      conditionsAndExceptions: Array.isArray(body.conditionsAndExceptions) ? body.conditionsAndExceptions : [],

      // Section 8: Sources & Verification
      primaryOfficialSource: body.primaryOfficialSource || body.officialWebsite || 'https://bidyago.com',
      additionalSources: Array.isArray(body.additionalSources) ? body.additionalSources : [],
      sourceOrganization: body.sourceOrganization || body.provider,
      sourceType: body.sourceType || 'Official scholarship portal',
      lastVerifiedDate: body.verificationStatus === 'VERIFIED' ? now : null,
      verifiedById: body.verificationStatus === 'VERIFIED' ? session.user.id : null,
      verificationNotes: body.verificationNotes || null,
      verificationStatus: body.verificationStatus || 'UNVERIFIED',
      verificationChecklist: body.verificationChecklist || {},
      verificationHistory: body.verificationStatus === 'VERIFIED'
        ? [{ verifiedBy: session.user.name, date: now.toISOString(), status: 'VERIFIED', notes: 'Initial verification' }]
        : [],
      nextReviewDate: body.nextReviewDate ? new Date(body.nextReviewDate) : null,

      // Section 9: SEO
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.shortDescription,
      socialSharingImage: body.socialSharingImage || body.coverImageUrl || null,

      createdById: session.user.id,
      createdAt: now,
      updatedAt: now,
      cycles: [],
    };

    // If an initial cycle was submitted, attach it
    if (body.initialCycle && body.initialCycle.cycleName) {
      const cycleRecord = {
        id: `cyc_${Date.now()}`,
        scholarshipId: newId,
        cycleName: body.initialCycle.cycleName,
        applicationYear: Number(body.initialCycle.applicationYear || now.getFullYear()),
        intakeYear: Number(body.initialCycle.intakeYear || now.getFullYear() + 1),
        intakeSemester: body.initialCycle.intakeSemester || 'Fall',
        cycleOpeningDate: body.initialCycle.cycleOpeningDate ? new Date(body.initialCycle.cycleOpeningDate) : null,
        applicationDeadline: body.initialCycle.applicationDeadline ? new Date(body.initialCycle.applicationDeadline) : null,
        deadlineTimezone: body.initialCycle.deadlineTimezone || 'UTC+05:45',
        selectionAnnouncementDate: body.initialCycle.selectionAnnouncementDate ? new Date(body.initialCycle.selectionAnnouncementDate) : null,
        programmeStartDate: body.initialCycle.programmeStartDate ? new Date(body.initialCycle.programmeStartDate) : null,
        programmeEndDate: body.initialCycle.programmeEndDate ? new Date(body.initialCycle.programmeEndDate) : null,
        cycleStatus: body.initialCycle.cycleStatus || 'OPEN',
        officialApplicationUrl: body.initialCycle.officialApplicationUrl || body.applicationPortalUrl || null,
        createdAt: now,
        updatedAt: now,
      };
      scholarshipRecord.cycles.push(cycleRecord);
    }

    // Try DB insertion first
    try {
      const created = await prisma.scholarship.create({
        data: {
          ...scholarshipRecord,
          cycles: {
            create: scholarshipRecord.cycles.map((c: any) => ({
              cycleName: c.cycleName,
              applicationYear: c.applicationYear,
              intakeYear: c.intakeYear,
              intakeSemester: c.intakeSemester,
              cycleOpeningDate: c.cycleOpeningDate,
              applicationDeadline: c.applicationDeadline,
              deadlineTimezone: c.deadlineTimezone,
              selectionAnnouncementDate: c.selectionAnnouncementDate,
              programmeStartDate: c.programmeStartDate,
              programmeEndDate: c.programmeEndDate,
              cycleStatus: c.cycleStatus,
              officialApplicationUrl: c.officialApplicationUrl,
            })),
          },
        },
        include: { cycles: true },
      });
      // Audit log
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: 'SCHOLARSHIP_CREATED',
          resource: 'scholarship',
          resourceId: created.id,
          metadata: { title: created.title, slug: created.slug },
        },
      });
      res.status(201).json({ success: true, scholarship: created });
      return;
    } catch (dbErr) {
      console.warn('DB create failed (using in-memory store):', dbErr);
    }

    // Fallback: save to in-memory store
    IN_MEMORY_SCHOLARSHIPS.unshift(scholarshipRecord);

    res.status(201).json({
      success: true,
      message: 'Scholarship programme created successfully.',
      scholarship: scholarshipRecord,
    });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    res.status(500).json({ message: 'Failed to create scholarship programme.' });
  }
});

// 4. PUT /api/admin/scholarships/:id - Update scholarship programme
scholarshipsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (!session?.user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = String(rawId);
    const body = req.body;
    const now = new Date();

    // Check publication rule: only verified scholarships should be eligible for publication
    if (body.publicationStatus === 'PUBLISHED') {
      const isVerified = body.verificationStatus === 'VERIFIED';
      if (!isVerified) {
        res.status(400).json({
          message: 'Policy Violation: Only verified scholarships can be published. Complete the Sources & Verification checklist first.',
        });
        return;
      }
    }

    // Try DB update
    try {
      const updated = await prisma.scholarship.update({
        where: { id },
        data: {
          title: body.title,
          slug: body.slug,
          shortDescription: body.shortDescription,
          description: body.description,
          provider: body.provider,
          providerType: body.providerType,
          opportunityType: body.opportunityType,
          categories: body.categories,
          logoUrl: body.logoUrl,
          coverImageUrl: body.coverImageUrl,
          officialWebsite: body.officialWebsite,
          isFeatured: body.isFeatured,
          showOnHomepage: body.showOnHomepage,
          visibility: body.visibility,
          publicationStatus: body.publicationStatus,
          publishedAt: body.publicationStatus === 'PUBLISHED' ? now : undefined,
          displayPriority: body.displayPriority ? Number(body.displayPriority) : undefined,
          destinationCountries: body.destinationCountries,
          studyLocation: body.studyLocation,
          academicLevels: body.academicLevels,
          fieldsOfStudy: body.fieldsOfStudy,
          specificSubjects: body.specificSubjects,
          studyMode: body.studyMode,
          studyDuration: body.studyDuration,
          instructionLanguages: body.instructionLanguages,
          intakePeriod: body.intakePeriod,
          participatingInstitutions: body.participatingInstitutions,
          eligibleNationalities: body.eligibleNationalities,
          excludedNationalities: body.excludedNationalities,
          nepaleseEligible: body.nepaleseEligible,
          residencyRequirements: body.residencyRequirements,
          minAge: body.minAge ? Number(body.minAge) : null,
          maxAge: body.maxAge ? Number(body.maxAge) : null,
          ageCalculationDate: body.ageCalculationDate,
          ageExceptions: body.ageExceptions,
          minGpa: body.minGpa ? Number(body.minGpa) : null,
          gpaScale: body.gpaScale,
          minPercentage: body.minPercentage ? Number(body.minPercentage) : null,
          requiredQualification: body.requiredQualification,
          requiredBackground: body.requiredBackground,
          graduationYearReq: body.graduationYearReq,
          academicPrerequisites: body.academicPrerequisites,
          languageRequirements: body.languageRequirements,
          otherEligibility: body.otherEligibility,
          fundingClassification: body.fundingClassification,
          tuitionCoverage: body.tuitionCoverage,
          tuitionAmount: body.tuitionAmount ? Number(body.tuitionAmount) : null,
          tuitionCurrency: body.tuitionCurrency,
          monthlyStipend: body.monthlyStipend ? Number(body.monthlyStipend) : null,
          stipendCurrency: body.stipendCurrency,
          stipendFrequency: body.stipendFrequency,
          accommodationSupport: body.accommodationSupport,
          accommodationAmount: body.accommodationAmount ? Number(body.accommodationAmount) : null,
          travelAllowance: body.travelAllowance,
          airfareCoverage: body.airfareCoverage,
          healthInsurance: body.healthInsurance,
          researchAllowance: body.researchAllowance ? Number(body.researchAllowance) : null,
          booksCoverage: body.booksCoverage,
          applicationFeeCoverage: body.applicationFeeCoverage,
          otherFinancialBenefits: body.otherFinancialBenefits,
          benefitsDescription: body.benefitsDescription,
          applicationRoute: body.applicationRoute,
          applicationMethod: body.applicationMethod,
          applicationPortalUrl: body.applicationPortalUrl,
          applicationGuideUrl: body.applicationGuideUrl,
          applicationFee: body.applicationFee ? Number(body.applicationFee) : 0,
          applicationFeeCurrency: body.applicationFeeCurrency,
          interviewRequired: body.interviewRequired,
          entranceExamination: body.entranceExamination,
          selectionProcedure: body.selectionProcedure,
          contactEmail: body.contactEmail,
          contactWebsite: body.contactWebsite,
          requiredDocuments: body.requiredDocuments,
          applicationTracks: body.applicationTracks,
          conditionsAndExceptions: body.conditionsAndExceptions,
          primaryOfficialSource: body.primaryOfficialSource,
          additionalSources: body.additionalSources,
          sourceOrganization: body.sourceOrganization,
          sourceType: body.sourceType,
          lastVerifiedDate: body.verificationStatus === 'VERIFIED' ? now : undefined,
          verifiedById: body.verificationStatus === 'VERIFIED' ? session.user.id : undefined,
          verificationNotes: body.verificationNotes,
          verificationStatus: body.verificationStatus,
          verificationChecklist: body.verificationChecklist,
          verificationHistory: body.verificationHistory,
          nextReviewDate: body.nextReviewDate ? new Date(body.nextReviewDate) : undefined,
          seoTitle: body.seoTitle,
          seoDescription: body.seoDescription,
          socialSharingImage: body.socialSharingImage,
        },
        include: { cycles: true },
      });

      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: 'SCHOLARSHIP_UPDATED',
          resource: 'scholarship',
          resourceId: id,
          metadata: { title: updated.title },
        },
      });

      res.json({ success: true, scholarship: updated });
      return;
    } catch {
      // In-memory update
      const index = IN_MEMORY_SCHOLARSHIPS.findIndex((s) => s.id === id);
      if (index !== -1) {
        IN_MEMORY_SCHOLARSHIPS[index] = {
          ...IN_MEMORY_SCHOLARSHIPS[index],
          ...body,
          updatedAt: now,
        };
        res.json({ success: true, scholarship: IN_MEMORY_SCHOLARSHIPS[index] });
        return;
      }
    }

    res.status(404).json({ message: 'Scholarship not found.' });
  } catch (error) {
    console.error('Error updating scholarship:', error);
    res.status(500).json({ message: 'Failed to update scholarship.' });
  }
});

// 5. PATCH /api/admin/scholarships/:id/publish - Quick toggle / update publication status
scholarshipsRouter.patch('/:id/publish', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (!session?.user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = String(rawId);
    const targetStatus = req.body.status; // 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED' | 'DRAFT'

    // Retrieve target item
    let item = IN_MEMORY_SCHOLARSHIPS.find((s) => s.id === id);
    try {
      const dbItem = await prisma.scholarship.findUnique({ where: { id } });
      if (dbItem) item = dbItem;
    } catch {
      // Fallback
    }

    if (!item) {
      res.status(404).json({ message: 'Scholarship programme not found.' });
      return;
    }

    // Critical Policy: Cannot publish unless verified!
    if (targetStatus === 'PUBLISHED' && item.verificationStatus !== 'VERIFIED') {
      res.status(400).json({
        message: 'Publication Blocked: This scholarship has not been officially verified yet. Complete the 8-point verification checklist first.',
      });
      return;
    }

    const now = new Date();

    try {
      const updated = await prisma.scholarship.update({
        where: { id },
        data: {
          publicationStatus: targetStatus,
          publishedAt: targetStatus === 'PUBLISHED' ? now : item.publishedAt,
        },
      });
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: `SCHOLARSHIP_${targetStatus}`,
          resource: 'scholarship',
          resourceId: id,
        },
      });
      res.json({ success: true, publicationStatus: updated.publicationStatus });
      return;
    } catch {
      // In-memory
      item.publicationStatus = targetStatus;
      if (targetStatus === 'PUBLISHED') item.publishedAt = now;
      res.json({ success: true, publicationStatus: targetStatus });
    }
  } catch (error) {
    console.error('Error changing publication status:', error);
    res.status(500).json({ message: 'Failed to update publication status.' });
  }
});

// 6. PATCH /api/admin/scholarships/:id/verify - Update verification status & checklist
scholarshipsRouter.patch('/:id/verify', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (!session?.user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = String(rawId);
    const { verificationStatus, checklist, notes } = req.body;
    const now = new Date();

    const verificationEntry = {
      verifiedBy: session.user.name,
      verifiedById: session.user.id,
      date: now.toISOString(),
      status: verificationStatus,
      notes: notes || 'Checklist updated',
    };

    try {
      const current = await prisma.scholarship.findUnique({ where: { id } });
      const history = Array.isArray(current?.verificationHistory)
        ? [...(current.verificationHistory as any[]), verificationEntry]
        : [verificationEntry];

      const updated = await prisma.scholarship.update({
        where: { id },
        data: {
          verificationStatus,
          verificationChecklist: checklist,
          verificationNotes: notes,
          verificationHistory: history,
          lastVerifiedDate: verificationStatus === 'VERIFIED' ? now : current?.lastVerifiedDate,
          verifiedById: verificationStatus === 'VERIFIED' ? session.user.id : current?.verifiedById,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: 'SCHOLARSHIP_VERIFIED',
          resource: 'scholarship',
          resourceId: id,
          metadata: { status: verificationStatus },
        },
      });

      res.json({ success: true, scholarship: updated });
      return;
    } catch {
      // In-memory
      const item = IN_MEMORY_SCHOLARSHIPS.find((s) => s.id === id);
      if (item) {
        item.verificationStatus = verificationStatus;
        item.verificationChecklist = checklist;
        item.verificationNotes = notes;
        if (!Array.isArray(item.verificationHistory)) item.verificationHistory = [];
        item.verificationHistory.unshift(verificationEntry);
        if (verificationStatus === 'VERIFIED') {
          item.lastVerifiedDate = now;
          item.verifiedById = session.user.id;
        }
        res.json({ success: true, scholarship: item });
        return;
      }
    }

    res.status(404).json({ message: 'Scholarship not found.' });
  } catch (error) {
    console.error('Error verifying scholarship:', error);
    res.status(500).json({ message: 'Failed to update verification status.' });
  }
});

// 7. DELETE /api/admin/scholarships/:id - Delete or archive
scholarshipsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (!session?.user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = String(rawId);
    const permanent = req.query.permanent === 'true';

    try {
      if (permanent) {
        await prisma.scholarship.delete({ where: { id } });
      } else {
        await prisma.scholarship.update({
          where: { id },
          data: { publicationStatus: 'ARCHIVED' },
        });
      }

      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: permanent ? 'SCHOLARSHIP_DELETED_PERMANENT' : 'SCHOLARSHIP_ARCHIVED',
          resource: 'scholarship',
          resourceId: id,
        },
      });

      res.json({ success: true, message: permanent ? 'Scholarship deleted permanently.' : 'Scholarship archived.' });
      return;
    } catch {
      // In-memory
      const idx = IN_MEMORY_SCHOLARSHIPS.findIndex((s) => s.id === id);
      if (idx !== -1) {
        if (permanent) {
          IN_MEMORY_SCHOLARSHIPS.splice(idx, 1);
        } else {
          IN_MEMORY_SCHOLARSHIPS[idx].publicationStatus = 'ARCHIVED';
        }
        res.json({ success: true, message: permanent ? 'Scholarship deleted permanently.' : 'Scholarship archived.' });
        return;
      }
    }

    res.status(404).json({ message: 'Scholarship not found.' });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    res.status(500).json({ message: 'Failed to delete or archive scholarship.' });
  }
});

// 8. Cycles management: POST /api/admin/scholarships/:id/cycles
scholarshipsRouter.post('/:id/cycles', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (!session?.user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const scholarshipId = String(rawId);
    const body = req.body;
    const now = new Date();

    const cycleRecord = {
      id: `cyc_${Date.now()}`,
      scholarshipId,
      cycleName: body.cycleName || `${body.applicationYear || now.getFullYear()} Application Cycle`,
      applicationYear: Number(body.applicationYear || now.getFullYear()),
      intakeYear: Number(body.intakeYear || now.getFullYear() + 1),
      intakeSemester: body.intakeSemester || 'Fall',
      cycleOpeningDate: body.cycleOpeningDate ? new Date(body.cycleOpeningDate) : null,
      applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
      deadlineTimezone: body.deadlineTimezone || 'UTC+05:45',
      selectionAnnouncementDate: body.selectionAnnouncementDate ? new Date(body.selectionAnnouncementDate) : null,
      programmeStartDate: body.programmeStartDate ? new Date(body.programmeStartDate) : null,
      programmeEndDate: body.programmeEndDate ? new Date(body.programmeEndDate) : null,
      cycleStatus: body.cycleStatus || 'OPEN',
      officialApplicationUrl: body.officialApplicationUrl || null,
      cycleEligibilityOverrides: body.cycleEligibilityOverrides || null,
      cycleFundingOverrides: body.cycleFundingOverrides || null,
      cycleDocumentOverrides: body.cycleDocumentOverrides || null,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const created = await prisma.scholarshipCycle.create({
        data: cycleRecord,
      });
      res.status(201).json({ success: true, cycle: created });
      return;
    } catch {
      // In-memory
      const p = IN_MEMORY_SCHOLARSHIPS.find((s) => s.id === scholarshipId);
      if (p) {
        if (!Array.isArray(p.cycles)) p.cycles = [];
        p.cycles.unshift(cycleRecord);
        res.status(201).json({ success: true, cycle: cycleRecord });
        return;
      }
    }

    res.status(404).json({ message: 'Scholarship not found.' });
  } catch (error) {
    console.error('Error creating cycle:', error);
    res.status(500).json({ message: 'Failed to create scholarship cycle.' });
  }
});
