# Task 33: Package Exports + Documentation

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: T29, T30, T31

---

## Objective

Configure the package to expose the client SDK as a dedicated export entry point, update build configuration, and document the SDK usage in the README.

---

## Context

The client SDK should be importable via `@prmichaelsen/agentbase-core/client` as a clean subpath export. This keeps the main package entry point unchanged while making the client SDK easily accessible. Documentation covers installation, auth setup, and usage patterns for both SvcClient and AppClient.

---

## Steps

### 1. Add subpath export to package.json

Add a `"./client"` entry to the `"exports"` field:
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./client": {
      "types": "./dist/client/index.d.ts",
      "import": "./dist/client/index.js"
    }
  }
}
```

### 2. Create src/client/index.ts barrel export

Export all public API from a single entry point:
- `HttpClient`, `HttpClientConfig`, `AuthStrategy`, `SdkResponse`
- `SvcClient` and all service classes
- `AppClient`
- OAuth helpers: `generatePKCEPair`, `buildAuthorizationUrl`, `exchangeAuthorizationCode`, `refreshAccessToken`, `exchangeApiToken`, `TokenStorage`, `InMemoryTokenStorage`, `OAuthAuthStrategy`
- Generated types (re-export from `types.generated.ts`)

### 3. Update tsconfig.json

Ensure `src/client/` is included in the build:
- Verify `include` covers `src/**/*`
- Verify `declaration` and `declarationMap` are enabled
- Verify output structure preserves the `client/` subdirectory in `dist/`

### 4. Update README.md with client SDK section

Add documentation covering:

**Installation**:
```bash
npm install @prmichaelsen/agentbase-core
```

**Auth Setup** — show all 3 strategies:
```typescript
import { HttpClient } from '@prmichaelsen/agentbase-core/client';

// Firebase auth
const client = new HttpClient({ baseUrl: '...', auth: { type: 'firebase', getToken: () => getFirebaseToken() } });

// OAuth
const client = new HttpClient({ baseUrl: '...', auth: { type: 'oauth', getToken: () => getOAuthToken() } });

// API key
const client = new HttpClient({ baseUrl: '...', auth: { type: 'api-key', apiKey: 'your-key' } });
```

**SvcClient Usage** — show direct endpoint access:
```typescript
import { SvcClient } from '@prmichaelsen/agentbase-core/client';

const svc = new SvcClient(httpClient);
const { data, error } = await svc.memories.search({ query: '...' });
```

**AppClient Usage** — show workflow methods:
```typescript
import { AppClient } from '@prmichaelsen/agentbase-core/client';

const app = new AppClient(httpClient);
const session = await app.loginAndGetSession(credentials);
```

**OAuth Flow** — show PKCE flow:
```typescript
import { generatePKCEPair, buildAuthorizationUrl, exchangeAuthorizationCode } from '@prmichaelsen/agentbase-core/client';

const pkce = await generatePKCEPair();
const url = buildAuthorizationUrl({ ... , codeChallenge: pkce.challenge });
// redirect user to url, then on callback:
const tokens = await exchangeAuthorizationCode({ ... , codeVerifier: pkce.verifier });
```

### 5. Verify build

```bash
npm run build
```

- Confirm `dist/client/index.js` and `dist/client/index.d.ts` exist
- Confirm all service class files are in `dist/client/svc/`
- Confirm `dist/client/app/` contains AppClient

### 6. Verify package contents

```bash
npm pack --dry-run
```

- Confirm `dist/client/` files are included in the package
- Confirm `openapi.yaml` is either included or excluded per preference
- Confirm no test files or source maps leak into the package (if undesired)

---

## Verification

- [ ] `"./client"` subpath export is defined in package.json
- [ ] `src/client/index.ts` barrel exports all public API
- [ ] `import { SvcClient } from '@prmichaelsen/agentbase-core/client'` resolves correctly
- [ ] `npm run build` succeeds without errors
- [ ] `dist/client/index.js` and `dist/client/index.d.ts` exist
- [ ] `npm pack --dry-run` includes all client SDK files
- [ ] README.md contains client SDK documentation with all sections
- [ ] Code examples in README are accurate and match actual API
- [ ] No TypeScript compilation errors

---

**Next Task**: None (final task in M5)
