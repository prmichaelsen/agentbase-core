import { getServerSession } from './session.js';

/**
 * Middleware to require authentication
 * @returns Response object with error if not authenticated, null if authorized
 */
export async function requireAuth(request: Request): Promise<Response | null> {
  const session = await getServerSession(request);

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Authentication required' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return null;
}

/**
 * Middleware to require admin access
 * @param ownerEmails Comma-separated admin emails (or pass via env)
 */
export async function requireAdmin(request: Request, ownerEmails?: string): Promise<Response | null> {
  const session = await getServerSession(request);

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Authentication required' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const emails = (ownerEmails ?? process.env.OWNER_EMAILS ?? '').split(',').map(e => e.trim());

  if (!session.user.email || !emails.includes(session.user.email)) {
    return new Response(
      JSON.stringify({ error: 'Forbidden: Admin access required' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return null;
}

/**
 * Check if a user is an admin
 */
export async function isAdmin(request: Request, ownerEmails?: string): Promise<boolean> {
  const session = await getServerSession(request);

  if (!session || !session.user || !session.user.email) {
    return false;
  }

  const emails = (ownerEmails ?? process.env.OWNER_EMAILS ?? '').split(',').map(e => e.trim());
  return emails.includes(session.user.email);
}
