# Task 12: Create error type hierarchy
**Milestone**: M2 — Critical Pattern Compliance
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: None

## Objective
Establish a structured error type hierarchy so that all modules throw well-typed, discriminated errors instead of raw strings or generic Error objects. This gives consumers a reliable way to match on error kind and derive HTTP status codes.

## Context
The codebase currently throws generic errors or returns raw Response objects for failure cases. A typed error hierarchy with a `kind` discriminant enables pattern-matching in error handlers and guarantees correct HTTP status mapping. This is foundational for Tasks 13, 14, and 15.

## Steps
1. Create `src/errors/base.error.ts`
   - Define `AppError` base class extending `Error`
   - Properties: `kind` (string literal discriminant), `message`, `statusCode` (number), `context` (optional `Record<string, unknown>`)
   - Set `name` to the class name for stack traces
2. Create `src/errors/app-errors.ts`
   - Subclasses of `AppError`:
     - `ValidationError` (kind: `"VALIDATION"`, statusCode: 400)
     - `NotFoundError` (kind: `"NOT_FOUND"`, statusCode: 404)
     - `UnauthorizedError` (kind: `"UNAUTHORIZED"`, statusCode: 401)
     - `ForbiddenError` (kind: `"FORBIDDEN"`, statusCode: 403)
     - `ConflictError` (kind: `"CONFLICT"`, statusCode: 409)
     - `RateLimitError` (kind: `"RATE_LIMIT"`, statusCode: 429)
     - `ExternalError` (kind: `"EXTERNAL"`, statusCode: 502)
     - `InternalError` (kind: `"INTERNAL"`, statusCode: 500)
3. Create `src/errors/index.ts`
   - Barrel export all error classes
   - Export `isAppError(err: unknown): err is AppError` type guard
   - Export `errorToStatusCode(err: unknown): number` utility (returns the error's statusCode if AppError, otherwise 500)
4. Export `src/errors/index.ts` from the package root (`src/index.ts`)

## Verification
- `npm run build` succeeds with no type errors
- `isAppError(new ValidationError("bad input"))` returns `true`
- `isAppError(new Error("generic"))` returns `false`
- Each subclass maps to its expected HTTP status code
- Barrel exports are accessible from the package root
