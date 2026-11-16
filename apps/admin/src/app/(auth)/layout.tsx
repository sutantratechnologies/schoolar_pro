import type { ReactNode } from 'react';
import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function AdminAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (session?.user && (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN')) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}

