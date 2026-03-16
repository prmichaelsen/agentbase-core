# Task 44: Authenticated SvcClient Tests

**Milestone**: M7 — E2E Service Client Tests
**Status**: not_started
**Estimated Hours**: 3
**Dependencies**: Task 43

---

## Objective

Write integration tests for SvcClient service classes against the live e1 API using authenticated requests.

## Context

The 15 SvcClient classes wrap ~85 API methods but have zero integration test coverage. This task covers the highest-value read endpoints and one write lifecycle (TokensSvc create/list/revoke).

## Steps

- [ ] Create shared helper in `src/test-utils/integ-helpers.ts`: `getAuthenticatedHttpClient()` — signs up, gets ID token, returns HttpClient with bearer auth against `https://e1.agentbase.me`
- [ ] Create `src/client/svc.integ.test.ts`
- [ ] Test `AuthSvc.login()` with real Firebase ID token
- [ ] Test `AuthSvc.getSession()` returns authenticated session after login
- [ ] Test `ProfilesSvc.getPublic()` for the test user (or handle 404 gracefully)
- [ ] Test `SearchSvc.search()` returns a response structure (even if empty results)
- [ ] Test `TokensSvc.create()` → `list()` → `revoke()` lifecycle
- [ ] Test `SettingsSvc.get()` returns settings structure
- [ ] Test `NotificationsSvc.list()` returns response (even if empty)
- [ ] Clean up: delete test user, revoke tokens

## Verification

- [ ] All tests pass against live e1 API
- [ ] Tests skip when credentials missing
- [ ] SdkResponse objects have correct structure (data, error, status)
- [ ] No persistent test data left on e1
