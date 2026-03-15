# Task 19: Implement Result<T,E> type with helpers
**Milestone**: M4 — Medium Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: None

## Objective
Introduce a Result<T,E> discriminated union type so that functions can return typed success/failure values instead of throwing exceptions.

## Steps
1. Create `src/types/result.ts`.
2. Define `Ok<T>` type with `{ ok: true; value: T }`.
3. Define `Err<E>` type with `{ ok: false; error: E }`.
4. Define `Result<T, E> = Ok<T> | Err<E>`.
5. Implement `isOk(result): result is Ok<T>` type guard.
6. Implement `isErr(result): result is Err<E>` type guard.
7. Implement `mapOk(result, fn)` combinator that applies `fn` to the value if Ok.
8. Implement `mapErr(result, fn)` combinator that applies `fn` to the error if Err.
9. Implement `andThen(result, fn)` combinator for chaining Result-returning functions.
10. Implement `tryCatchAsync<T>(fn): Promise<Result<T, Error>>` wrapper that catches thrown errors into Err.
11. Export all from `src/types/index.ts` and the package root.

## Verification
- `npx tsc --noEmit` passes.
- All types and helpers are importable from the package root.
