import { Router, type Request, type Response } from 'express';
import crypto from 'node:crypto';
import { prisma } from '@sass-project/database';
import { auth, sendAuthEmail } from '@sass-project/auth/server';
import { fromNodeHeaders } from 'better-auth/node';
import { hashPassword } from 'better-auth/crypto';
import { scholarshipsRouter } from './scholarships.routes.js';

export const adminRouter: Router = Router();

// Mount scholarships sub-router
adminRouter.use('/scholarships', scholarshipsRouter);

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

// 1. GET /api/admin/admins - List administrators & pending invitations
adminRouter.get('/admins', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const role = session?.user?.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      res.status(403).json({ message: 'Forbidden: Administrator credentials required.' });
      return;
    }

    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingInvitations = await prisma.adminInvitation.findMany({
      where: {
        acceptedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        invitedBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      admins,
      pendingInvitations: pendingInvitations.map((inv) => ({
        id: inv.id,
        email: inv.email,
        expiresAt: inv.expiresAt,
        createdAt: inv.createdAt,
        invitedBy: inv.invitedBy?.name || inv.invitedBy?.email || 'Super Admin',
      })),
    });
  } catch (error) {
    console.error('Error fetching admin accounts:', error);
    res.status(500).json({ message: 'Failed to retrieve administrators list.' });
  }
});

// 2. POST /api/admin/invite - Super Admin creates new admin & sends activation link
adminRouter.post('/invite', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    if (session?.user?.role !== 'SUPER_ADMIN') {
      res.status(403).json({
        message: 'Forbidden: Only Super Administrators have authorization to create new administrators.',
      });
      return;
    }

    const { name, email, role = 'ADMIN', modules = [] } = req.body ?? {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ message: 'A valid administrator name is required.' });
      return;
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ message: 'A valid administrator email is required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const assignedRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';

    // Check if user is already an active admin
    const existingActiveAdmin = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        emailVerified: true,
      },
    });

    if (existingActiveAdmin) {
      res.status(400).json({
        message: `An active administrator already exists with email "${normalizedEmail}".`,
      });
      return;
    }

    // Generate secure random activation token (32 bytes = 64 hex characters)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // Revoke any previous pending invitations for this email
    await prisma.adminInvitation.updateMany({
      where: {
        email: normalizedEmail,
        acceptedAt: null,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    // Create new AdminInvitation
    await prisma.adminInvitation.create({
      data: {
        email: normalizedEmail,
        invitedById: session.user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Ensure User record exists with pending emailVerified
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: normalizedEmail,
          role: assignedRole,
          emailVerified: false,
        },
      });
    } else {
      await prisma.user.update({
        where: { email: normalizedEmail },
        data: {
          name: name.trim(),
          role: assignedRole,
          emailVerified: false,
        },
      });
    }

    // Determine admin app URL for activation link
    const adminAppUrl =
      process.env.ADMIN_APP_URL?.replace(/\/+$/, '') ||
      (process.env.NODE_ENV === 'production'
        ? 'https://admin.bidyago.com'
        : 'http://localhost:3001');

    const activationLink = `${adminAppUrl}/create-password?token=${rawToken}&email=${encodeURIComponent(
      normalizedEmail
    )}`;

    // Prepare email content
    const emailSubject = 'BidyaGo Platform — Set Your Administrator Password';
    const emailText = `Hello ${name.trim()},

You have been appointed as an Administrator (${assignedRole}) on the BidyaGo Platform by ${session.user.name || 'the Super Admin'}.

To activate your administrator credentials and access the Administration Portal, please set your password using this secure link:
${activationLink}

This activation link will expire in 48 hours.

If you were not expecting this invitation, please contact security@bidyago.com immediately.

BidyaGo Platform Systems
admin.bidyago.com`;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 18px; font-weight: 700; color: #4b37df; letter-spacing: -0.5px;">BIDYAGO</span>
          <span style="display: inline-block; margin-left: 8px; font-size: 10px; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; background-color: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff;">Administration Portal</span>
        </div>
        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 8px;">
          Administrator Account Created
        </h2>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
          Hello <strong>${name.trim()}</strong>,<br />
          You have been appointed as an administrator (<strong>${assignedRole}</strong>) on the BidyaGo global scholarship platform by <strong>${session.user.name || 'Super Admin'}</strong>.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Registered Administrator Email:</div>
          <div style="font-size: 14px; font-weight: 600; color: #0f172a; font-family: monospace;">${normalizedEmail}</div>
        </div>
        <div style="margin-bottom: 28px;">
          <a href="${activationLink}" style="display: inline-block; background-color: #4b37df; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(75, 55, 223, 0.2);">
            Activate Account & Set Password &rarr;
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 16px;">
          <strong>Security Note:</strong> This activation link is unique to your credentials and will expire in <strong>48 hours</strong>. Do not forward or share this email.
        </p>
        <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin-bottom: 0; border-top: 1px solid #f1f5f9; pt: 16px;">
          If the button does not work, copy and paste this URL into your browser:<br />
          <a href="${activationLink}" style="color: #4b37df; word-break: break-all;">${activationLink}</a>
        </p>
      </div>
    `;

    // Send email dispatch
    try {
      await sendAuthEmail({
        to: normalizedEmail,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.warn('Email dispatch warning (Resend):', emailErr);
    }

    // Log in AuditLog
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: 'ADMIN_INVITED',
        resource: 'user',
        metadata: {
          email: normalizedEmail,
          role: assignedRole,
          modules,
          invitedBy: session.user.email,
        },
      },
    });

    res.json({
      success: true,
      message: `Invitation successfully sent to ${normalizedEmail}.`,
      email: normalizedEmail,
      activationLink,
    });
  } catch (error) {
    console.error('Error creating admin invitation:', error);
    res.status(500).json({ message: 'Failed to create and dispatch administrator invitation.' });
  }
});

// 3. GET /api/admin/invitation - Verify invitation token on activation page
adminRouter.get('/invitation', async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ valid: false, message: 'Missing activation token.' });
      return;
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const invitation = await prisma.adminInvitation.findUnique({
      where: { tokenHash },
      include: {
        invitedBy: {
          select: { name: true, email: true },
        },
      },
    });

    if (!invitation) {
      res.status(404).json({ valid: false, message: 'Invalid or unknown activation link.' });
      return;
    }

    if (invitation.acceptedAt) {
      res.status(400).json({
        valid: false,
        message: 'This administrator invitation has already been accepted. Please sign in.',
      });
      return;
    }

    if (invitation.revokedAt) {
      res.status(400).json({
        valid: false,
        message: 'This administrator invitation was superseded or revoked.',
      });
      return;
    }

    if (new Date() > invitation.expiresAt) {
      res.status(400).json({
        valid: false,
        message: 'This activation link has expired (48 hour limit). Please request a new invitation.',
      });
      return;
    }

    res.json({
      valid: true,
      email: invitation.email,
      invitedBy: invitation.invitedBy?.name || 'Super Admin',
    });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    res.status(500).json({ valid: false, message: 'Failed to verify activation token.' });
  }
});

// 4. POST /api/admin/activate - User sets password and activates administrator account
adminRouter.post('/activate', async (req: Request, res: Response) => {
  try {
    const { token, email, password } = req.body ?? {};

    if (!token || typeof token !== 'string') {
      res.status(400).json({ message: 'Valid activation token is required.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ message: 'Security password must be at least 8 characters long.' });
      return;
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const invitation = await prisma.adminInvitation.findUnique({
      where: { tokenHash },
    });

    if (!invitation) {
      res.status(404).json({ message: 'Invalid or unknown activation token.' });
      return;
    }

    if (invitation.acceptedAt) {
      res.status(400).json({ message: 'This invitation has already been activated. Please sign in.' });
      return;
    }

    if (invitation.revokedAt || new Date() > invitation.expiresAt) {
      res.status(400).json({ message: 'This activation link has expired or was revoked.' });
      return;
    }

    const normalizedEmail = (email || invitation.email).toLowerCase().trim();
    const hashedPassword = await hashPassword(password);
    const now = new Date();

    // Perform database activation
    await prisma.$transaction(async (tx) => {
      // 1. Mark invitation accepted
      await tx.adminInvitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: now },
      });

      // 2. Fetch or create User
      let user = await tx.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        user = await tx.user.create({
          data: {
            id: crypto.randomUUID(),
            name: normalizedEmail.split('@')[0],
            email: normalizedEmail,
            role: 'ADMIN',
            emailVerified: true,
            updatedAt: now,
          },
        });
      } else {
        await tx.user.update({
          where: { id: user.id },
          data: {
            emailVerified: true,
            role: user.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
            updatedAt: now,
          },
        });
      }

      // 3. Upsert password Account
      const existingAccount = await tx.account.findFirst({
        where: { userId: user.id, providerId: 'credential' },
      });

      if (existingAccount) {
        await tx.account.update({
          where: { id: existingAccount.id },
          data: {
            password: hashedPassword,
            updatedAt: now,
          },
        });
      } else {
        await tx.account.create({
          data: {
            id: crypto.randomUUID(),
            accountId: user.id,
            providerId: 'credential',
            userId: user.id,
            password: hashedPassword,
            createdAt: now,
            updatedAt: now,
          },
        });
      }

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'ADMIN_ACTIVATED',
          resource: 'user',
          metadata: {
            email: normalizedEmail,
            activatedAt: now.toISOString(),
          },
        },
      });
    });

    res.json({
      success: true,
      message: 'Your administrator account has been successfully activated. You can now sign in.',
    });
  } catch (error) {
    console.error('Error activating admin account:', error);
    res.status(500).json({ message: 'Failed to activate administrator account.' });
  }
});

// 5. POST /api/admin/reset-password - Super Admin dispatches password reset email to an admin
adminRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    if (session?.user?.role !== 'SUPER_ADMIN') {
      res.status(403).json({
        message: 'Forbidden: Only Super Administrators can initiate password resets for administrators.',
      });
      return;
    }

    const { adminId } = req.body ?? {};
    if (!adminId || typeof adminId !== 'string') {
      res.status(400).json({ message: 'Target administrator ID is required.' });
      return;
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
      res.status(404).json({ message: 'Administrator account not found.' });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Revoke any previous active invitations/reset tokens for this email
    await prisma.adminInvitation.updateMany({
      where: {
        email: admin.email,
        acceptedAt: null,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    // Create fresh AdminInvitation token
    await prisma.adminInvitation.create({
      data: {
        email: admin.email,
        invitedById: session.user.id,
        tokenHash,
        expiresAt,
      },
    });

    const adminAppUrl =
      process.env.ADMIN_APP_URL?.replace(/\/+$/, '') ||
      (process.env.NODE_ENV === 'production'
        ? 'https://admin.bidyago.com'
        : 'http://localhost:3001');

    const resetLink = `${adminAppUrl}/create-password?token=${rawToken}&email=${encodeURIComponent(
      admin.email
    )}&mode=reset`;

    const emailSubject = 'BidyaGo Platform — Reset Your Administrator Password';
    const emailText = `Hello ${admin.name},

A password reset request for your Administrator account (${admin.role}) was initiated by Super Admin ${session.user.name || session.user.email}.

To reset your credentials and set a new password, click the link below:
${resetLink}

This link is valid for 24 hours.

If you did not request this, please contact platform security immediately.

BidyaGo Administration Portal
admin.bidyago.com`;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 18px; font-weight: 700; color: #4b37df; letter-spacing: -0.5px;">BIDYAGO</span>
          <span style="display: inline-block; margin-left: 8px; font-size: 10px; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; background-color: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff;">Administration Portal</span>
        </div>
        <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 8px;">
          Administrator Password Reset
        </h2>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
          Hello <strong>${admin.name}</strong>,<br />
          A password reset was requested by <strong>${session.user.name || 'Super Admin'}</strong> for your administrator account (<strong>${admin.role}</strong>).
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Administrator Account:</div>
          <div style="font-size: 14px; font-weight: 600; color: #0f172a; font-family: monospace;">${admin.email}</div>
        </div>
        <div style="margin-bottom: 28px;">
          <a href="${resetLink}" style="display: inline-block; background-color: #4b37df; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(75, 55, 223, 0.2);">
            Reset Password & Choose New Credentials &rarr;
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 16px;">
          This link will expire in <strong>24 hours</strong>. If you did not request a password reset, notify the Super Administrator immediately.
        </p>
        <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin-bottom: 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Direct link: <a href="${resetLink}" style="color: #4b37df; word-break: break-all;">${resetLink}</a>
        </p>
      </div>
    `;

    try {
      await sendAuthEmail({
        to: admin.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.warn('Email dispatch warning (Resend):', emailErr);
    }

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: 'ADMIN_PASSWORD_RESET_DISPATCHED',
        resource: 'user',
        metadata: {
          targetAdminId: admin.id,
          targetEmail: admin.email,
          dispatchedBy: session.user.email,
        },
      },
    });

    res.json({
      success: true,
      message: `Password reset instructions have been delivered to ${admin.email}.`,
      resetLink,
    });
  } catch (error) {
    console.error('Error dispatching admin password reset:', error);
    res.status(500).json({ message: 'Failed to dispatch password reset email.' });
  }
});

// 6. DELETE /api/admin/invitations/:id - Revoke pending invitation
adminRouter.delete('/invitations/:id', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    if (session?.user?.role !== 'SUPER_ADMIN') {
      res.status(403).json({ message: 'Forbidden: Super Administrator access required.' });
      return;
    }

    const id = String(req.params.id);
    const invitation = await prisma.adminInvitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      res.status(404).json({ message: 'Invitation not found.' });
      return;
    }

    await prisma.adminInvitation.update({
      where: { id },
      data: { revokedAt: new Date() },
    });

    // If an unverified user was created with no account, clean up
    const user = await prisma.user.findUnique({
      where: { email: invitation.email },
      include: { accounts: true },
    });

    if (user && !user.emailVerified && user.accounts.length === 0) {
      await prisma.user.delete({ where: { id: user.id } });
    }

    res.json({ success: true, message: 'Administrator invitation has been revoked.' });
  } catch (error) {
    console.error('Error revoking invitation:', error);
    res.status(500).json({ message: 'Failed to revoke administrator invitation.' });
  }
});

// 7. DELETE /api/admin/:id - Super Admin deletes an admin or super admin
adminRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    if (session?.user?.role !== 'SUPER_ADMIN') {
      res.status(403).json({
        message: 'Forbidden: Only Super Administrators can delete administrator accounts.',
      });
      return;
    }

    const targetId = String(req.params.id);
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser || !['ADMIN', 'SUPER_ADMIN'].includes(targetUser.role)) {
      res.status(404).json({ message: 'Administrator account not found.' });
      return;
    }

    // Protection rule: At least one Super Admin must remain in the system!
    if (targetUser.role === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: { role: 'SUPER_ADMIN' },
      });

      if (superAdminCount <= 1) {
        res.status(400).json({
          message:
            'Cannot delete the only Super Administrator. At least one Super Admin must always remain to govern the platform.',
        });
        return;
      }
    }

    // Perform database deletion inside transaction
    await prisma.$transaction(async (tx) => {
      // 1. Remove admin invitations associated with this user
      await tx.adminInvitation.deleteMany({
        where: {
          OR: [
            { invitedById: targetId },
            { email: targetUser.email },
          ],
        },
      });

      // 2. Remove session records
      await tx.session.deleteMany({
        where: { userId: targetId },
      });

      // 3. Remove account credential records
      await tx.account.deleteMany({
        where: { userId: targetId },
      });

      // 4. Remove organization memberships if any
      await tx.organizationMembership.deleteMany({
        where: { userId: targetId },
      });

      // 5. Delete user
      await tx.user.delete({
        where: { id: targetId },
      });

      // 6. Log audit entry
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: 'ADMIN_DELETED',
          resource: 'user',
          metadata: {
            deletedAdminId: targetId,
            deletedName: targetUser.name,
            deletedEmail: targetUser.email,
            deletedRole: targetUser.role,
            deletedBy: session.user.email,
          },
        },
      });
    });

    res.json({
      success: true,
      message: `Administrator "${targetUser.name}" (${targetUser.email}) has been permanently deleted.`,
    });
  } catch (error) {
    console.error('Error deleting administrator:', error);
    res.status(500).json({ message: 'Failed to delete administrator account.' });
  }
});
