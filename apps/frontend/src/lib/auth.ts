import { authBaseURL, authClient } from '@sass-project/auth/client';
import {
  CURRENT_SESSION_QUERY,
  type AuthProviderConfig,
  type CurrentSession,
} from '@sass-project/contracts';
import { isUserRole } from '@/lib/auth/targets';

export { authClient };

export async function getAuthProviderConfig(): Promise<AuthProviderConfig> {
  const endpoint = new URL(
    '/api/auth/config',
    authBaseURL || window.location.origin
  );
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to load authentication options.');
  }

  const config: unknown = await response.json();

  if (
    typeof config !== 'object' ||
    config === null ||
    !('googleOAuthEnabled' in config) ||
    typeof config.googleOAuthEnabled !== 'boolean'
  ) {
    throw new Error('The authentication server returned an invalid response.');
  }

  return { googleOAuthEnabled: config.googleOAuthEnabled };
}

function isCurrentSession(value: unknown): value is CurrentSession {
  if (typeof value !== 'object' || value === null || !('user' in value)) {
    return false;
  }

  const session = value as {
    id?: unknown;
    expiresAt?: unknown;
    user?: unknown;
  };
  if (
    typeof session.id !== 'string' ||
    typeof session.user !== 'object' ||
    session.user === null
  ) {
    return false;
  }

  const user = session.user as Record<string, unknown>;
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    isUserRole(user.role)
  );
}

export async function fetchCurrentSession(): Promise<CurrentSession | null> {
  try {
    const endpoint = new URL('/api/graphql', window.location.origin);
    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: CURRENT_SESSION_QUERY }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result: unknown = await response.json();
    if (typeof result !== 'object' || result === null || !('data' in result)) {
      return null;
    }

    const data = (result as { data?: { currentSession?: unknown } }).data;
    if (typeof data !== 'object' || data === null || !('currentSession' in data)) {
      return null;
    }

    const session = data.currentSession;
    if (session === null || !isCurrentSession(session)) {
      return null;
    }

    const user = (session.user as unknown) as Record<string, unknown>;
    return {
      id: String(session.id),
      expiresAt: String(session.expiresAt || new Date().toISOString()),
      user: {
        id: String(user.id),
        name: String(user.name || user.email || 'Student'),
        email: String(user.email),
        emailVerified: Boolean(user.emailVerified),
        image: typeof user.image === 'string' ? user.image : null,
        role: user.role as CurrentSession['user']['role'],
        createdAt: String(user.createdAt || new Date().toISOString()),
        updatedAt: String(user.updatedAt || new Date().toISOString()),
      },
    };
  } catch (error) {
    console.warn('fetchCurrentSession error:', error);
    return null;
  }
}

export async function resolveActiveSession(): Promise<CurrentSession | null> {
  try {
    // 1. Try Better Auth native getSession
    const clientRes = await authClient.getSession();
    if (clientRes?.data?.user && clientRes.data.session) {
      const u = clientRes.data.user as {
        id: string;
        email: string;
        name?: string | null;
        image?: string | null;
        emailVerified?: boolean;
        role?: unknown;
        createdAt?: string | Date;
        updatedAt?: string | Date;
      };
      if (isUserRole(u.role)) {
        const s = clientRes.data.session;
      return {
        id: String(s.id),
        expiresAt:
          typeof s.expiresAt === 'string'
            ? s.expiresAt
            : new Date(s.expiresAt).toISOString(),
        user: {
          id: String(u.id),
          name: String(u.name || u.email || 'Student'),
          email: String(u.email),
          emailVerified: Boolean(u.emailVerified),
          image: typeof u.image === 'string' ? u.image : null,
          role: u.role,
          createdAt:
            typeof u.createdAt === 'string'
              ? u.createdAt
              : new Date(u.createdAt || Date.now()).toISOString(),
          updatedAt:
            typeof u.updatedAt === 'string'
              ? u.updatedAt
              : new Date(u.updatedAt || Date.now()).toISOString(),
        },
      };
    }
  }
} catch {}

  // 2. Fallback to GraphQL currentSession
  return fetchCurrentSession();
}
