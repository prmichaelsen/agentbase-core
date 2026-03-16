import { describe, it, expect } from 'vitest';
import { loadE1Env, makeDescribeIfE1 } from '../test-utils/integ-helpers.js';
import { loadConfig, validateConfig } from './index.js';
import { ValidationError } from '../errors/index.js';

loadE1Env();
const describeIfE1 = makeDescribeIfE1(describe);

describeIfE1('Config Loading (e1 integration)', () => {
  it('loadConfig returns a fully populated config from e1 env', () => {
    const config = loadConfig();

    // Firebase client fields
    expect(config.firebaseClient.apiKey).toBeTruthy();
    expect(config.firebaseClient.authDomain).toBeTruthy();
    expect(config.firebaseClient.projectId).toBe('agentbase-e1');
    expect(config.firebaseClient.storageBucket).toBeTruthy();
    expect(config.firebaseClient.messagingSenderId).toBeTruthy();
    expect(config.firebaseClient.appId).toBeTruthy();

    // Firebase admin fields
    expect(config.firebaseAdmin.serviceAccountKey).toBeTruthy();
    expect(config.firebaseAdmin.projectId).toBe('agentbase-e1');

    // Auth config
    expect(config.auth.ownerEmails).toContain('michaelsenpatrick@gmail.com');
  });

  it('validateConfig passes with requireFirebaseClient', () => {
    const config = loadConfig();
    expect(() =>
      validateConfig(config, { requireFirebaseClient: true })
    ).not.toThrow();
  });

  it('validateConfig passes with requireFirebaseAdmin', () => {
    const config = loadConfig();
    expect(() =>
      validateConfig(config, { requireFirebaseAdmin: true })
    ).not.toThrow();
  });

  it('validateConfig passes with both required', () => {
    const config = loadConfig();
    expect(() =>
      validateConfig(config, { requireFirebaseAdmin: true, requireFirebaseClient: true })
    ).not.toThrow();
  });

  it('validateConfig throws for missing fields on empty config', () => {
    const emptyConfig = loadConfig({});
    expect(() =>
      validateConfig(emptyConfig, { requireFirebaseAdmin: true, requireFirebaseClient: true })
    ).toThrow(ValidationError);
  });
});
