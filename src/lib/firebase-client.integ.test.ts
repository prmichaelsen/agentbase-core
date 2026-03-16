import { describe, it, expect, afterAll } from 'vitest';
import { loadE1Env, makeDescribeIfE1 } from '../test-utils/integ-helpers.js';
import {
  initializeFirebase,
  signUp,
  signIn,
  getIdToken,
  getCurrentUser,
  logout,
} from './firebase-client.js';
import { getAuth, deleteUser } from 'firebase/auth';

loadE1Env();
const describeIfE1 = makeDescribeIfE1(describe);

// Use a unique test email per run to avoid conflicts
const TEST_EMAIL = `integ-test-${Date.now()}@test.agentbase.dev`;
const TEST_PASSWORD = 'IntegTest!2026secure';

describeIfE1('Firebase Client Auth (e1 integration)', () => {
  // Clean up: delete the test user after all tests
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

  it('initializeFirebase does not throw with e1 config', () => {
    expect(() =>
      initializeFirebase({
        apiKey: process.env.FIREBASE_API_KEY!,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.FIREBASE_PROJECT_ID!,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      })
    ).not.toThrow();
  });

  it('signUp creates a new user with email/password', async () => {
    initializeFirebase({
      apiKey: process.env.FIREBASE_API_KEY!,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.FIREBASE_PROJECT_ID!,
    });

    const credential = await signUp(TEST_EMAIL, TEST_PASSWORD);
    expect(credential).toBeDefined();
    expect(credential.user).toBeDefined();
    expect(credential.user.uid).toBeTruthy();
    expect(credential.user.email).toBe(TEST_EMAIL);
  });

  it('getIdToken returns a valid JWT after sign-up', async () => {
    const token = await getIdToken();

    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    // JWT has 3 dot-separated segments
    expect(token!.split('.')).toHaveLength(3);
  });

  it('getCurrentUser returns the signed-in user', async () => {
    const user = await getCurrentUser();

    expect(user).toBeDefined();
    expect(user!.uid).toBeTruthy();
    expect(user!.email).toBe(TEST_EMAIL);
  });

  it('logout and signIn work correctly', async () => {
    await logout();
    expect(await getCurrentUser()).toBeNull();

    const credential = await signIn(TEST_EMAIL, TEST_PASSWORD);
    expect(credential.user.uid).toBeTruthy();
    expect(credential.user.email).toBe(TEST_EMAIL);
  });

  it('logout clears the current user', async () => {
    expect(await getCurrentUser()).toBeDefined();
    await logout();
    expect(await getCurrentUser()).toBeNull();
  });
});
