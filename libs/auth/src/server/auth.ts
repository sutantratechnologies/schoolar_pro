import { randomUUID } from 'node:crypto';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';
import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import {
  type AppTarget,
  isAppTarget,
  TARGET_POLICIES,
} from '@sass-project/shared';
import { prisma } from '@sass-project/database';

type AuthEmail = {
  to: string;
  subject: string;
  text: string;
};

type ResendErrorResponse = {
  name?: unknown;
  message?: unknown;
  request_id?: unknown;
  requestId?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function redactProviderMessage(
  message: string,
  sensitiveValues: string[]
): string {
  let redacted = message;

  for (const value of sensitiveValues) {
    if (value) {
      redacted = redacted.replaceAll(value, '[redacted]');
    }
  }

  return redacted
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted email]')
    .replace(/\b\d{6}\b/g, '[redacted code]')
    .replace(/https?:\/\/\S+/gi, '[redacted URL]')
    .slice(0, 1000);
}

function getResendErrorDetails(
  body: unknown,
  headers: Headers,
  sensitiveValues: string[]
) {
  const errorBody: ResendErrorResponse = isRecord(body) ? body : {};
  const rawName = typeof errorBody.name === 'string' ? errorBody.name : 'unknown';
  const rawMessage =
    typeof errorBody.message === 'string'
      ? errorBody.message
      : 'Resend returned an unrecognized error response.';
  const requestId =
    headers.get('x-resend-id') ??
    headers.get('x-request-id') ??
    headers.get('request-id') ??
    (typeof errorBody.request_id === 'string'
      ? errorBody.request_id
      : typeof errorBody.requestId === 'string'
        ? errorBody.requestId
        : undefined);

  return {
    name: redactProviderMessage(rawName, sensitiveValues),
    message: redactProviderMessage(rawMessage, sensitiveValues),
    requestId: requestId?.slice(0, 200),
  };
}

function retryDelayMs(response: Response, attempt: number): number | undefined {
  if (response.status >= 500) {
    return attempt === 0 ? 250 : undefined;
  }

  if (response.status !== 429 || attempt > 0) {
    return undefined;
  }

  const retryAfter = response.headers.get('retry-after');
  if (!retryAfter) {
    return 500;
  }

  const seconds = Number(retryAfter);
  const retryAt = Number.isFinite(seconds)
    ? Date.now() + seconds * 1000
    : Date.parse(retryAfter);
  const delay = retryAt - Date.now();

  return delay >= 0 && delay <= 2_000 ? delay : undefined;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} must be configured before authentication starts.`);
  }

  return value;
}

function parseOrigin(name: string, value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid absolute URL origin.`);
  }

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(`${name} must contain only an HTTP(S) origin.`);
  }

  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error(`${name} must use HTTPS in production.`);
  }

  return url.origin;
}

function loadAuthEnvironment() {
  const secret = requiredEnvironmentVariable('BETTER_AUTH_SECRET');

  if (Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('BETTER_AUTH_SECRET must contain at least 32 bytes.');
  }

  const baseURL = parseOrigin(
    'BETTER_AUTH_URL',
    requiredEnvironmentVariable('BETTER_AUTH_URL')
  );
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
    throw new Error(
      'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together.'
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const emailFrom = process.env.AUTH_EMAIL_FROM?.trim();

  if (Boolean(resendApiKey) !== Boolean(emailFrom)) {
    throw new Error(
      'RESEND_API_KEY and AUTH_EMAIL_FROM must be configured together.'
    );
  }

  if (
    process.env.NODE_ENV === 'production' &&
    (!resendApiKey || !emailFrom)
  ) {
    throw new Error(
      'RESEND_API_KEY and AUTH_EMAIL_FROM are required in production.'
    );
  }

  const cookieDomain = process.env.BETTER_AUTH_COOKIE_DOMAIN?.trim();
  let normalizedCookieDomain: string | undefined;

  if (cookieDomain) {
    normalizedCookieDomain = cookieDomain.replace(/^\./, '').toLowerCase();

    if (
      process.env.NODE_ENV !== 'production' ||
      !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(
        normalizedCookieDomain
      )
    ) {
      throw new Error(
        'BETTER_AUTH_COOKIE_DOMAIN must be a production parent domain.'
      );
    }
  }

  const trustedOrigins = new Set<string>([baseURL]);

  if (process.env.NODE_ENV !== 'production') {
    trustedOrigins.add('http://localhost:3000');
    trustedOrigins.add('http://127.0.0.1:3000');
    trustedOrigins.add('http://localhost:3001');
    trustedOrigins.add('http://127.0.0.1:3001');
    trustedOrigins.add('http://localhost:3002');
    trustedOrigins.add('http://127.0.0.1:3002');
    trustedOrigins.add('http://localhost:3333');
    trustedOrigins.add('http://127.0.0.1:3333');
    trustedOrigins.add('http://internal');
    trustedOrigins.add('https://internal');
  }

  const configuredOrigins = [
    process.env.APP_URL,
    process.env.STUDENT_APP_URL,
    process.env.WORKSPACE_APP_URL,
    process.env.ADMIN_APP_URL,
    ...(process.env.FRONTEND_ORIGINS ?? '').split(','),
  ];

  for (const origin of configuredOrigins) {
    const trimmedOrigin = origin?.trim();
    if (trimmedOrigin) {
      trustedOrigins.add(
        parseOrigin(
          origin?.includes('://') ? 'Configured application URL' : 'FRONTEND_ORIGINS',
          trimmedOrigin
        )
      );
    }
  }

  return {
    baseURL: {
      allowedHosts: [...trustedOrigins].map((origin) => new URL(origin).host),
      fallback: baseURL,
    },
    secret,
    trustedOrigins: [...trustedOrigins],
    google:
      googleClientId && googleClientSecret
        ? { clientId: googleClientId, clientSecret: googleClientSecret }
        : undefined,
    resendApiKey,
    emailFrom,
    cookieDomain: normalizedCookieDomain,
  };
}

const environment = loadAuthEnvironment();

function getRequestTarget(
  context: { request?: Request } | null
): AppTarget | null {
  const target = context?.request?.headers.get('x-bidy-app-target');
  return isAppTarget(target) ? target : null;
}

async function sendAuthEmail({ to, subject, text }: AuthEmail): Promise<void> {
  if (!environment.resendApiKey || !environment.emailFrom) {
    throw new Error(
      'Authentication email delivery is not configured. Set RESEND_API_KEY and AUTH_EMAIL_FROM.'
    );
  }

  const sensitiveValues = [
    environment.resendApiKey,
    to,
    ...(text.match(/\b\d{6}\b/g) ?? []),
  ];
  const idempotencyKey = randomUUID();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${environment.resendApiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: environment.emailFrom,
      to,
      subject,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const delay = retryDelayMs(response, 0);
    if (delay !== undefined) {
      await wait(delay);
      const retryResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `******`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          from: environment.emailFrom,
          to,
          subject,
          text,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (retryResponse.ok) {
        return;
      }

      let responseBody: unknown;
      try {
        responseBody = await retryResponse.json();
      } catch {
        responseBody = undefined;
      }

      console.error('[Resend] Authentication email delivery failed', {
        status: retryResponse.status,
        ...getResendErrorDetails(
          responseBody,
          retryResponse.headers,
          sensitiveValues
        ),
      });
      throw new Error(
        `Authentication email delivery failed with HTTP ${retryResponse.status}.`
      );
    }

    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = undefined;
    }

    console.error('[Resend] Authentication email delivery failed', {
      status: response.status,
      ...getResendErrorDetails(responseBody, response.headers, sensitiveValues),
    });
    throw new Error(
      `Authentication email delivery failed with HTTP ${response.status}.`
    );
  }
}

function toPublicAuthUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const callbackURL = parsed.searchParams.get('callbackURL');
    if (callbackURL) {
      const frontendOrigin = new URL(callbackURL).origin;
      return `${frontendOrigin}${parsed.pathname}${parsed.search}`;
    }
    const defaultFrontend =
      environment.trustedOrigins.find((o) => o !== environment.baseURL.fallback) ||
      'http://localhost:3000';
    return `${defaultFrontend}${parsed.pathname}${parsed.search}`;
  } catch {
    return rawUrl;
  }
}

export const auth = betterAuth({
  appName: 'BidyaGo',
  baseURL: environment.baseURL,
  basePath: '/api/auth',
  secret: environment.secret,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  trustedOrigins: environment.trustedOrigins,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const publicUrl = toPublicAuthUrl(url);
      await sendAuthEmail({
        to: user.email,
        subject: 'Reset your BidyaGo password',
        text: `Use this secure link to reset your password: ${publicUrl}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    sendOnSignIn: false,
    autoSignInAfterVerification: false,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      const publicUrl = toPublicAuthUrl(url);
      await sendAuthEmail({
        to: user.email,
        subject: 'Verify your BidyaGo email address',
        text: `Use this secure link to verify your email address: ${publicUrl}`,
      });
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const target = getRequestTarget(context);
          if (!target) {
            throw APIError.fromStatus('UNAUTHORIZED', {
              message: 'Unauthorized request.',
            });
          }
          if (!TARGET_POLICIES[target].canRegister) {
            throw APIError.fromStatus('NOT_FOUND', { message: 'Not found.' });
          }
          return { data: { ...user, role: 'STUDENT' } };
        },
      },
    },
    session: {
      create: {
        before: async (session, context) => {
          const target = getRequestTarget(context);
          if (!target) {
            throw APIError.fromStatus('UNAUTHORIZED', {
              message: 'Unauthorized request.',
            });
          }

          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true },
          });
          if (
            !user ||
            !TARGET_POLICIES[target].allowedRoles.includes(user.role)
          ) {
            throw APIError.fromStatus('UNAUTHORIZED', {
              message: 'No account is registered with these credentials.',
              code: 'INVALID_EMAIL_OR_PASSWORD',
            });
          }
        },
      },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      allowedAttempts: 5,
      resendStrategy: 'reuse',
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        const subjects = {
          'email-verification': 'Verify your BidyaGo email address',
          'sign-in': 'Your BidyaGo sign-in code',
          'forget-password': 'Your BidyaGo password reset code',
          'change-email': 'Your BidyaGo email change code',
        };

        await sendAuthEmail({
          to: email,
          subject: subjects[type],
          text: `Your BidyaGo verification code is ${otp}. It expires in 10 minutes.`,
        });
      },
    }),
  ],
  socialProviders: environment.google
    ? {
        google: {
          ...environment.google,
          prompt: 'select_account',
          requireEmailVerification: true,
        },
      }
    : {},
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: false,
      updateUserInfoOnLink: false,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'STUDENT',
        input: false,
        returned: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: process.env.NODE_ENV === 'production',
    window: 60,
    max: 100,
    storage: 'database',
    customRules: {
      '/sign-in/email': { window: 60, max: 10 },
      '/sign-up/email': { window: 60, max: 10 },
      '/forget-password': { window: 60, max: 5 },
      '/send-verification-email': { window: 60, max: 5 },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: environment.cookieDomain
      ? {
          enabled: true,
          domain: environment.cookieDomain,
        }
      : { enabled: false },
    database: {
      joins: true,
    },
  },
});

export const authCapabilities = {
  googleOAuth: Boolean(environment.google),
};

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession['user'];
