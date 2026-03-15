# Task 20: Replace direct console.log with structured logger
**Milestone**: M4 — Medium Pattern Compliance
**Status**: not_started
**Estimated Hours**: 0.5
**Depends on**: None

## Objective
Eliminate direct console.log/console.error usage in src/lib/ and replace with structured logger calls for consistent, filterable logging.

## Steps
1. In `src/lib/auth/session.ts` line 101: replace `console.log` with `authLogger.info`.
2. In `src/lib/auth/session.ts` line 117: replace `console.error` with `authLogger.error`.
3. In `src/lib/rate-limiter.ts` line 40: replace `console.error` with `apiLogger.error` or accept a logger parameter.
4. Search `src/lib/` for any remaining direct `console.log`, `console.error`, `console.warn` usage and replace accordingly.
5. Ensure logger imports are present in each modified file.

## Verification
- `npx tsc --noEmit` passes.
- `grep -r "console\." src/lib/` returns no matches (excluding test files).
- Existing tests still pass with `npm run test`.
