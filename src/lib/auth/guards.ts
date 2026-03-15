import { getServerSession } from './session.js';
import { UnauthorizedError, ForbiddenError } from '../../errors/index.js';

/**
 * Require authentication. Throws UnauthorizedError if not authenticated.
 */
export async function requireAuth(request: Request): Promise<void> {
  const session = await getServerSession(request);

  if (!session || !session.user) {
    throw new UnauthorizedError('Authentication required');
  }
}

/**
 * Require admin access. Throws UnauthorizedError or ForbiddenError.
 * @param ownerEmails Comma-separated admin emails (or pass via env)
 */
export async function requireAdmin(request: Request, ownerEmails?: string): Promise<void> {
  const session = await getServerSession(request);

  if (!session || !session.user) {
    throw new UnauthorizedError('Authentication required');
  }

  const emails = (ownerEmails ?? process.env.OWNER_EMAILS ?? '').split(',').map(e => e.trim());

  if (!session.user.email || !emails.includes(session.user.email)) {
    throw new ForbiddenError('Admin access required');
  }
}

/**
 * Check if a user is an admin (boolean, does not throw)
 */
export async function isAdmin(request: Request, ownerEmails?: string): Promise<boolean> {
  const session = await getServerSession(request);

  if (!session || !session.user || !session.user.email) {
    return false;
  }

  const emails = (ownerEmails ?? process.env.OWNER_EMAILS ?? '').split(',').map(e => e.trim());
  return emails.includes(session.user.email);
}
