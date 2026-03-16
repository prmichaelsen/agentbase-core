# Task 42: Client SDK Live API Tests (Future)

**Milestone**: M6 — E1 Integration Tests
**Status**: not_started
**Estimated Hours**: 3
**Dependencies**: Task 38, Task 40

---

## Objective

Write integration tests for the client SDK (`HttpClient`, `SvcClient`, `AppClient`) against a running agentbase.me e1 instance.

## Context

This task depends on the agentbase.me e1 environment being deployed and accessible. It validates the full client SDK stack — HTTP transport, auth strategies, and service client methods — against real API endpoints.

**Note**: This task is optional/future. It requires agentbase.me e1 to be running and may need additional env vars (API base URL, test user credentials). Defer until the e1 API is stable.

## Steps

- [ ] Create `src/client/client.integ.test.ts`
- [ ] Test `HttpClient` can make authenticated requests to e1 API
- [ ] Test `AuthSvc.getSession()` with a valid session
- [ ] Test `ProfilesSvc.getPublic()` for a known user
- [ ] Test `OAuthClient` token exchange flow (if OAuth configured in e1)
- [ ] Test error handling — invalid auth returns proper `SdkResponse` with error

## Verification

- [ ] Tests pass when e1 API is running and accessible
- [ ] Tests skip when e1 API URL not configured
- [ ] SdkResponse objects have correct structure
- [ ] No side effects on e1 data (read-only tests or cleanup after write tests)
