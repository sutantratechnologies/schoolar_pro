import {
  getAppTarget,
  getHomePath,
  isPathAvailable,
  isUserRole,
  requiredRolesForPath,
  TARGET_POLICIES,
  type AppTarget,
} from '@/lib/auth/targets';
import type { UserRole } from '@sass-project/contracts';
import { NextResponse, type NextRequest } from 'next/server';

function isSessionUser(value: unknown): value is { role: UserRole } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'role' in value &&
    isUserRole(value.role)
  );
}

async function getSessionRole(
  request: NextRequest,
  target: ReturnType<typeof getAppTarget>
): Promise<
  | { role: UserRole | null; unavailable: false }
  | { role: null; unavailable: true }
> {
  const prefix = `bg_${target}.`;
  const hasSessionCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.endsWith(`${prefix}session_token`));

  if (!hasSessionCookie) {
    return { role: null, unavailable: false };
  }

  try {
    const response = await fetch(new URL('/api/auth/get-session', request.url), {
      headers: { cookie: request.headers.get('cookie') ?? '' },
      cache: 'no-store',
    });
    if (!response.ok) {
      return { role: null, unavailable: true };
    }

    const data: unknown = await response.json();
    if (data === null) {
      return { role: null, unavailable: false };
    }

    if (
      typeof data !== 'object' ||
      !('user' in data) ||
      !isSessionUser(data.user)
    ) {
      return { role: null, unavailable: true };
    }
    return { role: data.user.role, unavailable: false };
  } catch {
    return { role: null, unavailable: true };
  }
}

function redirectToLogin(
  request: NextRequest,
  target: AppTarget
): NextResponse {
  const loginURL = new URL(TARGET_POLICIES[target].loginPath, request.url);
  loginURL.searchParams.set(
    'next',
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return NextResponse.redirect(loginURL);
}

export async function proxy(request: NextRequest) {
  const target = getAppTarget();
  const pathname = request.nextUrl.pathname;

  if (!isPathAvailable(target, pathname)) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  if ((target === 'portal' || target === 'workspace') && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const session = await getSessionRole(request, target);
  if (session.unavailable) {
    return NextResponse.json(
      { message: 'Authentication service unavailable.' },
      { status: 503 }
    );
  }

  const role = session.role;
  const isAuthRoute =
    pathname === TARGET_POLICIES[target].loginPath ||
    pathname === '/signup' ||
    pathname === '/sign-up' ||
    pathname === '/register' ||
    pathname === '/auth/sign-up' ||
    pathname === '/auth/signup' ||
    pathname === '/auth/register' ||
    pathname === '/auth/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  if (isAuthRoute && role) {
    const home = getHomePath(target, role);
    if (home) {
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  const requiredRoles = requiredRolesForPath(target, pathname);
  if (!requiredRoles) {
    return NextResponse.next();
  }
  if (!role) {
    return redirectToLogin(request, target);
  }
  if (!requiredRoles.includes(role)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
