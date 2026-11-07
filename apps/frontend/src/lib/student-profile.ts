'use client';

import {
  StudentProfile,
  INITIAL_STUDENT_PROFILE,
  calculateProfileReadiness,
} from '@/types/student-profile';

const STORAGE_KEY = 'bidyago_student_profile_v1';

export function getStoredStudentProfile(): StudentProfile {
  if (typeof window === 'undefined') {
    return INITIAL_STUDENT_PROFILE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STUDENT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STUDENT_PROFILE,
      ...parsed,
      personalInfo: {
        ...INITIAL_STUDENT_PROFILE.personalInfo,
        ...parsed.personalInfo,
      },
      studyPreferences: {
        ...INITIAL_STUDENT_PROFILE.studyPreferences,
        ...parsed.studyPreferences,
      },
      fundingPreferences: {
        ...INITIAL_STUDENT_PROFILE.fundingPreferences,
        ...parsed.fundingPreferences,
      },
      languageProficiency: {
        ...INITIAL_STUDENT_PROFILE.languageProficiency,
        ...parsed.languageProficiency,
      },
      achievementsExperience: {
        ...INITIAL_STUDENT_PROFILE.achievementsExperience,
        ...parsed.achievementsExperience,
      },
      applicationReadiness: {
        ...INITIAL_STUDENT_PROFILE.applicationReadiness,
        ...parsed.applicationReadiness,
      },
    };
  } catch (e) {
    console.error('Failed to load student profile from storage', e);
    return INITIAL_STUDENT_PROFILE;
  }
}

export function saveStoredStudentProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;

  try {
    const toSave: StudentProfile = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    window.dispatchEvent(new Event('bidyago_profile_updated'));
  } catch (e) {
    console.error('Failed to save student profile to storage', e);
  }
}

export { calculateProfileReadiness };

