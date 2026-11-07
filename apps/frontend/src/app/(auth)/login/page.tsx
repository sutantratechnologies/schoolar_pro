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
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Globe2,
  RefreshCw,
} from 'lucide-react';
import {
  authClient,
  fetchCurrentSession,
  getAuthProviderConfig,
} from '@/lib/auth';
import {
  getAppTarget,
  getHomePath,
  isUserRole,
  TARGET_POLICIES,
} from '@/lib/auth/targets';

export default function LoginPage() {
  const router = useRouter();
  const target = getAppTarget();
  const targetPolicy = TARGET_POLICIES[target];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const { data: sessionData, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (!sessionPending && sessionData?.user) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get('callbackURL') || searchParams.get('next') || searchParams.get('redirect') || '/dashboard';
      router.replace(redirectParam);
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('verified') === '1') {
      setEmail(searchParams.get('email') ?? '');
      setSuccessMessage('Your email is verified. You can now sign in.');
    }

    void getAuthProviderConfig()
      .then(({ googleOAuthEnabled }) => setGoogleEnabled(googleOAuthEnabled))
      .catch(() => setGoogleEnabled(false));
  }, [router, sessionData, sessionPending]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    setUnverifiedEmail(null);

    const searchParams = new URLSearchParams(window.location.search);
    const redirectParam = searchParams.get('callbackURL') || searchParams.get('redirect') || '/dashboard';
    const destinationUrl = redirectParam.startsWith('http')
      ? redirectParam
      : `${window.location.origin}${redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`}`;

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: destinationUrl,
      });

      if (error) {
        if (
          error.code === 'EMAIL_NOT_VERIFIED' ||
          error.message?.toLowerCase().includes('not verified')
        ) {
          setUnverifiedEmail(email.trim());
          setErrorMessage('');
          return;
        }

        setErrorMessage(
          error.status === 401
            ? 'No account is registered with these credentials.'
            : error.message || 'Unable to sign in. Please try again.'
        );
        return;
      }

      const session = await fetchCurrentSession();
      const role = session?.user.role;
      const home = isUserRole(role) ? getHomePath(target, role) : undefined;
      const targetDestination = redirectParam.startsWith('/')
        ? redirectParam
        : (home ?? '/dashboard');

      router.replace(targetDestination);
    } catch {
      setErrorMessage('Unable to reach the authentication service. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setIsResending(true);
    setErrorMessage('');

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: unverifiedEmail,
        type: 'email-verification',
      });

      if (error) {
        setErrorMessage(error.message || 'Unable to send a verification email.');
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}&resent=1`);
    } catch {
      setErrorMessage('Unable to reach the authentication service. Try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get('callbackURL') || searchParams.get('redirect') || '/dashboard';
      const destinationUrl = redirectParam.startsWith('http')
        ? redirectParam
        : `${window.location.origin}${redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`}`;

      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: destinationUrl,
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
          <Link
            href={target === 'main' ? '/' : '/login'}
            className="inline-block group focus:outline-hidden"
            aria-label="BidyaGo Home"
          >
            <Image
              src="/bidyago_logo.png"
              alt="BidyaGo"
              width={140}
              height={36}
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          {target === 'main' && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          )}
        </div>

        {/* Center: Student Login Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8 space-y-7">
          <div className="space-y-2">
            <span className="text-xs font-normal text-slate-400 uppercase tracking-widest block">
              {target === 'main'
                ? 'Student Sign In'
                : target === 'portal'
                  ? 'Administration Portal'
                  : 'Organization Workspace'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
              {target === 'main'
                ? 'Welcome Back'
                : target === 'portal'
                  ? 'Sign in to your portal'
                  : 'Sign in to your workspace'}
            </h1>
            <p className="text-sm text-slate-500 font-normal">
              {target === 'main'
                ? 'Sign in to access your saved scholarships, tracked applications, and personal matching matrix.'
                : target === 'portal'
                  ? 'Sign in with your authorized administrator account.'
                  : 'Sign in with your organization account.'}
            </p>
          </div>

          {googleEnabled && <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
              <span>Continue with Google</span>
            </button>
          </div>}

          {googleEnabled && <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white px-3 text-[11px] font-normal uppercase tracking-wider text-slate-400 absolute">
              or continue with email
            </span>
          </div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {unverifiedEmail ? (
              <div role="alert" className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-3 text-xs text-amber-900">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-amber-950">Email verification required</p>
                    <p className="text-amber-800 leading-relaxed">
                      Your account for <span className="font-semibold text-slate-900">{unverifiedEmail}</span> needs to be verified before you can sign in.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white font-medium transition-colors cursor-pointer"
                  >
                    <span>Enter Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    disabled={isResending}
                    onClick={handleResendVerification}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-300 bg-white hover:bg-amber-100/60 text-amber-900 font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                    <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                  </button>
                </div>
              </div>
            ) : errorMessage ? (
              <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
                {errorMessage}
              </div>
            ) : null}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4b37df] focus:ring-1 focus:ring-[#4b37df] transition-colors"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-normal text-[#4b37df] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm border-slate-300 text-[#4b37df] focus:ring-[#4b37df]"
                />
                <span className="text-xs text-slate-600 font-normal">
                  Keep me signed in
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs sm:text-sm font-normal transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>
                    {target === 'main'
                      ? 'Sign In to Dashboard'
                      : 'Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switcher */}
          {targetPolicy.canRegister && (
            <div className="text-center space-y-2 pt-2">
              <p className="text-xs text-slate-500 font-normal">
                New to BidyaGo?{' '}
                <Link
                  href="/signup"
                  className="text-slate-900 font-medium hover:underline hover:text-[#4b37df] transition-colors"
                >
                  Create free student account
                </Link>
              </p>
            </div>
          )}
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
            BidyaGo Student Gateway
          </span>
          <span className="text-xs font-light text-white/70">100% Free for Students</span>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 my-auto py-10 space-y-8 max-w-lg">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-snug">
              One verified gateway for scholarships, universities, and consultancies.
            </h2>
            <p className="text-sm text-white/80 font-normal leading-relaxed">
              Empowering students from Nepal and across South Asia with authentic, direct access to global academic funding opportunities.
            </p>
          </div>

          {/* Platform Highlights in translucent glass cards */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-white">
                  100% Free Core Scholarship Discovery
                </h4>
                <p className="text-[11px] text-white/75 font-normal mt-0.5 leading-relaxed">
                  We never charge students to search, compare, or discover verified grants.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-xs">
              <Globe2 className="w-5 h-5 text-purple-200 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-white">
                  Official Embassy & Ministry Portals
                </h4>
                <p className="text-[11px] text-white/75 font-normal mt-0.5 leading-relaxed">
                  Every scholarship routes directly to official application sources without middlemen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-white">
                  Verified Nepal Education Consultancies
                </h4>
                <p className="text-[11px] text-white/75 font-normal mt-0.5 leading-relaxed">
                  Directory entries verified through Ministry of Education (MoEST) criteria.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Transparent Note */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70 font-normal">
          <span>* Transparent, non-grantor platform</span>
          <span>Zero Middlemen Fees</span>
        </div>
      </div>
    </div>
  );
}
