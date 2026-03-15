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

// Result type
export {
  ok, err, isOk, isErr,
  mapOk, mapErr, andThen, getOrElse,
  tryCatch, tryCatchAsync,
} from './result.js'
export type { Ok, Err, Result } from './result.js'
