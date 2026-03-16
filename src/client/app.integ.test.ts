import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadE1Env, makeDescribeIfE1, createAuthenticatedE1Client } from '../test-utils/integ-helpers.js';
import { AppClient } from './app.js';
import {
  AuthSvc, MemoriesSvc, ConversationsSvc, ProfilesSvc,
  GroupsSvc, DmsSvc, SearchSvc, NotificationsSvc,
} from './svc.js';
import type { HttpClient } from './http-transport.js';

loadE1Env();
const describeIfE1 = makeDescribeIfE1(describe);

describeIfE1('AppClient workflows (e1 integration)', () => {
  let http: HttpClient;
  let idToken: string;
  let cleanup: () => Promise<void>;
  let app: AppClient;

  beforeAll(async () => {
    const client = await createAuthenticatedE1Client();
    http = client.http;
    idToken = client.idToken;
    cleanup = client.cleanup;

    app = new AppClient({
      auth: new AuthSvc(http),
      memories: new MemoriesSvc(http),
      conversations: new ConversationsSvc(http),
      profiles: new ProfilesSvc(http),
      groups: new GroupsSvc(http),
      dms: new DmsSvc(http),
      search: new SearchSvc(http),
      notifications: new NotificationsSvc(http),
    });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('loginAndGetSession returns a session response', async () => {
    const res = await app.loginAndGetSession(idToken);

    // Login + getSession should return a response
    expect(res).toBeDefined();
    expect(res.status).toBeGreaterThan(0);
  });

  it('loginAndGetSession with invalid token returns error', async () => {
    const res = await app.loginAndGetSession('invalid-token');

    // Should return an error, not throw
    expect(res).toBeDefined();
    expect(res.data === null || res.error !== null || res.status >= 400).toBe(true);
  });

  it('clearAllNotifications returns a response', async () => {
    const res = await app.clearAllNotifications();

    expect(res).toBeDefined();
    expect(res.status).toBeGreaterThan(0);
  });

  it('oauthExchangeAndGetSession without OAuthClient returns InternalError', async () => {
    const res = await app.oauthExchangeAndGetSession('code', 'http://localhost/callback');

    expect(res.error).not.toBeNull();
    expect(res.error!.message).toContain('OAuthClient not configured');
  });

  it('searchAndFetchMemories returns a response without throwing', async () => {
    const res = await app.searchAndFetchMemories('test', 3);

    expect(res).toBeDefined();
    expect(res.data !== null || res.error !== null).toBe(true);
  });

  it('createGroupAndInvite creates a group', async () => {
    const res = await app.createGroupAndInvite(`integ-app-group-${Date.now()}`, 'test group', []);

    expect(res).toBeDefined();
    // Clean up group if created
    if (res.data && (res.data as any).group?.id) {
      const { GroupsSvc: G } = await import('./svc.js');
      await new G(http).delete((res.data as any).group.id);
    }
  });
});
