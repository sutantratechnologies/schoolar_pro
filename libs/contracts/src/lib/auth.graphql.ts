import type { UserRole } from '@sass-project/shared';

export type { UserRole } from '@sass-project/shared';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentSession {
  id: string;
  expiresAt: string;
  user: AuthenticatedUser;
}

export interface AuthProviderConfig {
  googleOAuthEnabled: boolean;
}

export const authTypeDefs = `#graphql
  enum UserRole {
    STUDENT
    ADMIN
    SUPER_ADMIN
    COLLEGE
    CONSULTANCY
  }

  type AuthenticatedUser {
    id: ID!
    name: String!
    email: String!
    emailVerified: Boolean!
    image: String
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  type CurrentSession {
    id: ID!
    expiresAt: String!
    user: AuthenticatedUser!
  }

  type AuthProviderConfig {
    googleOAuthEnabled: Boolean!
  }

  extend type Query {
    me: AuthenticatedUser
    currentSession: CurrentSession
    authProviderConfig: AuthProviderConfig!
  }
`;

export const ME_QUERY = `query Me {
  me {
    id
    name
    email
    emailVerified
    image
    role
    createdAt
    updatedAt
  }
}`;

export const CURRENT_SESSION_QUERY = `query CurrentSession {
  currentSession {
    id
    expiresAt
    user {
      id
      name
      email
      emailVerified
      image
      role
      createdAt
      updatedAt
    }
  }
}`;

export const AUTH_PROVIDER_CONFIG_QUERY = `query AuthProviderConfig {
  authProviderConfig {
    googleOAuthEnabled
  }
}`;
