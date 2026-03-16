import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadE1Env, makeDescribeIfE1 } from '../../test-utils/integ-helpers.js';
import { initializeFirebase, signUp, getIdToken, logout } from '../firebase-client.js';
import { initFirebaseAdmin } from '../firebase-admin.js';
import { createSessionCookie } from './session.js';
import { requireAuth, requireAdmin, isAdmin } from './guards.js';
import { UnauthorizedError, ForbiddenError } from '../../errors/index.js';
import { getAuth, deleteUser } from 'firebase/auth';

loadE1Env();
const describeIfE1 = makeDescribeIfE1(describe);

const TEST_EMAIL = `integ-guards-${Date.now()}@test.agentbase.dev`;
const TEST_PASSWORD = 'IntegGuards!2026secure';

function makeRequest(sessionCookie?: string): Request {
  const headers = new Headers();
  if (sessionCookie) {
    headers.set('cookie', `session=${sessionCookie}`);
  }
  return new Request('http://localhost/test', { headers });
}

describeIfE1('Auth Guards (e1 integration)', () => {
  let sessionCookie: string;

  beforeAll(async () => {
    initializeFirebase({
      apiKey: process.env.FIREBASE_API_KEY!,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.FIREBASE_PROJECT_ID!,
    });
    initFirebaseAdmin();

    await signUp(TEST_EMAIL, TEST_PASSWORD);
    const idToken = (await getIdToken())!;
    sessionCookie = await createSessionCookie(idToken);
  });

  afterAll(async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    } catch {
      // ignore
    }
  });

  it('requireAuth does not throw for authenticated request', async () => {
    const request = makeRequest(sessionCookie);
    await expect(requireAuth(request)).resolves.toBeUndefined();
  });

  it('requireAuth throws UnauthorizedError for unauthenticated request', async () => {
    const request = makeRequest();
    await expect(requireAuth(request)).rejects.toThrow(UnauthorizedError);
  });

  it('requireAdmin throws ForbiddenError for non-admin user', async () => {
    const request = makeRequest(sessionCookie);
    // TEST_EMAIL is not in OWNER_EMAILS
    await expect(requireAdmin(request)).rejects.toThrow(ForbiddenError);
  });

  it('requireAdmin does not throw when user email is in ownerEmails', async () => {
    const request = makeRequest(sessionCookie);
    // Pass the test email as owner
    await expect(requireAdmin(request, TEST_EMAIL)).resolves.toBeUndefined();
  });

  it('isAdmin returns false for non-admin user', async () => {
    const request = makeRequest(sessionCookie);
    const result = await isAdmin(request);
    expect(result).toBe(false);
  });

  it('isAdmin returns true when user email matches ownerEmails', async () => {
    const request = makeRequest(sessionCookie);
    const result = await isAdmin(request, TEST_EMAIL);
    expect(result).toBe(true);
  });

  it('isAdmin returns false for unauthenticated request', async () => {
    const request = makeRequest();
    const result = await isAdmin(request);
    expect(result).toBe(false);
  });
});
