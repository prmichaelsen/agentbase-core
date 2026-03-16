# Milestone 7: E2E Service Client Tests

**ID**: M7
**Status**: not_started
**Started**: null
**Estimated Duration**: 1 week

---

## Goal

Extend integration test coverage to auth guards, authenticated SvcClient endpoints, AppClient compound workflows, and HttpClient edge cases — all against the live e1 environment at https://e1.agentbase.me.

## Deliverables

- Integration tests for auth guards with real session cookies
- Authenticated SvcClient tests covering AuthSvc, ProfilesSvc, TokensSvc, SettingsSvc, SearchSvc
- AppClient workflow tests for loginAndGetSession, getFullProfile, startDm
- Extended HttpClient tests for all HTTP methods, auth strategies, error codes
- Shared authenticated session helper for reuse across test files

## Success Criteria

- All integration tests pass against e1 when `.env.e1.local` is present
- All tests skip gracefully when credentials are absent
- Unit test suite unaffected
- No persistent side effects on e1 data (cleanup after write operations)

## Tasks

- [Task 43: Auth guards integration tests](../tasks/milestone-7-e2e-service-client-tests/task-43-auth-guards-integ.md)
- [Task 44: Authenticated SvcClient tests](../tasks/milestone-7-e2e-service-client-tests/task-44-svc-client-integ.md)
- [Task 45: AppClient workflow tests](../tasks/milestone-7-e2e-service-client-tests/task-45-app-client-integ.md)
- [Task 46: Extended HttpClient + error tests](../tasks/milestone-7-e2e-service-client-tests/task-46-http-client-extended-integ.md)

## Dependencies

- M6 complete (integration test infrastructure, e1 credentials)
- https://e1.agentbase.me live and accessible
