export interface PublicScholarship {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  provider: string;
  providerType: string;
  opportunityType: string;
  categories: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  officialWebsite: string;
  isFeatured: boolean;
  publicationStatus: string;
  destinationCountries: string[];
  studyLocation?: string;
  academicLevels: string[];
  fieldsOfStudy: string[];
  specificSubjects?: string[];
  studyMode: string;
  studyDuration?: string;
  instructionLanguages?: string[];
  intakePeriod?: string;
  nepaleseEligible: string;
  minAge?: number | null;
  maxAge?: number | null;
  minGpa?: number | null;
  gpaScale?: string;
  minPercentage?: number | null;
  requiredQualification?: string;
  languageRequirements?: {
    requiredLanguage?: string;
    ieltsOverall?: number;
    toeflMin?: number;
    pteMin?: number;
    jlptLevel?: string;
    topikLevel?: string;
    waiverAvailable?: string;
    notes?: string;
  };
  fundingClassification: string;
  tuitionCoverage: string;
  monthlyStipend?: number | null;
  stipendCurrency?: string;
  stipendFrequency?: string;
  accommodationSupport?: string;
  travelAllowance?: string;
  airfareCoverage?: string;
  healthInsurance?: string;
  otherFinancialBenefits?: Array<{ title: string; description: string }>;
  benefitsDescription?: string;
  applicationRoute: string;
  applicationMethod: string;
  applicationPortalUrl?: string;
  applicationGuideUrl?: string;
  interviewRequired?: string;
  selectionProcedure?: string;
  requiredDocuments?: Array<{
    id: string;
    name: string;
    description: string;
    mandatory: boolean;
    originalOrCopy: string;
    language: string;
    translationRequired: string;
    attestationRequired: string;
  }>;
  primaryOfficialSource: string;
  verificationStatus: string;
  lastVerifiedDate?: string;
  activeCycle?: {
    id: string;
    cycleName: string;
    applicationYear: number;
    intakeYear: number;
    applicationDeadline?: string;
    cycleStatus: string;
  } | null;
  cycles?: Array<{
    id: string;
    cycleName: string;
    applicationYear: number;
    intakeYear: number;
    applicationDeadline?: string;
    cycleStatus: string;
  }>;
}

export function getCountryFlag(countryName?: string): string {
  if (!countryName) return '🌐';
  const c = countryName.toLowerCase().trim();
  const map: Record<string, string> = {
    japan: '🇯🇵',
    'united kingdom': '🇬🇧',
    uk: '🇬🇧',
    australia: '🇦🇺',
    'south korea': '🇰🇷',
    korea: '🇰🇷',
    germany: '🇩🇪',
    'united states': '🇺🇸',
    usa: '🇺🇸',
    canada: '🇨🇦',
    france: '🇫🇷',
    china: '🇨🇳',
    india: '🇮🇳',
    'european union': '🇪🇺',
    eu: '🇪🇺',
    netherlands: '🇳🇱',
    sweden: '🇸🇪',
    norway: '🇳🇴',
    switzerland: '🇨🇭',
    'new zealand': '🇳🇿',
    singapore: '🇸🇬',
    ireland: '🇮🇪',
  };
  return map[c] || '🌐';
}

export function formatStipend(
  amount?: number | null,
  currency?: string,
  frequency?: string
): string {
  if (!amount) return 'Fully Covered';
  const freq = frequency ? frequency.toLowerCase() : 'monthly';
  return `${currency || ''} ${amount.toLocaleString()} / ${freq}`;
}

export function formatDeadline(dateStr?: string | null): string {
  if (!dateStr) return 'Annual Intake';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Annual Intake';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calculateDaysLeft(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr).getTime();
  if (isNaN(target)) return null;
  const diff = target - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

