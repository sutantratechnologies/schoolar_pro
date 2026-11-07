'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { authClient, getAuthProviderConfig } from '@/lib/auth';
import { getAppTarget, TARGET_POLICIES } from '@/lib/auth/targets';

export default function SignupPage() {
  const router = useRouter();
  const canRegister = TARGET_POLICIES[getAppTarget()].canRegister;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { data: sessionData, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (!sessionPending && sessionData?.user) {
      router.replace('/dashboard');
      return;
    }

    if (!canRegister) {
      router.replace('/404');
      return;
    }

    void getAuthProviderConfig()
      .then(({ googleOAuthEnabled }) => setGoogleEnabled(googleOAuthEnabled))
      .catch(() => setGoogleEnabled(false));
  }, [canRegister, router, sessionData, sessionPending]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage(`Password must be at least 8 characters (currently ${password.length}).`);
      return;
    }
    if (!agreed) {
      setErrorMessage('Please agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (error) {
        const errAny = error as { code?: string; message?: string; status?: number };
        if (
          errAny.code === 'PASSWORD_TOO_SHORT' ||
          errAny.message?.toLowerCase().includes('password')
        ) {
          setErrorMessage('Password must be at least 8 characters long.');
        } else if (
          errAny.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL' ||
          errAny.code === 'USER_ALREADY_EXISTS' ||
          errAny.status === 422 ||
          errAny.message?.toLowerCase().includes('already exists')
        ) {
          setErrorMessage('An account with this email already exists. Please sign in instead.');
        } else if (
          errAny.status === 429 ||
          errAny.message?.toLowerCase().includes('too many')
        ) {
          setErrorMessage('Too many attempts. Please wait a moment and try again.');
        } else {
          setErrorMessage(errAny.message || 'Unable to create your account. Please try again.');
        }
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch {
      setErrorMessage('Unable to reach the authentication service. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (error) {
        setErrorMessage(error.message || 'Unable to continue with Google.');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('Unable to reach the authentication service. Try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="inline-block group focus:outline-hidden" aria-label="BidyaGo Home">
            <Image
              src="/bidyago_logo.png"
              alt="BidyaGo"
              width={140}
              height={36}
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Center: Student Sign Up Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-7">
          <div className="space-y-2">
            <span className="text-xs font-normal text-slate-400 uppercase tracking-widest block">
              Student Registration
            </span>
            <h1 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
              Create Your Account
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              Sign up to unlock verified scholarships, deadline reminders, and academic profile matching.
            </p>
          </div>

          {googleEnabled && <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-normal transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>}

          {googleEnabled && <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white px-3 text-[11px] font-normal uppercase tracking-wider text-slate-400 absolute">
              or register with email
            </span>
          </div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center justify-between gap-2">
                <span>{errorMessage}</span>
                {errorMessage.includes('sign in') && (
                  <Link href="/login" className="font-semibold underline text-[#4b37df] hover:text-[#3f2cd6] shrink-0">
                    Sign In →
                  </Link>
                )}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                {password.length === 0 ? (
                  <span className="text-slate-400">Must be at least 8 characters</span>
                ) : password.length < 8 ? (
                  <span className="text-amber-600 font-medium">
                    Must be at least 8 characters ({password.length}/8 entered)
                  </span>
                ) : (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    ✓ Meets length requirement ({password.length} characters)
                  </span>
                )}
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded-sm border-slate-300 text-[#4b37df] focus:ring-[#4b37df]"
                />
                <span className="text-xs text-slate-500 font-normal leading-relaxed">
                  I agree to BidyaGo’s{' '}
                  <Link href="/#faqs" className="text-slate-900 underline hover:text-[#4b37df]">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/#faqs" className="text-slate-900 underline hover:text-[#4b37df]">
                    Privacy Policy
                  </Link>
                  . I understand BidyaGo is a free discovery and application tracking platform.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs sm:text-sm font-normal transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Student Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Switcher */}
          <div className="text-center space-y-2 pt-2">
            <p className="text-xs text-slate-500 font-normal">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-slate-900 font-medium hover:underline hover:text-[#4b37df] transition-colors"
              >
                Sign in
              </Link>
            </p>
            <p className="text-[11px] text-slate-400 font-normal">
              Are you an organization?{' '}
              <Link href="/organizations" className="text-slate-600 hover:text-slate-950 underline">
                Partner Portal
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Minimal Footer */}
        <div className="w-full pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-normal">
          <p>© {new Date().getFullYear()} BidyaGo, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/#faqs" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link href="/#faqs" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link href="/#faqs" className="hover:text-slate-600 transition-colors">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Right Column: Split Screen Showcase with Defined Brand Blue (#4b37df) Background */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-[#4b37df] bg-gradient-to-br from-[#4b37df] via-[#3f2cd6] to-[#251590] text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#251590]/60 rounded-full blur-3xl pointer-events-none" />

        {/* Top badge */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-normal text-white/90 uppercase tracking-widest bg-white/15 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-md">
            100% Free for Students
          </span>
          <span className="text-xs font-light text-white/70">Global Study Network</span>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 my-auto py-10 space-y-8 max-w-lg">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-snug">
              Your future. Your scholarship. Your international journey.
            </h2>
            <p className="text-sm text-white/80 font-normal leading-relaxed">
              Connect with verified global programs, calculate real scholarship eligibility, and track every application milestone.
            </p>
          </div>

          {/* Feature points in translucent glass cards */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-xs">
              <GraduationCap className="w-5 h-5 text-purple-200 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-white">
                  Flagship Global Scholarships
                </h4>
                <p className="text-[11px] text-white/75 font-normal mt-0.5 leading-relaxed">
                  Direct guides and alerts for MEXT Japan, Chevening UK, Australia Awards, GKS Korea, and DAAD.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-white">
                  Verified Application Portals
                </h4>
                <p className="text-[11px] text-white/75 font-normal mt-0.5 leading-relaxed">
                  Every grant application links directly to the official government embassy or university website.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-white">
                  Smart Application Tracker
                </h4>
                <p className="text-[11px] text-white/75 font-normal mt-0.5 leading-relaxed">
                  Keep your SOPs, transcripts, and deadline calendars organized in your personal dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Transparent Note */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70 font-normal">
          <span>* Transparent, non-grantor platform</span>
          <span>Official Embassy Portals</span>
        </div>
      </div>
    </div>
  );
}
