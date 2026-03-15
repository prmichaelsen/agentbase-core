# Task 21: Add coverage thresholds to vitest.config.ts
**Milestone**: M4 — Medium Pattern Compliance
**Status**: not_started
**Estimated Hours**: 0.5
**Depends on**: None

## Objective
Enforce minimum code coverage thresholds so that coverage regressions are caught automatically during CI and local test runs.

## Steps
1. Update the `coverage` section in `vitest.config.ts` to include thresholds: branches 80%, functions 80%, lines 80%, statements 80%.
2. Run `npm run test:coverage` to check whether current coverage meets the thresholds.
3. If any metric is below 80%, add tests or adjust thresholds to a realistic baseline that can be ratcheted up over time.

## Verification
- `npm run test:coverage` passes without threshold violations.
- `vitest.config.ts` contains explicit threshold configuration.
