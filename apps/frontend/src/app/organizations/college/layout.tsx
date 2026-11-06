import type { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/session';

export default async function CollegeWorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(['COLLEGE']);
  return children;
}
