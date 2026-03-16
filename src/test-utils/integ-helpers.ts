import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { loadConfig, validateConfig } from '../config/index.js';
import type { AgentbaseConfig } from '../config/index.js';

const ENV_FILE = resolve(process.cwd(), '.env.e1.local');

/**
 * Load environment variables from .env.e1.local.
 * Returns true if the file exists and was loaded, false otherwise.
 */
export function loadE1Env(): boolean {
  if (!existsSync(ENV_FILE)) {
    return false;
  }
  config({ path: ENV_FILE });
  return true;
}

/**
 * Check if e1 credentials are available.
 * Call this at the top of describe blocks to skip when credentials are absent.
 */
export function hasE1Credentials(): boolean {
  return existsSync(ENV_FILE) && !!process.env.FIREBASE_PROJECT_ID;
}

/**
 * Load and return typed config from e1 environment variables.
 * Throws if env file is missing or config is invalid.
 */
export function getE1Config(): AgentbaseConfig {
  if (!loadE1Env()) {
    throw new Error(`E1 env file not found: ${ENV_FILE}`);
  }
  const cfg = loadConfig();
  validateConfig(cfg, { requireFirebaseClient: true });
  return cfg;
}

/**
 * Helper to conditionally run a describe block only when e1 credentials exist.
 * Usage: describeIfE1('my tests', () => { ... })
 *
 * Import `describe` from vitest in your test file, then pass it:
 *   import { describe } from 'vitest';
 *   const e1Describe = makeDescribeIfE1(describe);
 */
export function makeDescribeIfE1(desc: typeof globalThis.describe) {
  return hasE1Credentials() ? desc : desc.skip;
}

const E1_BASE_URL = 'https://e1.agentbase.me';

/**
 * Create an authenticated HttpClient for e1 integration tests.
 * Signs up a test user, gets an ID token, and returns { http, email, password, idToken, cleanup }.
 * Call cleanup() in afterAll to delete the test user.
 */
export async function createAuthenticatedE1Client() {
  // Lazy imports to avoid pulling Firebase into non-integ contexts
  const { initializeFirebase, signUp, getIdToken } = await import('../lib/firebase-client.js');
  const { initFirebaseAdmin } = await import('../lib/firebase-admin.js');
  const { HttpClient } = await import('../client/http-transport.js');
  const { getAuth, deleteUser } = await import('firebase/auth');

  initializeFirebase({
    apiKey: process.env.FIREBASE_API_KEY!,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.FIREBASE_PROJECT_ID!,
  });
  initFirebaseAdmin();

  const email = `integ-svc-${Date.now()}@test.agentbase.dev`;
  const password = 'IntegSvc!2026secure';

  await signUp(email, password);
  const idToken = (await getIdToken())!;

  const http = new HttpClient({
    baseUrl: E1_BASE_URL,
    auth: { type: 'bearer', token: idToken },
  });

  const cleanup = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    } catch {
      // ignore
    }
  };

  return { http, email, password, idToken, cleanup };
}
