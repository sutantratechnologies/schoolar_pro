'use client';

import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';

export const authBaseURL =
  typeof window === 'undefined' ? undefined : window.location.origin;

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [emailOTPClient()],
});

export type AuthClientSession = typeof authClient.$Infer.Session;
export type AuthClientUser = AuthClientSession['user'];
