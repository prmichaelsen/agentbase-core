# Task 18: Tests for interfaces and state tracking
**Milestone**: M3 — High Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1
**Depends on**: T16, T17

## Objective
Add unit tests covering ServiceState lifecycle transitions and verify that service interfaces align with their concrete implementations at the type level.

## Steps
1. In `src/services/base.service.test.ts`, add tests for ServiceState transitions:
   - New service is in `uninitialized` state.
   - After `initialize()`, state is `initialized`.
   - After `shutdown()`, state is `shutdown`.
2. Test that `ensureInitialized()` throws when the service is in `uninitialized` state.
3. Test that `ensureInitialized()` throws when the service is in `shutdown` state.
4. Test that `ensureInitialized()` does not throw when the service is in `initialized` state.
5. Add a compile-time type check (e.g., type assignment) confirming concrete implementations satisfy `IConfirmationTokenService` and `IAuthService`.

## Verification
- `npm run test` passes with all new tests green.
- Type-level checks produce no compiler errors.
