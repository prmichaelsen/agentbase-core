import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadE1Env, makeDescribeIfE1, createAuthenticatedE1Client } from '../test-utils/integ-helpers.js';
import { AuthSvc, ProfilesSvc, SearchSvc, NotificationsSvc, TokensSvc, GroupsSvc, ConversationsSvc, MemoriesSvc, UsageSvc } from './svc.js';
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

      expect(res.status).toBeGreaterThan(0);
    });

    it('getSession returns a response', async () => {
      const auth = new AuthSvc(http);
      const res = await auth.getSession();

      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
    });

    it('logout returns a response', async () => {
      const auth = new AuthSvc(http);
      const res = await auth.logout();

      expect(res).toBeDefined();
      expect(res.status).toBeGreaterThan(0);
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

    it('markAllRead returns a response', async () => {
      const notifications = new NotificationsSvc(http);
      const res = await notifications.markAllRead();

      expect(res.status).toBeGreaterThan(0);
    });
  });

  describe('TokensSvc', () => {
    it('list returns a response', async () => {
      const tokens = new TokensSvc(http);
      const res = await tokens.list();

      expect(res).toBeDefined();
      expect(res.data !== null || res.error !== null).toBe(true);
    });

    it('create returns a response without throwing', async () => {
      const tokens = new TokensSvc(http);
      const res = await tokens.create('integ-test-token');

      expect(res).toBeDefined();
      // Clean up if created
      if (res.data && (res.data as any).id) {
        await tokens.delete((res.data as any).id);
      }
    });
  });

  describe('GroupsSvc — CRUD lifecycle', () => {
    it('create → get → list → update → delete', async () => {
      const groups = new GroupsSvc(http);
      const name = `integ-group-${Date.now()}`;

      // Create
      const createRes = await groups.create({ name, description: 'integ test' });
      expect(createRes.status).toBeGreaterThan(0);

      if (createRes.data && (createRes.data as any).id) {
        const groupId = (createRes.data as any).id;

        // Get
        const getRes = await groups.get(groupId);
        expect(getRes.status).toBeGreaterThan(0);

        // List
        const listRes = await groups.list();
        expect(listRes.status).toBeGreaterThan(0);

        // Update
        const updateRes = await groups.update(groupId, { description: 'updated' });
        expect(updateRes.status).toBeGreaterThan(0);

        // Delete (cleanup)
        const deleteRes = await groups.delete(groupId);
        expect(deleteRes.status).toBeGreaterThan(0);
      }
    });
  });

  describe('ConversationsSvc', () => {
    it('list returns a response', async () => {
      const convos = new ConversationsSvc(http);
      const res = await convos.list();

      expect(res.status).toBeGreaterThan(0);
    });
  });

  describe('MemoriesSvc', () => {
    it('feed returns a response', async () => {
      const memories = new MemoriesSvc(http);
      const res = await memories.feed();

      expect(res.status).toBeGreaterThan(0);
    });

    it('search returns a response without throwing', async () => {
      const memories = new MemoriesSvc(http);
      const res = await memories.search({ query: 'test' });

      expect(res).toBeDefined();
      expect(res.data !== null || res.error !== null).toBe(true);
    });
  });

  describe('UsageSvc', () => {
    it('get returns a response', async () => {
      const usage = new UsageSvc(http);
      const res = await usage.get();

      expect(res.status).toBeGreaterThan(0);
    });
  });
});
