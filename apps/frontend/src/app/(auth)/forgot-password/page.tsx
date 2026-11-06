'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { authClient } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      setMessage('If an account exists for this address, a reset link will be sent.');
    } catch {
      setError('Unable to reach the authentication service. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/" aria-label="BidyaGo home">
          <Image src="/bidyago_logo.png" alt="BidyaGo" width={140} height={36} className="h-8 w-auto" priority />
        </Link>
        <div className="space-y-2">
          <h1 className="text-2xl font-medium text-slate-900">Reset your password</h1>
          <p className="text-sm text-slate-600">Enter your account email and we’ll send a secure reset link.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
          <label className="block text-xs font-medium text-slate-700">
            Email address
            <span className="relative mt-2 block">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-full border border-slate-200 px-10 py-3 text-sm focus:border-[#4b37df] focus:outline-hidden focus:ring-1 focus:ring-[#4b37df]"
              />
            </span>
          </label>
          <button disabled={loading} className="w-full rounded-full bg-[#4b37df] px-5 py-3 text-sm text-white disabled:opacity-50">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#4b37df]">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </section>
    </main>
  );
}
