import type { ReactNode } from 'react';
import { getServerSession } from '@/lib/auth/session';
import { getAppTarget, getHomePath } from '@/lib/auth/targets';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (session?.user) {
    const target = getAppTarget();
    const home = getHomePath(target, session.user.role) || '/dashboard';
    redirect(home);
  }

  return <>{children}</>;
}

