# Task 28: HTTP Transport Layer with Auth

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: T27, M2 (error types)

---

## Objective

Create the HTTP transport layer (`HttpClient`) that handles all network communication for the client SDK, including authentication, error normalization, retries, and request/response interceptors.

---

## Context

The HTTP transport is the lowest layer of the client SDK. Every API call flows through it. It must support three auth strategies (Firebase token, OAuth bearer, API key), normalize errors into the typed error system from Milestone 2, and provide retry logic for transient failures. The `SdkResponse<T>` type provides a consistent envelope for all API responses.

---

## Steps

### 1. Create src/client/http-transport.ts

Define the core `HttpClient` class with:
- Constructor accepting `HttpClientConfig`:
  - `baseUrl: string`
  - `headers?: Record<string, string>`
  - `timeout?: number` (default 30s)
  - `auth?: AuthStrategy`

### 2. Define AuthStrategy types

```typescript
type AuthStrategy =
  | { type: 'firebase'; getToken: () => Promise<string> }
  | { type: 'oauth'; getToken: () => Promise<string>; onTokenRefresh?: (token: string) => void }
  | { type: 'api-key'; apiKey: string };
```

### 3. Define SdkResponse<T> type

```typescript
type SdkResponse<T> = {
  data: T | null;
  error: AppError | null;
  status: number;
};
```

### 4. Implement request/response interceptors

- `RequestInterceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>`
- `ResponseInterceptor: (response: SdkResponse<unknown>) => SdkResponse<unknown>`
- Methods: `addRequestInterceptor()`, `addResponseInterceptor()`

### 5. Implement HTTP methods

- `get<T>(path, params?) -> Promise<SdkResponse<T>>`
- `post<T>(path, body?, params?) -> Promise<SdkResponse<T>>`
- `put<T>(path, body?, params?) -> Promise<SdkResponse<T>>`
- `delete<T>(path, params?) -> Promise<SdkResponse<T>>`
- `upload<T>(path, formData) -> Promise<SdkResponse<T>>` (for multipart)

### 6. Implement error normalization

Map network and HTTP errors to typed `AppError` from M2:
- Network errors (fetch failures) -> `NetworkError`
- 4xx responses -> appropriate error type (401 -> `AuthenticationError`, 403 -> `AuthorizationError`, 404 -> `NotFoundError`, 422 -> `ValidationError`, 429 -> `RateLimitError`)
- 5xx responses -> `ServerError`
- Timeout -> `TimeoutError`

### 7. Implement retry with backoff

- Retry on 429, 500, 502, 503, 504 and network errors
- Exponential backoff with jitter
- Configurable max retries (default 3)
- Respect `Retry-After` header when present

### 8. Wire auth into requests

Before each request, inject the appropriate auth header:
- Firebase: `Authorization: Bearer <token>`
- OAuth: `Authorization: Bearer <token>`
- API key: `X-API-Key: <key>`

---

## Verification

- [ ] `src/client/http-transport.ts` exists and compiles
- [ ] `HttpClient` supports all three auth strategies
- [ ] `SdkResponse<T>` type is exported
- [ ] All HTTP methods (GET, POST, PUT, DELETE, upload) are implemented
- [ ] Request/response interceptors work correctly
- [ ] Errors are normalized to typed `AppError` instances
- [ ] Retry logic triggers on transient failures with exponential backoff
- [ ] Auth headers are injected based on configured strategy
- [ ] Timeout is enforced via `AbortController`
- [ ] No external HTTP dependencies (uses native `fetch`)

---

**Next Task**: [task-29-svc-client.md](./task-29-svc-client.md)
