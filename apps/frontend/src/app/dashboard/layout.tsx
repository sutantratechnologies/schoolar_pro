import type { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/session';

export default async function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(['STUDENT']);
  return children;
}
