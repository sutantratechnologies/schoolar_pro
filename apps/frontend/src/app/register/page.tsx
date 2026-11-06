import { notFound, redirect } from 'next/navigation';
import { getAppTarget, TARGET_POLICIES } from '@/lib/auth/targets';

export default function RegisterPage() {
  if (!TARGET_POLICIES[getAppTarget()].canRegister) {
    notFound();
  }
  redirect('/signup');
}
