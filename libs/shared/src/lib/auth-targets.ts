export type UserRole =
  | 'STUDENT'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'COLLEGE'
  | 'CONSULTANCY';

export type AppTarget = 'main' | 'portal' | 'workspace';

export interface TargetPolicy {
  allowedRoles: readonly UserRole[];
  loginPath: string;
  canRegister: boolean;
  homeByRole: Partial<Record<UserRole, string>>;
  protectedPrefixes: readonly string[];
  publicPrefixes: readonly string[];
}

export const TARGET_POLICIES: Record<AppTarget, TargetPolicy> = {
  main: {
    allowedRoles: ['STUDENT'],
    loginPath: '/login',
    canRegister: true,
    homeByRole: { STUDENT: '/dashboard' },
    protectedPrefixes: ['/dashboard'],
    publicPrefixes: ['/', '/login', '/signup', '/register', '/verify-email'],
  },
  portal: {
    allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
    loginPath: '/login',
    canRegister: false,
    homeByRole: {
      ADMIN: '/admin',
      SUPER_ADMIN: '/admin/super',
    },
    protectedPrefixes: ['/admin'],
    publicPrefixes: ['/login'],
  },
  workspace: {
    allowedRoles: ['COLLEGE', 'CONSULTANCY'],
    loginPath: '/login',
    canRegister: false,
    homeByRole: {
      COLLEGE: '/organizations/college',
      CONSULTANCY: '/organizations/consultancy',
    },
    protectedPrefixes: ['/organizations/college', '/organizations/consultancy'],
    publicPrefixes: ['/login'],
  },
};

export function isAppTarget(value: unknown): value is AppTarget {
  return value === 'main' || value === 'portal' || value === 'workspace';
}

export function getAppTarget(
  value = process.env.NEXT_PUBLIC_APP_TARGET
): AppTarget {
  if (value === undefined || value === '') {
    return 'main';
  }

  if (!isAppTarget(value)) {
    throw new Error(
      'NEXT_PUBLIC_APP_TARGET must be one of: main, portal, workspace.'
    );
  }

  return value;
}

export function isUserRole(value: unknown): value is UserRole {
  return (
    value === 'STUDENT' ||
    value === 'ADMIN' ||
    value === 'SUPER_ADMIN' ||
    value === 'COLLEGE' ||
    value === 'CONSULTANCY'
  );
}

export function pathHasPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isPathAvailable(target: AppTarget, pathname: string): boolean {
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return true;
  }

  if (target === 'main') {
    return (
      !pathHasPrefix(pathname, '/admin') &&
      !pathHasPrefix(pathname, '/organizations/college') &&
      !pathHasPrefix(pathname, '/organizations/consultancy')
    );
  }

  if (target === 'portal') {
    return (
      pathname === '/' ||
      pathHasPrefix(pathname, '/login') ||
      pathHasPrefix(pathname, '/admin')
    );
  }

  return (
    pathname === '/' ||
    pathHasPrefix(pathname, '/login') ||
    pathHasPrefix(pathname, '/organizations/college') ||
    pathHasPrefix(pathname, '/organizations/consultancy')
  );
}

export function requiredRolesForPath(
  target: AppTarget,
  pathname: string
): readonly UserRole[] | undefined {
  if (target === 'main' && pathHasPrefix(pathname, '/dashboard')) {
    return ['STUDENT'];
  }

  if (target === 'portal' && pathHasPrefix(pathname, '/admin/super')) {
    return ['SUPER_ADMIN'];
  }

  if (target === 'portal' && pathHasPrefix(pathname, '/admin')) {
    return ['ADMIN', 'SUPER_ADMIN'];
  }

  if (
    target === 'workspace' &&
    pathHasPrefix(pathname, '/organizations/college')
  ) {
    return ['COLLEGE'];
  }

  if (
    target === 'workspace' &&
    pathHasPrefix(pathname, '/organizations/consultancy')
  ) {
    return ['CONSULTANCY'];
  }

  return undefined;
}

export function getHomePath(
  target: AppTarget,
  role: UserRole
): string | undefined {
  return TARGET_POLICIES[target].homeByRole[role];
}
