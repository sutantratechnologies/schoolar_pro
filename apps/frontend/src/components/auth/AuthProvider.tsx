'use client';

import type { AuthenticatedUser } from '@sass-project/contracts';
import {
  getAppTarget,
  getHomePath,
  isUserRole,
} from '@/lib/auth/targets';
import { fetchCurrentSession, authClient } from '@/lib/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextValue {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await fetchCurrentSession();
      setUser(session?.user ?? null);
    } catch (reason) {
      setUser(null);
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to verify your session.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const { error: responseError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: `${window.location.origin}/dashboard`,
        });
        if (responseError) {
          const message =
            responseError.status === 401 ||
            responseError.code === 'INVALID_EMAIL_OR_PASSWORD' ||
            responseError.message?.toLowerCase().includes('credentials')
              ? 'Invalid email or password.'
              : responseError.message || 'Unable to sign in.';
          setError(message);
          throw new Error(message);
        }

        const target = getAppTarget();
        const session = await fetchCurrentSession();
        const role = session?.user.role;
        const home = isUserRole(role) ? getHomePath(target, role) : undefined;
        if (!home) {
          const message = 'Invalid email or password.';
          setError(message);
          throw new Error(message);
        }

        await refresh();
        router.replace(home);
      } catch (reason) {
        if (reason instanceof Error) {
          setError(reason.message);
        } else {
          setError('Unable to reach the authentication service.');
        }
        throw reason;
      }
    },
    [refresh, router]
  );

  const logout = useCallback(async () => {
    setError(null);
    const { error: responseError } = await authClient.signOut();
    if (responseError) {
      const message = responseError.message || 'Unable to sign out.';
      setError(message);
      throw new Error(message);
    }
    setUser(null);
    router.replace('/login');
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, error, login, logout, refresh }),
    [user, isLoading, error, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
