import {
  verifyIdToken,
  verifySessionCookie,
  createSessionCookie as createFirebaseSessionCookie
} from '@prmichaelsen/firebase-admin-sdk-v8';
import type { AuthUser, ServerSession } from '../../types/index.js';
import { authLogger } from '../logger.js';

/**
 * Get the session cookie from a request
 */
function getSessionCookie(request: Request): string | undefined {
  try {
    const cookieHeader = request.headers.get('cookie');

    if (!cookieHeader) {
      return undefined;
    }

    const cookies = cookieHeader.split(';').reduce(
      (acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    return cookies.session;
  } catch (error) {
    console.error('[getSessionCookie] Error:', error);
    return undefined;
  }
}

/**
 * Get the user's session from the server
 * @param request Request object to get cookies from
 * @returns The user's session or null if not authenticated
 */
export async function getServerSession(request: Request): Promise<ServerSession | null> {
  try {
    authLogger.debug('Getting server session');
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      authLogger.debug('No session cookie found');
      return null;
    }

    authLogger.debug('Session cookie found, verifying');

    let decodedToken;
    try {
      decodedToken = await verifySessionCookie(sessionCookie);
    } catch (error) {
      authLogger.debug('Session cookie verification failed, trying ID token verification');
      decodedToken = await verifyIdToken(sessionCookie);
    }

    authLogger.info('Token verified', { userId: decodedToken.sub });

    const isAnonymous = decodedToken.firebase?.sign_in_provider === 'anonymous' || !decodedToken.email;

    const user: AuthUser = {
      uid: decodedToken.sub,
      email: decodedToken.email || null,
      displayName: decodedToken.name || null,
      photoURL: decodedToken.picture || null,
      emailVerified: decodedToken.email_verified || false,
      isAnonymous,
    };

    return { user };
  } catch (error) {
    authLogger.error('Failed to get server session', error);
    return null;
  }
}

/**
 * Check if a user is authenticated
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
  const session = await getServerSession(request);
  return session !== null;
}

/**
 * Create a session cookie for a user
 * @param idToken Firebase ID token
 * @param expiresInMs Expiry in milliseconds (default: 14 days)
 * @returns Session cookie string
 */
export async function createSessionCookie(idToken: string, expiresInMs = 60 * 60 * 24 * 14 * 1000): Promise<string> {
  try {
    const sessionCookie = await createFirebaseSessionCookie(idToken, {
      expiresIn: expiresInMs
    });

    console.log('[createSessionCookie] Session cookie created');
    return sessionCookie;
  } catch (error) {
    console.error('[createSessionCookie] Error:', error);
    throw new Error('Failed to create session cookie');
  }
}

/**
 * Revoke a user's session
 */
export async function revokeSession(request: Request): Promise<void> {
  try {
    const session = await getServerSession(request);

    if (session?.user) {
      console.log('[revokeSession] Session revoked for user:', session.user.uid);
    }
  } catch (error) {
    console.error('[revokeSession] Error:', error);
    throw new Error('Failed to revoke session');
  }
}
