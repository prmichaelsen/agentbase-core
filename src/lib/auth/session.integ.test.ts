import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadE1Env, makeDescribeIfE1 } from '../../test-utils/integ-helpers.js';
import { initializeFirebase, signUp, getIdToken, logout } from '../firebase-client.js';
import { initFirebaseAdmin } from '../firebase-admin.js';
import {
  getServerSession,
  isAuthenticated,
  createSessionCookie,
  revokeSession,
} from './session.js';
import { getAuth, deleteUser } from 'firebase/auth';

loadE1Env();
const describeIfE1 = makeDescribeIfE1(describe);

const TEST_EMAIL = `integ-session-${Date.now()}@test.agentbase.dev`;
const TEST_PASSWORD = 'IntegSession!2026secure';

function makeRequest(sessionCookie?: string): Request {
  const headers = new Headers();
  if (sessionCookie) {
    headers.set('cookie', `session=${sessionCookie}`);
  }
  return new Request('http://localhost/test', { headers });
}

describeIfE1('Firebase Admin + Session (e1 integration)', () => {
  let idToken: string;

  beforeAll(async () => {
    // Init Firebase client
    initializeFirebase({
      apiKey: process.env.FIREBASE_API_KEY!,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.FIREBASE_PROJECT_ID!,
    });

    // Init Firebase Admin
    initFirebaseAdmin();

    // Create test user and get ID token
    await signUp(TEST_EMAIL, TEST_PASSWORD);
    idToken = (await getIdToken())!;
  });

  afterAll(async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    } catch {
      // ignore cleanup errors
    }
  });

  it('createSessionCookie returns a valid cookie string', async () => {
    const cookie = await createSessionCookie(idToken);

    expect(cookie).toBeTruthy();
    expect(typeof cookie).toBe('string');
    expect(cookie.length).toBeGreaterThan(10);
  });

  it('getServerSession returns session with correct user from session cookie', async () => {
    const cookie = await createSessionCookie(idToken);
    const request = makeRequest(cookie);

    const session = await getServerSession(request);

    expect(session).not.toBeNull();
    expect(session!.user).toBeDefined();
    expect(session!.user.uid).toBeTruthy();
    expect(session!.user.email).toBe(TEST_EMAIL);
  });

  it('isAuthenticated returns true for valid session', async () => {
    const cookie = await createSessionCookie(idToken);
    const request = makeRequest(cookie);

    const result = await isAuthenticated(request);
    expect(result).toBe(true);
  });

  it('getServerSession returns null for request without cookie', async () => {
    const request = makeRequest();
    const session = await getServerSession(request);
    expect(session).toBeNull();
  });

  it('getServerSession returns null for invalid cookie', async () => {
    const request = makeRequest('invalid-garbage-cookie');
    const session = await getServerSession(request);
    expect(session).toBeNull();
  });

  it('revokeSession does not throw for valid session', async () => {
    const cookie = await createSessionCookie(idToken);
    const request = makeRequest(cookie);

    await expect(revokeSession(request)).resolves.toBeUndefined();
  });

  it('revokeSession does not throw for unauthenticated request', async () => {
    const request = makeRequest();
    await expect(revokeSession(request)).resolves.toBeUndefined();
  });

  it('getServerSession falls back to ID token verification', async () => {
    // Pass the raw ID token as the cookie — session cookie verification fails,
    // but ID token verification should succeed as fallback
    const request = makeRequest(idToken);
    const session = await getServerSession(request);

    expect(session).not.toBeNull();
    expect(session!.user.email).toBe(TEST_EMAIL);
  });
});
