export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | '';

export type PreferredContactMethod = 'email' | 'whatsapp' | 'phone' | '';

export interface PersonalInfo {
  profilePhoto?: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
  nationality: string; // Default: "Nepal"
  currentCountry: string; // Default: "Nepal"
  city: string;
  phone: string;
  preferredContact: PreferredContactMethod;
}

export type EducationLevel =
  | 'see'
  | 'plus_two'
  | 'diploma'
  | 'bachelors'
  | 'masters'
  | 'phd'
  | 'other';

export type GradingSystem =
  | 'gpa_4'
  | 'percentage'
  | 'cgpa_10'
  | 'division'
  | 'other';

export interface EducationRecord {
  id: string;
  level: EducationLevel;
  qualification: string; // e.g. "B.Sc. Computer Science"
  institution: string; // e.g. "Tribhuvan University"
  fieldOfStudy: string; // e.g. "Computer Science & AI"
  gpaOrPercentage: string; // e.g. "3.75" or "78%"
  gradingSystem: GradingSystem;
  graduationYear: string;
  isCurrentlyStudying: boolean;
  expectedGraduationYear?: string;
}

export type AcademicLevelPreference =
  | 'bachelors'
  | 'masters'
  | 'phd'
  | 'research_fellowship'
  | 'diploma';

export type StudyDurationPreference =
  | '1_year'
  | '2_years'
  | '3_4_years'
  | 'flexible';

export interface StudyPreferences {
  destinationCountries: string[]; // e.g. ["Japan", "Australia", "United Kingdom", "South Korea", "Erasmus Mundus"]
  intendedAcademicLevel: AcademicLevelPreference;
  preferredFields: string[]; // e.g. ["Computer Science & AI", "Engineering"]
  intendedIntakeYear: string; // e.g. "2026"
  preferredStudyDuration: StudyDurationPreference;
  preferredUniversities: string;
}

export type FundingOption =
  | 'fully_funded'
  | 'fully_or_partial'
  | 'tuition_waiver'
  | 'partial_scholarship'
  | 'research_funding'
  | 'any';

export type CoveragePreference = 'essential' | 'preferred' | 'not_essential';

export interface FundingPreferences {
  fundingPreference: FundingOption;
  tuitionCoverage: '100_percent' | 'partial' | 'any';
  livingExpensesCoverage: CoveragePreference;
  travelSupport: CoveragePreference;
  applicationFeeSupport: CoveragePreference;
}

export type EnglishProficiencyLevel =
  | 'native_fluent'
  | 'advanced'
  | 'intermediate'
  | 'beginner'
  | 'none'
  | '';

export type JapaneseProficiencyLevel =
  | 'native_fluent'
  | 'n1'
  | 'n2'
  | 'n3'
  | 'n4'
  | 'n5'
  | 'beginner'
  | 'none'
  | '';

export type JLPTLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'none' | '';

export type TOPIKLevel =
  | 'level_1'
  | 'level_2'
  | 'level_3'
  | 'level_4'
  | 'level_5'
  | 'level_6'
  | 'none'
  | '';

export interface LanguageProficiency {
  englishProficiency: EnglishProficiencyLevel;
  ieltsScore: string; // e.g. "7.5"
  toeflScore: string; // e.g. "100"
  japaneseProficiency: JapaneseProficiencyLevel;
  jlptLevel: JLPTLevel;
  koreanProficiency: string;
  topikLevel: TOPIKLevel;
  otherLanguages: string; // e.g. "German B1"
}

export interface AchievementsExperience {
  academicAchievements: string;
  researchExperience: string;
  workExperience: string;
  internshipExperience: string;
  volunteering: string;
  extracurriculars: string;
  awardsAndCertificates: string;
}

export type ReadinessStatus = 'yes' | 'in_progress' | 'no' | '';

export interface ApplicationReadiness {
  hasPassport: ReadinessStatus;
  hasCV: ReadinessStatus;
  hasTranscripts: ReadinessStatus;
  hasRecommendations: ReadinessStatus;
  hasSOP: ReadinessStatus;
  plannedApplicationTimeline: string; // e.g. "Immediate", "Within 3-6 months", "Next Year"
}

export interface StudentProfile {
  personalInfo: PersonalInfo;
  educationRecords: EducationRecord[];
  studyPreferences: StudyPreferences;
  fundingPreferences: FundingPreferences;
  languageProficiency: LanguageProficiency;
  achievementsExperience: AchievementsExperience;
  applicationReadiness: ApplicationReadiness;
  lastUpdated?: string;
  isCompleted?: boolean;
}

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  personalInfo: {
    fullName: 'Aarav Sharma',
    dateOfBirth: '2001-08-15',
    gender: 'male',
    nationality: 'Nepal',
    currentCountry: 'Nepal',
    city: 'Kathmandu',
    phone: '+977 9801234567',
    preferredContact: 'email',
  },
  educationRecords: [
    {
      id: 'edu-1',
      level: 'bachelors',
      qualification: 'B.Sc. Computer Science and Information Technology (B.Sc. CSIT)',
      institution: 'Tribhuvan University (IOST)',
      fieldOfStudy: 'Computer Science & Software Engineering',
      gpaOrPercentage: '3.75',
      gradingSystem: 'gpa_4',
      graduationYear: '2024',
      isCurrentlyStudying: false,
    },
  ],
  studyPreferences: {
    destinationCountries: ['Japan', 'Australia', 'United Kingdom', 'Erasmus Mundus'],
    intendedAcademicLevel: 'masters',
    preferredFields: ['Computer Science & AI', 'Information Technology', 'Software Engineering'],
    intendedIntakeYear: '2026',
    preferredStudyDuration: '2_years',
    preferredUniversities: 'University of Tokyo, Kyoto University, University of Melbourne, Oxford',
  },
  fundingPreferences: {
    fundingPreference: 'fully_funded',
    tuitionCoverage: '100_percent',
    livingExpensesCoverage: 'essential',
    travelSupport: 'essential',
    applicationFeeSupport: 'preferred',
  },
  languageProficiency: {
    englishProficiency: 'advanced',
    ieltsScore: '7.5',
    toeflScore: '',
    japaneseProficiency: 'n5',
    jlptLevel: 'N5',
    koreanProficiency: '',
    topikLevel: '',
    otherLanguages: '',
  },
  achievementsExperience: {
    academicAchievements: "Tribhuvan University Dean's Merit List; Rank 2 in Department.",
    researchExperience: 'Undergraduate thesis on Neural Network optimization for natural language parsing.',
    workExperience: '1.5 years as Junior Software Developer at local tech firm.',
    internshipExperience: '4-month Machine Learning research intern at Nepal AI Lab.',
    volunteering: 'Volunteer instructor for Open Knowledge Nepal STEM initiatives.',
    extracurriculars: 'Executive Member of Student IT Club; Hackathon finalist 2023.',
    awardsAndCertificates: 'Best Capstone Engineering Project Award 2024; AWS Certified Cloud Practitioner.',
  },
  applicationReadiness: {
    hasPassport: 'yes',
    hasCV: 'yes',
    hasTranscripts: 'yes',
    hasRecommendations: 'in_progress',
    hasSOP: 'in_progress',
    plannedApplicationTimeline: 'Within 3-6 months',
  },
  isCompleted: true,
  lastUpdated: new Date().toISOString(),
};

export function calculateProfileReadiness(profile: StudentProfile): number {
  let score = 0;
  let totalWeights = 0;

  // Personal Info (Weight: 20)
  totalWeights += 20;
  if (profile.personalInfo.fullName) score += 5;
  if (profile.personalInfo.nationality) score += 5;
  if (profile.personalInfo.currentCountry) score += 5;
  if (profile.personalInfo.dateOfBirth) score += 5;

  // Education Background (Weight: 25)
  totalWeights += 25;
  if (profile.educationRecords.length > 0) {
    const first = profile.educationRecords[0];
    if (first.level) score += 5;
    if (first.institution) score += 5;
    if (first.qualification) score += 5;
    if (first.gpaOrPercentage) score += 5;
    if (first.graduationYear || first.expectedGraduationYear) score += 5;
  }

  // Study Preferences (Weight: 25)
  totalWeights += 25;
  if (profile.studyPreferences.destinationCountries.length > 0) score += 10;
  if (profile.studyPreferences.intendedAcademicLevel) score += 8;
  if (profile.studyPreferences.preferredFields.length > 0) score += 7;

  // Funding Preferences (Weight: 15)
  totalWeights += 15;
  if (profile.fundingPreferences.fundingPreference) score += 15;

  // Language & Readiness (Weight: 15)
  totalWeights += 15;
  if (profile.languageProficiency.englishProficiency || profile.languageProficiency.ieltsScore) score += 5;
  if (profile.applicationReadiness.hasPassport) score += 5;
  if (profile.applicationReadiness.hasCV || profile.applicationReadiness.hasTranscripts) score += 5;

  return Math.min(100, Math.round((score / totalWeights) * 100));
}

