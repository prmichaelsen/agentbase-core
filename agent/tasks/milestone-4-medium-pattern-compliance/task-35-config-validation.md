# Task 35: Centralized Config Validation

**Milestone**: M4 — Medium Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: None

## Objective

Port the config validation pattern from remember-core. Create typed config interfaces and a validation function that reads env vars centrally, instead of inline `process.env` reads scattered across modules.

## Reference

Port from `/home/prmichaelsen/.acp/projects/remember-core/src/config/environment.ts` which has `loadRememberConfig()`, `validateRememberConfig()`, and typed interfaces per provider.

## Steps

1. Create `src/config/index.ts`:
   - Define `FirebaseAdminConfig` interface (serviceAccountKey, projectId)
   - Define `FirebaseClientConfig` interface (apiKey, authDomain, projectId, etc.)
   - Define `AuthConfig` interface (ownerEmails)
   - Define `AgentbaseConfig` combining all sub-configs
   - `loadConfig(env?: Record<string, string | undefined>)` — reads from `process.env` or passed env object
   - `validateConfig(config)` — throws `ValidationError` if required vars missing
2. Update `src/lib/firebase-admin.ts` to accept config param instead of reading env directly
3. Update `src/lib/auth/guards.ts` to accept ownerEmails from config instead of `process.env`
4. Export from package root and add `./config` entry point
5. Add tests for config loading and validation

## Verification

- [ ] `loadConfig()` reads all expected env vars
- [ ] `validateConfig()` throws for missing required vars
- [ ] Firebase admin init works with config object
- [ ] Backwards compatible (env vars still work if no config passed)
- [ ] `npm run build` succeeds
