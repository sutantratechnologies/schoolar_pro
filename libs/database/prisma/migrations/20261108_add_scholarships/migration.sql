-- CreateEnum
CREATE TYPE "ScholarshipVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PENDING_VERIFICATION', 'VERIFIED', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'VERIFIED', 'NEEDS_REVISION', 'REJECTED');

-- CreateEnum
CREATE TYPE "CycleStatus" AS ENUM ('UPCOMING', 'OPEN', 'CLOSING_SOON', 'CLOSED', 'SELECTION_IN_PROGRESS', 'RESULTS_ANNOUNCED', 'CANCELLED');

-- CreateTable
CREATE TABLE "scholarship" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "providerType" VARCHAR(100) NOT NULL,
    "opportunityType" VARCHAR(100) NOT NULL DEFAULT 'Degree-seeking scholarship',
    "categories" TEXT[],
    "logoUrl" VARCHAR(2048),
    "coverImageUrl" VARCHAR(2048),
    "officialWebsite" VARCHAR(2048) NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT true,
    "visibility" "ScholarshipVisibility" NOT NULL DEFAULT 'PUBLIC',
    "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "displayPriority" INTEGER NOT NULL DEFAULT 0,
    "destinationCountries" TEXT[],
    "studyLocation" VARCHAR(255),
    "academicLevels" TEXT[],
    "fieldsOfStudy" TEXT[],
    "specificSubjects" TEXT[],
    "studyMode" VARCHAR(50) NOT NULL DEFAULT 'On-campus',
    "studyDuration" VARCHAR(100),
    "instructionLanguages" TEXT[],
    "intakePeriod" VARCHAR(100),
    "participatingInstitutions" TEXT[],
    "eligibleNationalities" TEXT[],
    "excludedNationalities" TEXT[],
    "nepaleseEligible" VARCHAR(20) NOT NULL DEFAULT 'YES',
    "residencyRequirements" TEXT,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "ageCalculationDate" VARCHAR(100),
    "ageExceptions" TEXT,
    "minGpa" DOUBLE PRECISION,
    "gpaScale" VARCHAR(50),
    "minPercentage" DOUBLE PRECISION,
    "requiredQualification" VARCHAR(255),
    "requiredBackground" TEXT,
    "graduationYearReq" VARCHAR(100),
    "academicPrerequisites" TEXT,
    "languageRequirements" JSONB NOT NULL DEFAULT '{}',
    "otherEligibility" JSONB NOT NULL DEFAULT '{}',
    "fundingClassification" VARCHAR(100) NOT NULL DEFAULT 'Fully funded',
    "tuitionCoverage" VARCHAR(50) NOT NULL DEFAULT 'Covered',
    "tuitionAmount" DOUBLE PRECISION,
    "tuitionCurrency" VARCHAR(10),
    "monthlyStipend" DOUBLE PRECISION,
    "stipendCurrency" VARCHAR(10),
    "stipendFrequency" VARCHAR(50) DEFAULT 'Monthly',
    "accommodationSupport" VARCHAR(50) NOT NULL DEFAULT 'Not specified',
    "accommodationAmount" DOUBLE PRECISION,
    "travelAllowance" VARCHAR(50) NOT NULL DEFAULT 'Not covered',
    "airfareCoverage" VARCHAR(50) NOT NULL DEFAULT 'Covered',
    "healthInsurance" VARCHAR(50) NOT NULL DEFAULT 'Covered',
    "researchAllowance" DOUBLE PRECISION,
    "booksCoverage" VARCHAR(50),
    "applicationFeeCoverage" VARCHAR(50),
    "otherFinancialBenefits" JSONB NOT NULL DEFAULT '[]',
    "benefitsDescription" TEXT,
    "applicationRoute" VARCHAR(100) NOT NULL DEFAULT 'Apply through official scholarship portal',
    "applicationMethod" VARCHAR(50) NOT NULL DEFAULT 'Online',
    "applicationPortalUrl" VARCHAR(2048),
    "applicationGuideUrl" VARCHAR(2048),
    "applicationFee" DOUBLE PRECISION,
    "applicationFeeCurrency" VARCHAR(10),
    "interviewRequired" VARCHAR(20) NOT NULL DEFAULT 'NO',
    "entranceExamination" VARCHAR(20) NOT NULL DEFAULT 'NO',
    "selectionProcedure" TEXT,
    "contactEmail" VARCHAR(320),
    "contactWebsite" VARCHAR(2048),
    "requiredDocuments" JSONB NOT NULL DEFAULT '[]',
    "applicationTracks" JSONB NOT NULL DEFAULT '[]',
    "conditionsAndExceptions" JSONB NOT NULL DEFAULT '[]',
    "primaryOfficialSource" VARCHAR(2048) NOT NULL,
    "additionalSources" JSONB NOT NULL DEFAULT '[]',
    "sourceOrganization" VARCHAR(255),
    "sourceType" VARCHAR(100) NOT NULL DEFAULT 'Official scholarship portal',
    "lastVerifiedDate" TIMESTAMPTZ(3),
    "verifiedById" TEXT,
    "verificationNotes" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationChecklist" JSONB NOT NULL DEFAULT '{}',
    "verificationHistory" JSONB NOT NULL DEFAULT '[]',
    "nextReviewDate" TIMESTAMPTZ(3),
    "seoTitle" VARCHAR(300),
    "seoDescription" TEXT,
    "socialSharingImage" VARCHAR(2048),
    "createdById" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship_cycle" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "cycleName" VARCHAR(255) NOT NULL,
    "applicationYear" INTEGER NOT NULL,
    "intakeYear" INTEGER NOT NULL,
    "intakeSemester" VARCHAR(50) NOT NULL DEFAULT 'Fall',
    "cycleOpeningDate" TIMESTAMPTZ(3),
    "applicationDeadline" TIMESTAMPTZ(3),
    "deadlineTimezone" VARCHAR(50) DEFAULT 'UTC+05:45',
    "selectionAnnouncementDate" TIMESTAMPTZ(3),
    "programmeStartDate" TIMESTAMPTZ(3),
    "programmeEndDate" TIMESTAMPTZ(3),
    "cycleStatus" "CycleStatus" NOT NULL DEFAULT 'OPEN',
    "officialApplicationUrl" VARCHAR(2048),
    "cycleEligibilityOverrides" JSONB,
    "cycleFundingOverrides" JSONB,
    "cycleDocumentOverrides" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "scholarship_cycle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scholarship_slug_key" ON "scholarship"("slug");

-- CreateIndex
CREATE INDEX "scholarship_publicationStatus_visibility_idx" ON "scholarship"("publicationStatus", "visibility");

-- CreateIndex
CREATE INDEX "scholarship_providerType_opportunityType_idx" ON "scholarship"("providerType", "opportunityType");

-- CreateIndex
CREATE INDEX "scholarship_fundingClassification_idx" ON "scholarship"("fundingClassification");

-- CreateIndex
CREATE INDEX "scholarship_verificationStatus_idx" ON "scholarship"("verificationStatus");

-- CreateIndex
CREATE INDEX "scholarship_createdById_idx" ON "scholarship"("createdById");

-- CreateIndex
CREATE INDEX "scholarship_cycle_scholarshipId_applicationYear_idx" ON "scholarship_cycle"("scholarshipId", "applicationYear");

-- CreateIndex
CREATE INDEX "scholarship_cycle_cycleStatus_applicationDeadline_idx" ON "scholarship_cycle"("cycleStatus", "applicationDeadline");

-- AddForeignKey
ALTER TABLE "scholarship" ADD CONSTRAINT "scholarship_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarship" ADD CONSTRAINT "scholarship_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarship_cycle" ADD CONSTRAINT "scholarship_cycle_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

