# Task 17: Add ServiceState enum and state tracking to BaseService
**Milestone**: M3 — High Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1
**Depends on**: None

## Objective
Introduce a ServiceState enum and lifecycle state tracking to BaseService so that services can guard against being called before initialization or after shutdown.

## Steps
1. Add a `ServiceState` enum with values `uninitialized`, `initialized`, `shutdown` to `src/services/base.service.ts`.
2. Add a private `_state` field to BaseService, defaulting to `uninitialized`.
3. Update `initialize()` to transition state to `initialized`.
4. Update `shutdown()` to transition state to `shutdown`.
5. Add a `protected ensureInitialized()` method that throws an error if the current state is not `initialized`.
6. Add a `public getState(): ServiceState` method.
7. Export `ServiceState` from `src/services/index.ts` and the package root.

## Verification
- `npx tsc --noEmit` passes.
- `getState()` returns the correct state after construction, initialization, and shutdown.
- `ensureInitialized()` throws when called on an uninitialized or shut-down service.
