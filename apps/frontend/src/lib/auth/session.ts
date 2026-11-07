import 'server-only';

import type { CurrentSession } from '@sass-project/contracts';
import { getAppTarget, isUserRole } from '@/lib/auth/targets';
import { proxyToBackend } from '@/lib/auth/server-proxy';
import { headers } from 'next/headers';
import { forbidden, redirect } from 'next/navigation';

function isBetterAuthSession(
  value: unknown
): value is {
  session: { id: string | number; expiresAt: unknown };
  user: {
    id: string;
    email: string;
    role: CurrentSession['user']['role'];
    [key: string]: unknown;
  };
} {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('session' in value) ||
    !('user' in value)
  ) {
    return false;
  }

  const session = (value as Record<string, unknown>).session;
  const user = (value as Record<string, unknown>).user;
  if (!session || typeof session !== 'object' || !user || typeof user !== 'object') {
    return false;
  }

  const userRec = user as Record<string, unknown>;
  return (
    typeof userRec.id === 'string' &&
    typeof userRec.email === 'string' &&
    isUserRole(userRec.role)
  );
}

export async function getServerSession(): Promise<CurrentSession | null> {
  try {
    const requestHeaders = await headers();
    const cookie = requestHeaders.get('cookie') ?? '';
    if (!cookie || (!cookie.includes('session_token') && !cookie.includes('bg_'))) {
      return null;
    }

    const host =
      requestHeaders.get('x-forwarded-host') ||
      requestHeaders.get('host') ||
      'localhost:3000';
    const proto =
      requestHeaders.get('x-forwarded-proto') || 'http';

    const response = await proxyToBackend(
      new Request(`${proto}://${host}/api/auth/get-session`, {
        headers: {
          cookie,
          'x-forwarded-host': host,
          'x-forwarded-proto': proto,
        },
      }),
      getAppTarget(),
      '/api/auth/get-session'
    );

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    if (!data || typeof data !== 'object') {
      return null;
    }
    if (!isBetterAuthSession(data)) {
      return null;
    }

    const sessionObj = data.session as Record<string, unknown>;
    const userObj = data.user as Record<string, unknown>;

    return {
      id: String(sessionObj.id),
      expiresAt:
        typeof sessionObj.expiresAt === 'string'
          ? sessionObj.expiresAt
          : new Date(sessionObj.expiresAt as string | number | Date).toISOString(),
      user: {
        id: String(userObj.id),
        name: String(userObj.name || userObj.email || 'Student'),
        email: String(userObj.email),
        emailVerified: Boolean(userObj.emailVerified),
        image: typeof userObj.image === 'string' ? userObj.image : null,
        role: userObj.role as CurrentSession['user']['role'],
        createdAt:
          typeof userObj.createdAt === 'string'
            ? userObj.createdAt
            : new Date(userObj.createdAt as string | number | Date).toISOString(),
        updatedAt:
          typeof userObj.updatedAt === 'string'
            ? userObj.updatedAt
            : new Date(userObj.updatedAt as string | number | Date).toISOString(),
      },
    };
  } catch (error) {
    console.error('Failed to resolve server session:', error);
    return null;
  }
}

export async function requireRole(
  roles: readonly CurrentSession['user']['role'][]
): Promise<CurrentSession> {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  if (!roles.includes(session.user.role)) {
    forbidden();
  }
  return session;
}
