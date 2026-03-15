/**
 * Core auth types used across agentbase projects.
 */

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
}

export interface ServerSession {
  user: AuthUser;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}
