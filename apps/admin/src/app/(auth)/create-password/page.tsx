'use client';

import React, { useState, useEffect, Suspense, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { authClient } from '@/lib/auth';

function CreatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const initialEmail = searchParams.get('email') || '';
  const isResetMode = searchParams.get('mode') === 'reset';

  const [email, setEmail] = useState(initialEmail);
  const [invitedBy, setInvitedBy] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Verify invitation token on mount
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setTokenValid(false);
      setTokenError('No activation token provided. Please check your invitation link.');
      return;
    }

    async function verifyToken() {
      setIsVerifying(true);
      try {
        const res = await fetch(`/api/admin/invitation?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setTokenValid(true);
          setEmail(data.email || initialEmail);
          setInvitedBy(data.invitedBy || 'Super Admin');
        } else {
          setTokenValid(false);
          setTokenError(data.message || 'This activation link is invalid or has expired.');
        }
      } catch {
        setTokenValid(false);
        setTokenError('Unable to verify activation link. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    }

    void verifyToken();
  }, [token, initialEmail]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Failed to activate administrator account.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Administrator account activated successfully! Redirecting...');

      // Attempt automatic sign in
      try {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });

        if (!signInError) {
          setTimeout(() => {
            router.replace('/dashboard');
          }, 1000);
          return;
        }
      } catch {
        // Fallback to manual login
      }

      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch {
      setErrorMessage('Unable to reach the authentication service. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto py-10">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Brand & Title */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#4b37df]/15 border border-[#4b37df]/30 text-[#4b37df] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white">
            {isResetMode ? 'Reset Admin Password' : 'Set Admin Password'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isResetMode
              ? 'Choose a new security password to restore your administrative access.'
              : 'Activate your authorized credentials for the BidyaGo Administration Portal.'}
          </p>
        </div>

        {/* Loading Verification State */}
        {isVerifying ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Verifying secure activation token...</p>
          </div>
        ) : !tokenValid ? (
          /* Invalid / Expired Token */
          <div className="space-y-5">
            <div className="p-4 bg-rose-950/60 border border-rose-800 text-xs text-rose-300 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Activation Link Invalid</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{tokenError}</p>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-white transition-colors"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Token Valid: Password Creation Form */
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 bg-rose-950/60 border border-rose-800 text-xs text-rose-300 rounded-2xl leading-relaxed flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="p-3.5 bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 rounded-2xl leading-relaxed flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Email (Read-Only Confirmation) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400">
                Registered Administrator Email
              </label>
              <div className="px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono">
                {email}
              </div>
              {invitedBy && (
                <p className="text-[11px] text-slate-500">
                  Invited by: <span className="text-purple-400">{invitedBy}</span>
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                New Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-hidden cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Confirm Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-hidden cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || password.length < 8 || password !== confirmPassword}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#4b37df] hover:bg-[#3d2ac9] text-white text-xs sm:text-sm font-medium transition-all shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>{isResetMode ? 'Updating Credentials...' : 'Activating Credentials...'}</span>
              ) : (
                <>
                  <span>
                    {isResetMode
                      ? 'Update Password & Access Dashboard'
                      : 'Activate & Access Admin Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CreatePasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10">
      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/bidyago_logo.png"
            alt="BidyaGo"
            width={140}
            height={36}
            className="h-8 w-auto object-contain brightness-0 invert select-none"
            priority
          />
          <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-widest bg-purple-950/70 border border-purple-800/80 px-2.5 py-0.5 rounded-full">
            Administration Portal
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Staff Credential Setup</span>
        </div>
      </div>

      {/* Main Content */}
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto my-auto py-10 text-center text-xs text-slate-400">
            Loading activation form...
          </div>
        }
      >
        <CreatePasswordForm />
      </Suspense>

      {/* Footer */}
      <div className="w-full max-w-6xl mx-auto text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} BidyaGo Platform Systems. All Rights Reserved.</p>
      </div>
    </div>
  );
}

