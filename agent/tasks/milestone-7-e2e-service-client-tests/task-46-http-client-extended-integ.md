# Task 46: Extended HttpClient + Error Tests

**Milestone**: M7 — E2E Service Client Tests
**Status**: not_started
**Estimated Hours**: 1
**Dependencies**: M6 (integ infrastructure)

---

## Objective

Extend HttpClient integration tests to cover POST/PATCH/DELETE methods, all auth strategies, and error response handling.

## Steps

- [ ] Extend `src/client/client.integ.test.ts` or create separate file
- [ ] Test POST request (e.g., `AuthSvc.login` with invalid body → error response)
- [ ] Test bearer token auth with valid Firebase ID token
- [ ] Test SdkResponse error fields for 401 (UnauthorizedError), other status codes
- [ ] Test request timeout behavior (set very short timeout, expect error)
- [ ] Test concurrent requests don't interfere

## Verification

- [ ] All tests pass against live e1 API
- [ ] Tests skip when credentials missing
- [ ] Error types match expected AppError subclasses
- [ ] Timeout produces ExternalError, not hang
