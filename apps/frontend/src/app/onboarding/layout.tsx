import type { ReactNode } from 'react';
import { requireRole } from '@/lib/auth/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Student Profile Onboarding • BidyaGo',
  description: 'Complete your profile to unlock tailored scholarship recommendations.',
};

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Only authenticated students can access onboarding (never visible to public)
  await requireRole(['STUDENT']);

  // If the student has already completed onboarding, redirect them directly to the dashboard
  const cookieStore = await cookies();
  const onboardingCompleted =
    cookieStore.get('bg_onboarding_completed')?.value === 'true';

  if (onboardingCompleted) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}

