# Task 36: Add throwOnError() to SdkResponse

**Milestone**: M4 — Medium Pattern Compliance
**Status**: not_started
**Estimated Hours**: 0.5
**Depends on**: None

## Objective

Port the throwOnError() chain from remember-core's SdkResponse. This lets consumers opt into throwing behavior for cleaner async/await code.

## Reference

Port from `/home/prmichaelsen/.acp/projects/remember-core/src/clients/response.ts` which has a Supabase-style response with chainable `throwOnError()`.

## Steps

1. Update `src/client/http-transport.ts`:
   - Change `SdkResponse<T>` from plain object to class or add `throwOnError()` method
   - `throwOnError()` returns `{ data: T; status: number }` or throws the `AppError`
2. Update tests for throwOnError behavior
3. Keep existing destructuring `{ data, error, status }` working (backwards compatible)

## Verification

- [ ] `const { data } = await client.get('/foo').then(r => r.throwOnError ? r.throwOnError() : r)` pattern works
- [ ] throwOnError throws the actual AppError instance
- [ ] Non-throwing usage unchanged
- [ ] Tests pass
