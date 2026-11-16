import type { ReactNode } from 'react';
import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function WorkspaceAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (session?.user && (session.user.role === 'COLLEGE' || session.user.role === 'CONSULTANCY')) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}

