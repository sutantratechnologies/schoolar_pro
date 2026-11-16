import type { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/session';
import { StudentPortalShell } from '@/components/dashboard/StudentPortalShell';

export default async function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireRole(['STUDENT']);
  return <StudentPortalShell session={session}>{children}</StudentPortalShell>;
}
