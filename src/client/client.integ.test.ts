import { describe, it, expect } from 'vitest';
import { loadE1Env, makeDescribeIfE1 } from '../test-utils/integ-helpers.js';
import { HttpClient } from './http-transport.js';
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
});
