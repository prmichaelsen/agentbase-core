# Task 32: Client SDK Tests

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: T28, T29, T30, T31

---

## Objective

Write comprehensive unit tests for all client SDK layers: HTTP transport, SvcClient resource classes, AppClient workflows, and OAuth helpers.

---

## Context

The client SDK is the primary interface developers use to interact with the API. Thorough testing ensures reliability across auth strategies, error scenarios, and multi-step workflows. All tests mock the network layer (fetch) — no real API calls.

---

## Steps

### 1. Set up test infrastructure

Create test files in `tests/client/`:
- `http-transport.test.ts`
- `svc-client.test.ts`
- `app-client.test.ts`
- `oauth.test.ts`

Mock `global.fetch` for all HTTP tests.

### 2. Test HttpClient

- **Auth injection**: Verify correct headers for Firebase, OAuth, and API key strategies
- **HTTP methods**: Test GET, POST, PUT, DELETE, and upload methods
- **SdkResponse shape**: Verify `{ data, error, status }` structure on success and failure
- **Error normalization**: Test mapping of 401, 403, 404, 422, 429, 5xx to typed errors
- **Network errors**: Test fetch failures map to `NetworkError`
- **Timeout**: Test that requests abort after configured timeout
- **Retry logic**: Test exponential backoff on 429 and 5xx responses
- **Retry-After header**: Test that header is respected
- **Interceptors**: Test request and response interceptors fire in order

### 3. Test SvcClient resource methods

For each service class, test at least:
- One list/get method (verify correct path and params)
- One create/post method (verify correct body serialization)
- One update/put method
- One delete method
- Verify generated types flow through correctly

Focus on:
- `MemoriesSvc.search()` — test different search modes
- `AuthSvc.login()` / `AuthSvc.oauthToken()` — test different grant types
- `GroupsSvc.ban()` / `GroupsSvc.unban()` — test moderation actions
- `StorageSvc.upload()` — test multipart form data

### 4. Test AppClient workflows

- `loginAndGetSession()`: Mock login success -> session fetch; mock login failure -> early return
- `createGroupAndInvite()`: Mock group creation + member addition; test partial failure cleanup
- `searchAndFetchMemories()`: Mock search + parallel detail fetches
- `oauthAuthorizeAndExchange()`: Mock full PKCE flow end-to-end

### 5. Test OAuth helpers

- `generateCodeVerifier()`: Verify length constraints (43-128 chars), character set
- `generateCodeChallenge()`: Verify against known test vectors (RFC 7636 Appendix B)
- `generatePKCEPair()`: Verify verifier and challenge are consistent
- `buildAuthorizationUrl()`: Verify URL structure, query params, encoding
- `exchangeAuthorizationCode()`: Verify correct POST body
- `refreshAccessToken()`: Verify correct POST body with refresh_token grant
- `exchangeApiToken()`: Verify correct POST body with api_token grant
- `InMemoryTokenStorage`: Test store, retrieve, clear lifecycle
- `OAuthAuthStrategy`: Test auto-refresh triggers when token expired

### 6. Test SdkResponse handling edge cases

- Empty response body (204 No Content)
- Non-JSON response (HTML error pages)
- Malformed JSON response
- Response with unexpected schema

---

## Verification

- [ ] All test files exist in `tests/client/`
- [ ] `npm test` passes with all client SDK tests green
- [ ] HttpClient tests cover all 3 auth strategies
- [ ] HttpClient tests cover error normalization for all status codes
- [ ] HttpClient tests cover retry logic
- [ ] SvcClient tests cover at least one method per service class
- [ ] AppClient tests cover all workflow methods
- [ ] OAuth tests cover PKCE generation with RFC 7636 test vectors
- [ ] OAuth tests cover all 3 grant types
- [ ] TokenStorage tests cover full lifecycle
- [ ] Edge cases (empty body, non-JSON, malformed) are tested

---

**Next Task**: [task-33-package-exports-docs.md](./task-33-package-exports-docs.md)
