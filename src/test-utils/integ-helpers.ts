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
