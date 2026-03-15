# Task 37: Create agent/index/ Governance File

**Milestone**: M4 — Medium Pattern Compliance
**Status**: not_started
**Estimated Hours**: 0.5
**Depends on**: None

## Objective

Create an agent/index/local.main.yaml with weighted pattern references, following remember-core's governance pattern. This guides AI agents to read the right files at the right time.

## Reference

Port pattern from `/home/prmichaelsen/.acp/projects/remember-core/agent/index/local.main.yaml` which has weight-based prioritization and applies rules.

## Steps

1. Create `agent/index/local.main.yaml` with entries for:
   - `agent/reports/audit-2-pattern-compliance.md` (weight: 0.9, applies: [acp.proceed])
   - Key core-sdk patterns by relevance:
     - `core-sdk.service-base.md` (weight: 0.8, applies: [acp.proceed, acp.task-create])
     - `core-sdk.types-error.md` (weight: 0.7, applies: [acp.proceed])
     - `core-sdk.testing-unit.md` (weight: 0.7, applies: [acp.proceed])
     - `core-sdk.client-svc.md` (weight: 0.6, applies: [acp.proceed])
   - Design docs if any exist

## Verification

- [ ] `agent/index/local.main.yaml` is valid YAML
- [ ] Entries have name, path, weight, type, applies fields
- [ ] Weights reflect actual importance (0.9 = critical, 0.5 = reference)
- [ ] @acp.proceed reads index and loads relevant files
