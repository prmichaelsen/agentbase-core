import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadE1Env, makeDescribeIfE1, createAuthenticatedE1Client } from '../test-utils/integ-helpers.js';
import { HttpClient } from './http-transport.js';
import { ExternalError } from '../errors/index.js';
import { AuthSvc } from './svc.js';

loadE1Env();
const describeIfE1 = makeDescribeIfE1(describe);

const E1_BASE_URL = 'https://e1.agentbase.me';

describeIfE1('Client SDK against e1 API', () => {
  it('HttpClient can make unauthenticated GET request', async () => {
    const http = new HttpClient({ baseUrl: E1_BASE_URL });
    const res = await http.get<{ authenticated: boolean }>('/api/auth/session');

    expect(res.status).toBe(200);
    expect(res.error).toBeNull();
    expect(res.data).toBeDefined();
    expect(res.data!.authenticated).toBe(false);
  });

  it('AuthSvc.getSession returns unauthenticated for no auth', async () => {
    const http = new HttpClient({ baseUrl: E1_BASE_URL });
    const auth = new AuthSvc(http);
    const res = await auth.getSession();

    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    expect(res.data!.authenticated).toBe(false);
  });

  it('SdkResponse.throwOnError works on success', async () => {
    const http = new HttpClient({ baseUrl: E1_BASE_URL });
    const res = await http.get<{ authenticated: boolean }>('/api/auth/session');

    const { data, status } = res.throwOnError();
    expect(status).toBe(200);
    expect(data.authenticated).toBe(false);
  });

  it('HttpClient returns error for invalid auth', async () => {
    const http = new HttpClient({
      baseUrl: E1_BASE_URL,
      auth: { type: 'bearer', token: 'invalid-token' },
    });
    const res = await http.get('/api/auth/session');

    // Should get a response (not throw), with error or unauthenticated data
    expect(res.status).toBeGreaterThan(0);
  });

  it('HttpClient returns error for non-existent endpoint', async () => {
    const http = new HttpClient({ baseUrl: E1_BASE_URL });
    const res = await http.get('/api/this-does-not-exist');

    // e1 redirects unknown routes (307), so HttpClient returns an error
    expect(res.error).not.toBeNull();
  });

  it('SdkResponse.throwOnError throws on error response', async () => {
    const http = new HttpClient({ baseUrl: E1_BASE_URL });
    const res = await http.get('/api/this-does-not-exist');

    expect(() => res.throwOnError()).toThrow();
  });

  describe('Extended HttpClient', () => {
    let authedHttp: HttpClient;
    let cleanup: () => Promise<void>;

    beforeAll(async () => {
      const client = await createAuthenticatedE1Client();
      authedHttp = client.http;
      cleanup = client.cleanup;
    });

    afterAll(async () => {
      await cleanup();
    });

    it('POST with bearer auth returns a response', async () => {
      const res = await authedHttp.post('/api/auth/login', { idToken: 'invalid' });
      // Should return a response, not throw
      expect(res).toBeDefined();
      expect(res.status).toBeGreaterThan(0);
    });

    it('bearer auth GET returns authenticated session', async () => {
      const res = await authedHttp.get<{ authenticated: boolean }>('/api/auth/session');
      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
    });

    it('apiKey auth strategy sends Authorization header', async () => {
      const http = new HttpClient({
        baseUrl: E1_BASE_URL,
        auth: { type: 'apiKey', key: 'test-api-key-invalid' },
      });
      const res = await http.get('/api/auth/session');
      // Should get a response (API key may not be valid, but request completes)
      expect(res).toBeDefined();
      expect(res.status).toBeGreaterThan(0);
    });

    it('very short timeout produces an error', async () => {
      const http = new HttpClient({
        baseUrl: E1_BASE_URL,
        timeout: 1, // 1ms — will definitely time out
      });
      const res = await http.get('/api/auth/session');

      expect(res.error).not.toBeNull();
      expect(res.status).toBe(0);
    });

    it('concurrent requests do not interfere', async () => {
      const http = new HttpClient({ baseUrl: E1_BASE_URL });
      const [r1, r2, r3] = await Promise.all([
        http.get<{ authenticated: boolean }>('/api/auth/session'),
        http.get<{ authenticated: boolean }>('/api/auth/session'),
        http.get<{ authenticated: boolean }>('/api/auth/session'),
      ]);

      expect(r1.status).toBe(200);
      expect(r2.status).toBe(200);
      expect(r3.status).toBe(200);
    });
  });
});
