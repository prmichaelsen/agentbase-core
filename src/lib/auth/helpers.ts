import type { AuthUser } from '../../types/index.js'

/** Returns true if the user is authenticated with a real (non-anonymous) account */
export function isRealUser(user: { isAnonymous?: boolean } | null | undefined): boolean {
  return !!user && !user.isAnonymous
}

/** Server-side version using AuthUser type */
export function isRealUserServer(user: AuthUser | null | undefined): boolean {
  return !!user && !user.isAnonymous
}
