import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function WorkspaceRootDashboard() {
  const session = await getServerSession();
  if (session?.user?.role === 'COLLEGE') {
    redirect('/dashboard/college');
  }
  redirect('/dashboard/consultancy');
}

