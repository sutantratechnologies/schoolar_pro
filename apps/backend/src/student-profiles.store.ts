import fs from 'node:fs';
import path from 'node:path';

export interface StudentProfileData {
  userId: string;
  isSuspended: boolean;
  status: 'ACTIVE' | 'SUSPENDED';
  suspendedAt?: string | null;
  suspendedReason?: string | null;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    currentCountry: string;
    city: string;
    phone: string;
    preferredContact: string;
  };
  educationRecords: Array<{
    id: string;
    level: string;
    qualification: string;
    institution: string;
    fieldOfStudy: string;
    gpaOrPercentage: string;
    gradingSystem: string;
    graduationYear: string;
    isCurrentlyStudying: boolean;
    expectedGraduationYear?: string;
  }>;
  studyPreferences: {
    destinationCountries: string[];
    intendedAcademicLevel: string;
    preferredFields: string[];
    intendedIntakeYear: string;
    preferredStudyDuration: string;
    preferredUniversities: string;
  };
  fundingPreferences: {
    fundingPreference: string;
    tuitionCoverage: string;
    livingExpensesCoverage: string;
    travelSupport: string;
    applicationFeeSupport: string;
  };
  languageProficiency: {
    englishProficiency: string;
    ieltsScore: string;
    toeflScore: string;
    japaneseProficiency: string;
    jlptLevel: string;
    koreanProficiency: string;
    topikLevel: string;
    otherLanguages: string;
  };
  achievementsExperience: {
    academicAchievements: string;
    researchExperience: string;
    workExperience: string;
    internshipExperience: string;
    volunteering: string;
    extracurriculars: string;
    awardsAndCertificates: string;
  };
  applicationReadiness: {
    hasPassport: string;
    hasCV: string;
    hasTranscripts: string;
    hasRecommendations: string;
    hasSOP: string;
    plannedApplicationTimeline: string;
  };
  updatedAt: string;
}

// In-memory cache + persistent JSON backing
const STORE_DIR = path.resolve(__dirname, 'assets');
const STORE_FILE = path.join(STORE_DIR, 'student-profiles-store.json');

const memoryProfiles: Map<string, StudentProfileData> = new Map();

function ensureStoreLoaded() {
  if (memoryProfiles.size > 0) return;
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf8');
      const list: StudentProfileData[] = JSON.parse(raw);
      list.forEach((p) => memoryProfiles.set(p.userId, p));
    }
  } catch (err) {
    console.warn('[student-profiles] Failed to load disk profiles store:', err);
  }
}

function persistStore() {
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    const list = Array.from(memoryProfiles.values());
    fs.writeFileSync(STORE_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.warn('[student-profiles] Failed to persist disk profiles store:', err);
  }
}

export function getDefaultStudentProfile(userId: string, user?: { name?: string; email?: string }): StudentProfileData {
  const name = user?.name || 'Aarav Sharma';
  return {
    userId,
    isSuspended: false,
    status: 'ACTIVE',
    suspendedAt: null,
    suspendedReason: null,
    personalInfo: {
      fullName: name,
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
        id: `edu-default-1`,
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
      destinationCountries: ['Japan', 'Australia', 'United Kingdom', 'Erasmus Mundus', 'South Korea'],
      intendedAcademicLevel: 'masters',
      preferredFields: ['Computer Science & AI', 'Information Technology', 'Software Engineering'],
      intendedIntakeYear: '2027',
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
      englishProficiency: 'native_fluent',
      ieltsScore: '7.5',
      toeflScore: '102',
      japaneseProficiency: 'n2',
      jlptLevel: 'N2',
      koreanProficiency: 'intermediate',
      topikLevel: 'level_3',
      otherLanguages: 'German B1',
    },
    achievementsExperience: {
      academicAchievements: "Top 5% Dean's List, Tribhuvan University (2023).",
      researchExperience: 'Published paper on NLP for Nepali Language Processing (IEEE Conf 2024).',
      workExperience: '2 years software development experience at local tech consultancy.',
      internshipExperience: 'AI Research Intern at TechNepal Labs.',
      volunteering: 'Volunteer STEM educator at Code For Nepal.',
      extracurriculars: 'Executive Member, CSIT Association of Nepal.',
      awardsAndCertificates: 'National Hackathon 2023 1st Runner Up.',
    },
    applicationReadiness: {
      hasPassport: 'yes',
      hasCV: 'yes',
      hasTranscripts: 'yes',
      hasRecommendations: 'yes',
      hasSOP: 'in_progress',
      plannedApplicationTimeline: 'Immediate (Within 3-6 months)',
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getStudentProfile(userId: string, user?: { name?: string; email?: string }): StudentProfileData {
  ensureStoreLoaded();
  const existing = memoryProfiles.get(userId);
  if (existing) {
    return existing;
  }
  const defaultProfile = getDefaultStudentProfile(userId, user);
  memoryProfiles.set(userId, defaultProfile);
  persistStore();
  return defaultProfile;
}

export function setStudentProfile(userId: string, update: Partial<StudentProfileData>): StudentProfileData {
  ensureStoreLoaded();
  const current = getStudentProfile(userId);
  const updated: StudentProfileData = {
    ...current,
    ...update,
    userId,
    updatedAt: new Date().toISOString(),
  };
  memoryProfiles.set(userId, updated);
  persistStore();
  return updated;
}

export function suspendStudent(userId: string, reason?: string): StudentProfileData {
  ensureStoreLoaded();
  const current = getStudentProfile(userId);
  current.isSuspended = true;
  current.status = 'SUSPENDED';
  current.suspendedAt = new Date().toISOString();
  current.suspendedReason = reason || 'Suspended by system administrator.';
  current.updatedAt = new Date().toISOString();
  memoryProfiles.set(userId, current);
  persistStore();
  return current;
}

export function reactivateStudent(userId: string): StudentProfileData {
  ensureStoreLoaded();
  const current = getStudentProfile(userId);
  current.isSuspended = false;
  current.status = 'ACTIVE';
  current.suspendedAt = null;
  current.suspendedReason = null;
  current.updatedAt = new Date().toISOString();
  memoryProfiles.set(userId, current);
  persistStore();
  return current;
}

export function deleteStudentProfile(userId: string): boolean {
  ensureStoreLoaded();
  const deleted = memoryProfiles.delete(userId);
  if (deleted) persistStore();
  return deleted;
}

