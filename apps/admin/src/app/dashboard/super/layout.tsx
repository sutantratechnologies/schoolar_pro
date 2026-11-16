import type { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/session';

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(['SUPER_ADMIN']);
  return children;
}

