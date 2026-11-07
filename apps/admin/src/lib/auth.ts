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
    typeof session.expiresAt !== 'string' ||
    typeof session.user !== 'object' ||
    session.user === null
  ) {
    return false;
  }

  const user = session.user as Record<string, unknown>;
  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof user.emailVerified === 'boolean' &&
    (typeof user.image === 'string' || user.image === null) &&
    isUserRole(user.role) &&
    typeof user.createdAt === 'string' &&
    typeof user.updatedAt === 'string'
  );
}

export async function fetchCurrentSession(): Promise<CurrentSession | null> {
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
    throw new Error('Unable to load your session.');
  }

  const result: unknown = await response.json();
  if (typeof result !== 'object' || result === null || !('data' in result)) {
    throw new Error('The API returned an invalid session response.');
  }

  const data = result.data;
  if (typeof data !== 'object' || data === null || !('currentSession' in data)) {
    throw new Error('The API returned an invalid session response.');
  }

  const session = data.currentSession;
  if (session === null) {
    return null;
  }

  if (!isCurrentSession(session)) {
    throw new Error('The API returned an invalid session response.');
  }

  return session;
}
