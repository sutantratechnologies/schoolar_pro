'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { authClient } from '@/lib/auth';

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(queryEmail);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state if query parameter changes or is present
  useEffect(() => {
    const paramEmail = searchParams.get('email');
    if (paramEmail && paramEmail !== email) {
      setEmail(paramEmail);
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: requestError } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (requestError) {
        setError(requestError.message || 'Unable to request a password reset.');
        return;
      }

      setMessage(
        `If an account exists for "${email.trim()}", a password reset link has been sent.`
      );
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
          Reset your password
        </h1>
        <p className="text-sm text-slate-600">
          Enter your account email and we’ll send a secure reset link.
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

        <label className="block text-xs font-medium text-slate-700">
          Email address
          <span className="relative mt-2 block">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-full border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#4b37df] focus:outline-hidden focus:ring-1 focus:ring-[#4b37df] transition-colors"
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] px-5 py-3 text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Sending link…' : 'Send reset link'}
        </button>
      </form>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <Link
          href={
            email.trim()
              ? `/login?email=${encodeURIComponent(email.trim())}`
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

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center text-sm text-slate-400">
            Loading password reset...
          </div>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </main>
  );
}
