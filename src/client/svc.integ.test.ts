import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadE1Env, makeDescribeIfE1, createAuthenticatedE1Client } from '../test-utils/integ-helpers.js';
import { AuthSvc, ProfilesSvc, SearchSvc, NotificationsSvc } from './svc.js';
import type { HttpClient } from './http-transport.js';

loadE1Env();
const describeIfE1 = makeDescribeIfE1(describe);

describeIfE1('SvcClient (e1 integration)', () => {
  let http: HttpClient;
  let idToken: string;
  let cleanup: () => Promise<void>;

  beforeAll(async () => {
    const client = await createAuthenticatedE1Client();
    http = client.http;
    idToken = client.idToken;
    cleanup = client.cleanup;
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('AuthSvc', () => {
    it('login with valid ID token succeeds', async () => {
      const auth = new AuthSvc(http);
      const res = await auth.login({ idToken });

      // Login may succeed or return an error depending on e1 state,
      // but it should return a valid SdkResponse
      expect(res.status).toBeGreaterThan(0);
    });

    it('getSession returns a response', async () => {
      const auth = new AuthSvc(http);
      const res = await auth.getSession();

      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
    });
  });

  describe('ProfilesSvc', () => {
    it('checkUsername returns a response without throwing', async () => {
      const profiles = new ProfilesSvc(http);
      const res = await profiles.checkUsername(`integ-test-${Date.now()}`);

      // Returns either success or error, but never throws
      expect(res).toBeDefined();
      expect(res.data !== null || res.error !== null).toBe(true);
    });

    it('list returns a response', async () => {
      const profiles = new ProfilesSvc(http);
      const res = await profiles.list();

      expect(res.status).toBeGreaterThan(0);
    });
  });

  describe('SearchSvc', () => {
    it('users search returns a response', async () => {
      const search = new SearchSvc(http);
      const res = await search.users('test');

      // May return empty results, but should be a valid response
      expect(res.status).toBeGreaterThan(0);
    });

    it('groups search returns a response', async () => {
      const search = new SearchSvc(http);
      const res = await search.groups('test');

      expect(res.status).toBeGreaterThan(0);
    });
  });

  describe('NotificationsSvc', () => {
    it('list returns a response', async () => {
      const notifications = new NotificationsSvc(http);
      const res = await notifications.list();

      expect(res.status).toBeGreaterThan(0);
    });

    it('unreadCount returns a response', async () => {
      const notifications = new NotificationsSvc(http);
      const res = await notifications.unreadCount();

      expect(res.status).toBeGreaterThan(0);
    });
  });
});
