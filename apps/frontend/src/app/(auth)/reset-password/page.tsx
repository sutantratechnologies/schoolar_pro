'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { authClient } from '@/lib/auth';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token') ?? '';
    const urlEmail = searchParams.get('email') ?? '';
    setToken(urlToken);
    setEmail(urlEmail);

    if (searchParams.get('error')) {
      setError('This reset link is invalid or expired. Please request a new one.');
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError('This reset link is invalid or expired. Please request a new one.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        setError(resetError.message || 'Unable to reset your password.');
        return;
      }

      setMessage('Your password has been updated successfully. You can now sign in.');
    } catch {
      setError('Unable to reach the authentication service. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link href="/" aria-label="BidyaGo home">
        <Image
          src="/bidyago_logo.png"
          alt="BidyaGo"
          width={140}
          height={36}
          className="h-8 w-auto"
          priority
        />
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-slate-900">
          Choose a new password
        </h1>
        <p className="text-sm text-slate-600">
          {email ? (
            <>
              Resetting credentials for{' '}
              <strong className="text-slate-900 font-medium">{email}</strong>.
            </>
          ) : (
            'Use at least 8 characters for your new security password.'
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
          >
            {error}
          </p>
        )}

        {!message && (
          <>
            <label className="block text-xs font-medium text-slate-700">
              New password
              <span className="relative mt-2 block">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-full border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#4b37df] focus:outline-hidden focus:ring-1 focus:ring-[#4b37df] transition-colors"
                />
              </span>
            </label>
            <button
              type="submit"
              disabled={loading || !token || password.length < 8}
              className="w-full rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] px-5 py-3 text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </>
        )}
      </form>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <Link
          href={
            email
              ? `/login?email=${encodeURIComponent(email)}`
              : '/login'
          }
          className="inline-flex items-center gap-1.5 hover:text-[#4b37df] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </Link>
        <span className="text-[11px] text-slate-400">BidyaGo Auth</span>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center text-sm text-slate-400">
            Loading reset link...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
