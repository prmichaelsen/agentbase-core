import type { ServerSession } from '../types/index.js'

/**
 * Server-side auth service interface.
 * Wraps session management and authorization guards.
 */
export interface IAuthService {
  getServerSession(request: Request): Promise<ServerSession | null>
  isAuthenticated(request: Request): Promise<boolean>
  createSessionCookie(idToken: string, expiresInMs?: number): Promise<string>
  revokeSession(request: Request): Promise<void>
  requireAuth(request: Request): Promise<void>
  requireAdmin(request: Request, ownerEmails?: string): Promise<void>
  isAdmin(request: Request, ownerEmails?: string): Promise<boolean>
}
