import type { ApiContext } from './auth.context.js';
import { authCapabilities } from '@sass-project/auth/server';

export const authResolvers = {
  Query: {
    me: (_parent: unknown, _args: Record<string, never>, context: ApiContext) =>
      context.user,
    currentSession: (
      _parent: unknown,
      _args: Record<string, never>,
      context: ApiContext
    ) => {
      const session = context.authSession?.session;

      if (!session || !context.user) {
        return null;
      }

      return {
        id: session.id,
        expiresAt: session.expiresAt.toISOString(),
        user: context.user,
      };
    },
    authProviderConfig: () => authCapabilities,
  },
  AuthenticatedUser: {
    createdAt: (user: { createdAt: Date | string }) =>
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
    updatedAt: (user: { updatedAt: Date | string }) =>
      user.updatedAt instanceof Date
        ? user.updatedAt.toISOString()
        : user.updatedAt,
  },
};
