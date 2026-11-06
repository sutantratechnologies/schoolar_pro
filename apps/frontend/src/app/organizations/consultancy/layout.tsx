import type { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/session';

export default async function ConsultancyWorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(['CONSULTANCY']);
  return children;
}
