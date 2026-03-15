# Task 31: OAuth Helper Utilities

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: T28

---

## Objective

Create OAuth utility functions for PKCE flow, token management, and authorization URL construction — enabling SDK consumers to easily implement OAuth authentication.

---

## Context

The API supports OAuth 2.0 with PKCE for secure authorization. SDK consumers need helpers to generate PKCE parameters, construct authorization URLs, exchange codes for tokens, and manage token lifecycle (refresh, storage). These utilities work standalone and are also used internally by `AppClient`.

---

## Steps

### 1. Create src/client/oauth.ts

### 2. Implement PKCE helpers

```typescript
function generateCodeVerifier(length?: number): string
// Generate cryptographically random code verifier (43-128 chars, RFC 7636)

function generateCodeChallenge(verifier: string): Promise<string>
// SHA-256 hash, base64url-encoded (S256 method)

function generatePKCEPair(): Promise<{ verifier: string; challenge: string }>
// Convenience: generate both in one call
```

Use `crypto.subtle` (Web Crypto API) for cross-platform compatibility (Node 18+, browsers, edge runtimes).

### 3. Implement authorization URL builder

```typescript
function buildAuthorizationUrl(params: {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  scope?: string;
  state?: string;
}): string
```

### 4. Implement token exchange helper

```typescript
async function exchangeAuthorizationCode(params: {
  httpClient: HttpClient;
  code: string;
  codeVerifier: string;
  redirectUri: string;
  clientId: string;
}): Promise<SdkResponse<OAuthTokenResponse>>
// Uses authorization_code grant type
```

### 5. Implement token refresh helper

```typescript
async function refreshAccessToken(params: {
  httpClient: HttpClient;
  refreshToken: string;
  clientId: string;
}): Promise<SdkResponse<OAuthTokenResponse>>
// Uses refresh_token grant type
```

### 6. Implement API token auth helper

```typescript
async function exchangeApiToken(params: {
  httpClient: HttpClient;
  apiToken: string;
}): Promise<SdkResponse<OAuthTokenResponse>>
// Uses api_token grant type
```

### 7. Implement TokenStorage interface

```typescript
interface TokenStorage {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  setTokens(access: string, refresh: string, expiresIn: number): Promise<void>;
  clearTokens(): Promise<void>;
}

class InMemoryTokenStorage implements TokenStorage { ... }
// Default implementation, stores in memory
// Extensible: consumers can implement for localStorage, secure storage, etc.
```

### 8. Implement auto-refresh auth strategy

Create an `OAuthAuthStrategy` that:
- Uses `TokenStorage` to manage tokens
- Automatically refreshes expired tokens before requests
- Calls `onTokenRefresh` callback when tokens are updated
- Can be passed as `AuthStrategy` to `HttpClient`

---

## Verification

- [ ] `src/client/oauth.ts` exists and compiles
- [ ] `generateCodeVerifier()` produces valid RFC 7636 verifiers
- [ ] `generateCodeChallenge()` produces correct S256 challenges
- [ ] `buildAuthorizationUrl()` constructs valid URLs with all parameters
- [ ] `exchangeAuthorizationCode()` makes correct POST to token endpoint
- [ ] `refreshAccessToken()` makes correct POST with refresh_token grant
- [ ] `exchangeApiToken()` makes correct POST with api_token grant
- [ ] `InMemoryTokenStorage` stores and retrieves tokens correctly
- [ ] `OAuthAuthStrategy` auto-refreshes expired tokens
- [ ] All functions use Web Crypto API (no Node-specific crypto)
- [ ] All functions are exported

---

**Next Task**: [task-32-client-sdk-tests.md](./task-32-client-sdk-tests.md)
