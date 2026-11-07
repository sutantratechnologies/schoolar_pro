'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight } from 'lucide-react';
import { authClient } from '@/lib/auth';

export default function WorkspaceLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { data: sessionData, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (!sessionPending && sessionData?.user) {
      const role = (sessionData.user as { role?: string })?.role;
      if (role === 'COLLEGE') {
        router.replace('/dashboard/college');
      } else if (role === 'CONSULTANCY') {
        router.replace('/dashboard/consultancy');
      } else {
        setErrorMessage('This account does not have partner organization credentials.');
      }
    }
  }, [router, sessionData, sessionPending]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Invalid organization credentials.');
        setIsLoading(false);
        return;
      }

      const role = (data?.user as { role?: string })?.role;
      if (role === 'COLLEGE') {
        router.replace('/dashboard/college');
      } else if (role === 'CONSULTANCY') {
        router.replace('/dashboard/consultancy');
      } else {
        setErrorMessage('Access denied. This workspace is exclusively for verified universities and educational consultancies.');
        await authClient.signOut();
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('Unable to reach the authentication service. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-block focus:outline-hidden">
            <Image
              src="/bidyago_logo.png"
              alt="BidyaGo"
              width={140}
              height={36}
              className="h-8 w-auto object-contain brightness-0 invert select-none"
              priority
            />
          </Link>
          <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-widest bg-purple-950/70 border border-purple-800/80 px-2.5 py-0.5 rounded-full">
            Partner Workspace
          </span>
        </div>
        <Link
          href="/register"
          className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          New organization? Apply here →
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto my-auto py-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-light tracking-tight text-white">
              Partner Workspace Sign In
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign in with your verified consultancy or university staff account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {errorMessage && (
              <div role="alert" className="p-3.5 bg-rose-950/60 border border-rose-800 text-xs text-rose-300 rounded-2xl leading-relaxed">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@agency.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-hidden"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-medium transition-all shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            <span>Pending compliance approval? </span>
            <Link href="/status" className="text-purple-400 hover:underline">
              Check verification status
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} BidyaGo Partner Network. All Rights Reserved.</p>
      </div>
    </div>
  );
}

