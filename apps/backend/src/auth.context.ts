import { fromNodeHeaders } from 'better-auth/node';
import type { Request, Response } from 'express';
import type { AuthSession, AuthUser } from '@sass-project/auth/server';
import type { PrismaClient } from '@sass-project/database';
import { auth } from '@sass-project/auth/server';

export interface ApiContext {
  prisma: PrismaClient;
  request: Request;
  response: Response;
  authSession: AuthSession | null;
  user: AuthUser | null;
}

export async function createApiContext(
  request: Request,
  response: Response,
  prisma: PrismaClient
): Promise<ApiContext> {
  const authSession = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  return {
    prisma,
    request,
    response,
    authSession,
    user: authSession?.user ?? null,
  };
}
