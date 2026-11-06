import 'server-only';

import type { CurrentSession } from '@sass-project/contracts';
import { getAppTarget, isUserRole } from '@/lib/auth/targets';
import { proxyToBackend } from '@/lib/auth/server-proxy';
import { headers } from 'next/headers';
import { forbidden, redirect } from 'next/navigation';

function isBetterAuthSession(
  value: unknown
): value is {
  session: { id: string; expiresAt: string };
  user: CurrentSession['user'];
} {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('session' in value) ||
    !('user' in value)
  ) {
    return false;
  }

  const session = value.session;
  const user = value.user;
  return (
    typeof session === 'object' &&
    session !== null &&
    'id' in session &&
    typeof session.id === 'string' &&
    'expiresAt' in session &&
    typeof session.expiresAt === 'string' &&
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    typeof user.id === 'string' &&
    'name' in user &&
    typeof user.name === 'string' &&
    'email' in user &&
    typeof user.email === 'string' &&
    'emailVerified' in user &&
    typeof user.emailVerified === 'boolean' &&
    'image' in user &&
    (typeof user.image === 'string' || user.image === null) &&
    'role' in user &&
    isUserRole(user.role) &&
    'createdAt' in user &&
    typeof user.createdAt === 'string' &&
    'updatedAt' in user &&
    typeof user.updatedAt === 'string'
  );
}

export async function getServerSession(): Promise<CurrentSession | null> {
  const requestHeaders = await headers();
  const response = await proxyToBackend(
    new Request('http://internal/api/auth/get-session', {
      headers: { cookie: requestHeaders.get('cookie') ?? '' },
    }),
    getAppTarget(),
    '/api/auth/get-session'
  );

  if (!response.ok) {
    throw new Error('Unable to verify the authentication session.');
  }

  const data: unknown = await response.json();
  if (data === null) {
    return null;
  }
  if (!isBetterAuthSession(data)) {
    throw new Error('The authentication service returned an invalid session.');
  }
  return {
    id: data.session.id,
    expiresAt: data.session.expiresAt,
    user: data.user,
  };
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
