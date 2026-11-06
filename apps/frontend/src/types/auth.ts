import type { CurrentSession, UserRole } from '@sass-project/contracts';

export type Role = UserRole;
export type Session = CurrentSession;

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuthError {
  message: string;
  code?: string;
}
