# Task 3: Tests — BaseService + ConfirmationTokenService

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: Task 2

## Objective

Write unit tests for `BaseService` and `ConfirmationTokenService`.

## Context

- `BaseService` is abstract — test via a concrete subclass
- `ConfirmationTokenService` is in-memory, no external deps — straightforward to test
- Token service has TTL expiry, single-use, and userId validation

## Steps

### BaseService tests (`src/services/base.service.test.ts`)
1. Test that concrete subclass can be instantiated with config and logger
2. Test `name` property equals constructor name
3. Test `initialize()` is callable (no-op default)
4. Test `shutdown()` is callable (no-op default)
5. Test overridden `initialize()`/`shutdown()` are called

### ConfirmationTokenService tests (`src/services/confirmation-token.service.test.ts`)
1. Test `generateToken()` returns 32-char hex string
2. Test `consumeToken()` returns action for valid token + matching userId
3. Test `consumeToken()` returns null for invalid token
4. Test `consumeToken()` returns null for wrong userId
5. Test token is single-use (second consume returns null)
6. Test expired tokens return null (mock Date.now or use short TTL)
7. Test cleanup removes expired tokens on next `generateToken()`
8. Test custom TTL constructor parameter

## Verification

- [ ] All BaseService tests pass
- [ ] All ConfirmationTokenService tests pass
- [ ] Edge cases covered (expired, wrong user, reuse)
- [ ] No flaky timing-dependent tests
