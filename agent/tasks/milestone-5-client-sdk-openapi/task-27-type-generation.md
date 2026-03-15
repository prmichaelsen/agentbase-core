# Task 27: Type Generation Setup (openapi-typescript)

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 1
**Depends on**: T23, T24, T25, T26

---

## Objective

Set up automated TypeScript type generation from the OpenAPI spec using `openapi-typescript`, producing a `types.generated.ts` file that the client SDK will consume.

---

## Context

Rather than manually maintaining TypeScript types that mirror the API, we generate them directly from the OpenAPI spec. This ensures the SDK types are always in sync with the API definition. The `openapi-typescript` package produces clean, well-typed output from OpenAPI 3.1 specs.

---

## Steps

### 1. Install openapi-typescript

```bash
npm install --save-dev openapi-typescript
```

### 2. Add type generation script to package.json

Add a `generate:types` script:
```json
{
  "scripts": {
    "generate:types": "openapi-typescript openapi.yaml -o src/client/types.generated.ts"
  }
}
```

### 3. Create src/client/ directory

```bash
mkdir -p src/client
```

### 4. Run type generation

```bash
npm run generate:types
```

### 5. Verify generated types

- Open `src/client/types.generated.ts` and inspect the output
- Verify that all paths from the spec are represented
- Verify that all component schemas are generated as TypeScript types
- Confirm request body types, response types, and parameter types are correct
- Check that security scheme types are present

### 6. Add types.generated.ts to .gitignore (optional)

Decide whether to commit or regenerate on build. If regenerating:
- Add `src/client/types.generated.ts` to `.gitignore`
- Add `generate:types` as a prebuild step

---

## Verification

- [ ] `openapi-typescript` is listed in devDependencies
- [ ] `generate:types` script exists in package.json
- [ ] `src/client/types.generated.ts` is generated without errors
- [ ] Generated types include all API paths
- [ ] Generated types include all component schemas
- [ ] Types are importable from other TypeScript files
- [ ] No TypeScript compilation errors from the generated file

---

**Next Task**: [task-28-http-transport.md](./task-28-http-transport.md)
