# Task 10: npm Publish Setup & Verification

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: Task 1

## Objective

Verify package.json is correctly configured for publishing, run a dry-run publish, and confirm the package is consumable.

## Steps

1. Verify package.json fields:
   - `name`: `@prmichaelsen/agentbase-core`
   - `version`: semantic version
   - `main`, `types`, `exports` all point to `dist/`
   - `files` includes only `dist`
   - `peerDependencies` and `peerDependenciesMeta` correct
2. Run `npm run build`
3. Run `npm pack --dry-run` — verify only dist/ files included
4. Verify no secrets, test files, or source maps in package
5. Run `npm publish --dry-run` to confirm publish would succeed
6. (Optional) Create a temporary consumer project to verify imports work:
   - `import { BaseService } from '@prmichaelsen/agentbase-core'`
   - `import { createLogger } from '@prmichaelsen/agentbase-core/lib'`
   - `import { requireAuth } from '@prmichaelsen/agentbase-core/lib/auth'`
   - `import type { AuthUser } from '@prmichaelsen/agentbase-core/types'`

## Verification

- [ ] `npm pack --dry-run` shows only dist/ files
- [ ] `npm publish --dry-run` succeeds
- [ ] All export entry points resolve correctly
- [ ] No source files or test files in package
