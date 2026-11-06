'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MailCheck, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { authClient } from '@/lib/auth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setEmail(new URLSearchParams(window.location.search).get('email') ?? '');
  }, []);

  const handleResend = async () => {
    if (!email.trim()) {
      setErrorMessage('Enter the email address you used to register.');
      return;
    }

    setResending(true);
    setResendStatus('');
    setErrorMessage('');

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim(),
        type: 'email-verification',
      });

      if (error) {
        setErrorMessage(error.message || 'Unable to send a verification email.');
        return;
      }

      setResendStatus('If the address needs verification, a six-digit code will arrive shortly.');
    } catch {
      setErrorMessage('Unable to reach the authentication service. Try again.');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (!email.trim() || !/^\d{6}$/.test(otp)) {
      setErrorMessage('Enter the six-digit code from the most recent email.');
      return;
    }

    setVerifying(true);
    setResendStatus('');
    setErrorMessage('');

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: email.trim(),
        otp,
      });

      if (error) {
        setErrorMessage(error.message || 'Unable to verify your email address.');
        return;
      }

      router.replace(`/login?verified=1&email=${encodeURIComponent(email.trim())}`);
    } catch {
      setErrorMessage('Unable to reach the authentication service. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="inline-block group focus:outline-hidden" aria-label="BidyaGo Home">
          <Image
            src="/bidyago_logo.png"
            alt="BidyaGo"
            width={150}
            height={38}
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-normal text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#4b37df] flex items-center justify-center mx-auto shadow-2xs">
            <MailCheck className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-light text-slate-900 tracking-tight">
              Verify Your Email Address
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {email ? (
                <>
                  Enter the six-digit code if you received it at{' '}
                  <span className="font-medium text-slate-700">{email}</span>.
                  If it hasn’t arrived, use the resend option below.
                </>
              ) : (
                'Enter the six-digit code if you received it. If it hasn’t arrived, use the resend option below.'
              )}
            </p>
          </div>

          <label className="block text-left text-xs font-medium text-slate-700">
            Verification code
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
              className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm tracking-[0.3em] text-slate-900 focus:border-[#4b37df] focus:outline-hidden focus:ring-1 focus:ring-[#4b37df]"
            />
          </label>

          {errorMessage && (
            <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          {resendStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              {resendStatus}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying}
              className="w-full py-2.5 px-4 rounded-full bg-[#4b37df] hover:bg-[#3c2cc5] text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{verifying ? 'Verifying...' : 'Verify Email'}</span>
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Sending...' : 'Resend Verification Code'}</span>
            </button>

            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-[#4b37df] text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 block cursor-pointer"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-100 text-center text-xs text-slate-400 font-normal">
        <p>© {new Date().getFullYear()} BidyaGo, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
