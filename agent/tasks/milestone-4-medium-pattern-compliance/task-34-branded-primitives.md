# Task 34: Branded Primitive Factory Types

**Milestone**: M4 — Medium Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: None

## Objective

Port the branded primitive pattern from remember-core. Create factory functions that produce nominally-typed IDs and domain values, preventing accidental mixing of string-typed identifiers.

## Reference

Port from `/home/prmichaelsen/.acp/projects/remember-core/src/types/shared.types.ts` which has `toUserId()`, `toEmailAddress()`, `toTimestamp()` factories creating branded types.

## Steps

1. Create `src/types/branded.ts`:
   - Define `Brand<T, B>` utility type (intersection with `{ readonly __brand: B }`)
   - Define branded types: `UserId`, `SessionId`, `TokenId`, `EmailAddress`, `Timestamp`
   - Create factory functions: `toUserId(s: string)`, `toSessionId(s: string)`, `toEmailAddress(s: string)`, `toTimestamp(n: number)`
2. Update `src/types/index.ts` — export branded types and factories
3. Update `AuthUser.uid` type from `string` to `UserId` (or keep `string` and export branded as opt-in)
4. Export from package root

## Verification

- [ ] `toUserId('abc')` returns `UserId` type (not assignable to `SessionId`)
- [ ] TypeScript prevents passing `UserId` where `SessionId` expected
- [ ] Existing code still compiles (branded types are opt-in)
- [ ] `npm run build` succeeds
