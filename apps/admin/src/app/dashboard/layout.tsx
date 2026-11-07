import type { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/session';
import { AdminPortalShell } from '@/components/AdminPortalShell';

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireRole(['ADMIN', 'SUPER_ADMIN']);
  return <AdminPortalShell session={session}>{children}</AdminPortalShell>;
}
