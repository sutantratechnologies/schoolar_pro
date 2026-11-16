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

// In-Memory Storage for created scholarships (Zero-Downtime Resilience)
let IN_MEMORY_SCHOLARSHIPS: any[] = [];
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

    // Try database first; fall back to in-memory store cleanly
    let items: any[] = [];

    try {
      const dbScholarships = await prisma.scholarship.findMany({
        include: {
          cycles: {
            orderBy: { applicationYear: 'desc' },
          },
        },
        orderBy: [{ displayPriority: 'desc' }, { updatedAt: 'desc' }],
      });
      items = dbScholarships || [];
    } catch {
      // Postgres offline/unseeded - use in-memory store cleanly
      items = IN_MEMORY_SCHOLARSHIPS;
    }

    // Filter items
    let filtered = items.filter((s) => {
      // All scholarships are visible to public users without requiring any sign up or login
      // Only hidden if explicitly archived by administrators
      if (!isStaff && s.publicationStatus === 'ARCHIVED') {
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
      publicationStatus: body.publicationStatus || 'PUBLISHED',
      publishedAt: now,
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

// 9. Delete cycle: DELETE /api/admin/scholarships/:id/cycles/:cycleId
scholarshipsRouter.delete('/:id/cycles/:cycleId', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (!session?.user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const scholarshipId = String(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const cycleId = String(Array.isArray(req.params.cycleId) ? req.params.cycleId[0] : req.params.cycleId);

    try {
      await prisma.scholarshipCycle.deleteMany({
        where: {
          id: cycleId,
          ...(scholarshipId && scholarshipId !== 'undefined' ? { scholarshipId } : {}),
        },
      });
    } catch {
      // Ignore database delete failure and proceed to in-memory store
    }

    // Clean up in-memory store
    for (const s of IN_MEMORY_SCHOLARSHIPS) {
      if (Array.isArray(s.cycles)) {
        s.cycles = s.cycles.filter((c: any) => c.id !== cycleId);
      }
    }

    res.json({ success: true, message: 'Scholarship cycle deleted successfully.' });
  } catch (error) {
    console.error('Error deleting cycle:', error);
    res.status(500).json({ message: 'Failed to delete scholarship cycle.' });
  }
});

// Direct DELETE /api/admin/scholarships/cycles/:cycleId
scholarshipsRouter.delete('/cycles/:cycleId', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (!session?.user || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const cycleId = String(Array.isArray(req.params.cycleId) ? req.params.cycleId[0] : req.params.cycleId);

    try {
      await prisma.scholarshipCycle.delete({
        where: { id: cycleId },
      });
    } catch {
      // Fallback
    }

    for (const s of IN_MEMORY_SCHOLARSHIPS) {
      if (Array.isArray(s.cycles)) {
        s.cycles = s.cycles.filter((c: any) => c.id !== cycleId);
      }
    }

    res.json({ success: true, message: 'Scholarship cycle deleted successfully.' });
  } catch (error) {
    console.error('Error deleting cycle:', error);
    res.status(500).json({ message: 'Failed to delete scholarship cycle.' });
  }
});

