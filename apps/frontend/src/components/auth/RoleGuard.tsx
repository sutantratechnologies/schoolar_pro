'use client';

import type { ReactNode } from 'react';
import type { UserRole } from '@sass-project/shared';
import { useAuth } from './AuthProvider';

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: {
  roles: readonly UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading || !user || !roles.includes(user.role)) {
    return fallback;
  }

  return children;
}
