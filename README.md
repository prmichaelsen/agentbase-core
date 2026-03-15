# @prmichaelsen/agentbase-core

Shared service infrastructure for agentbase projects — BaseService, auth, Firebase wrappers, logging, typed errors, Result type, client SDK, and common utilities.

## Installation

```bash
npm install @prmichaelsen/agentbase-core
```

### Peer Dependencies

All peer dependencies are **optional** — install only what you use:

| Package | When needed |
|---------|-------------|
| `@prmichaelsen/firebase-admin-sdk-v8` | Server-side auth (`getServerSession`, `requireAuth`, `createSessionCookie`) |
| `firebase` | Client-side auth (`signIn`, `signUp`, `initializeFirebase`) |
| `jsonwebtoken` | JWT handling (if used directly) |

## Export Entry Points

```ts
import { ... } from '@prmichaelsen/agentbase-core'          // everything
import { ... } from '@prmichaelsen/agentbase-core/services'  // BaseService, ConfirmationTokenService
import { ... } from '@prmichaelsen/agentbase-core/lib'       // logger, firebase, utilities
import { ... } from '@prmichaelsen/agentbase-core/lib/auth'  // server auth guards
import { ... } from '@prmichaelsen/agentbase-core/types'     // AuthUser, Result, branded types
import { ... } from '@prmichaelsen/agentbase-core/client'    // HTTP client, SvcClient, AppClient, OAuth
import { ... } from '@prmichaelsen/agentbase-core/config'    // loadConfig, validateConfig
```

## Services

### BaseService

Abstract base class with config injection, structured logging, lifecycle hooks, and state tracking.

```ts
import { BaseService, ServiceState, type Logger } from '@prmichaelsen/agentbase-core/services'

class UserService extends BaseService<{ dbUrl: string }> {
  constructor(config: { dbUrl: string }, logger: Logger) {
    super(config, logger)
  }

  async initialize() {
    await super.initialize() // sets state to Initialized
    this.logger.info('Connected', { url: this.config.dbUrl })
  }

  async findUser(id: string) {
    this.ensureInitialized() // throws if not initialized
    // ...
  }
}

const svc = new UserService({ dbUrl: '...' }, logger)
svc.getState() // ServiceState.Uninitialized
await svc.initialize()
svc.getState() // ServiceState.Initialized
```

### ConfirmationTokenService

In-memory token store for two-step confirmation flows. Tokens are single-use, user-scoped, and expire after TTL.

```ts
import { ConfirmationTokenService } from '@prmichaelsen/agentbase-core/services'

const confirmations = new ConfirmationTokenService(5 * 60 * 1000) // 5 min TTL

// Step 1: Generate token
const token = confirmations.generateToken({
  type: 'delete-account',
  userId: 'user-123',
  params: { accountId: 'abc' },
  summary: 'Delete account abc',
  createdAt: Date.now(),
})

// Step 2: Consume token (single-use)
const action = confirmations.consumeToken(token, 'user-123')
if (action) { /* execute */ }
```

## Error Types

Typed error hierarchy with discriminated `kind` field and HTTP status mapping.

```ts
import {
  UnauthorizedError, ForbiddenError, ValidationError, NotFoundError,
  ConflictError, RateLimitError, ExternalError, InternalError,
  isAppError, errorToStatusCode,
} from '@prmichaelsen/agentbase-core'

// Throw typed errors
throw new ValidationError('Email is required', { field: 'email' })
throw new NotFoundError('User not found')

// Type guard
try {
  await doSomething()
} catch (err) {
  if (isAppError(err)) {
    console.log(err.kind)       // 'VALIDATION' | 'NOT_FOUND' | ...
    console.log(err.statusCode) // 400, 404, ...
    console.log(err.context)    // { field: 'email' }
  }
}

// Map to HTTP status
const status = errorToStatusCode(err) // 400 for ValidationError, 500 for unknown
```

| Error | Kind | Status |
|-------|------|--------|
| `ValidationError` | `VALIDATION` | 400 |
| `UnauthorizedError` | `UNAUTHORIZED` | 401 |
| `ForbiddenError` | `FORBIDDEN` | 403 |
| `NotFoundError` | `NOT_FOUND` | 404 |
| `ConflictError` | `CONFLICT` | 409 |
| `RateLimitError` | `RATE_LIMIT` | 429 |
| `ExternalError` | `EXTERNAL` | 502 |
| `InternalError` | `INTERNAL` | 500 |

## Result Type

Discriminated `Result<T, E>` for operations where failure is expected.

```ts
import { ok, err, isOk, isErr, mapOk, andThen, getOrElse, tryCatchAsync } from '@prmichaelsen/agentbase-core'
import type { Result } from '@prmichaelsen/agentbase-core'

// Create results
const success: Result<number> = ok(42)
const failure: Result<number, string> = err('not found')

// Type guards
if (isOk(success)) console.log(success.value)  // 42
if (isErr(failure)) console.log(failure.error)  // 'not found'

// Combinators
const doubled = mapOk(ok(5), x => x * 2)              // Ok(10)
const chained = andThen(ok(5), x => x > 0 ? ok(x) : err('negative'))
const value = getOrElse(err('fail'), 0)                // 0

// Wrap async functions
const result = await tryCatchAsync(
  () => fetchUser(id),
  (e) => new NotFoundError('User not found')
)
```

## Auth

### Server-Side (requires `@prmichaelsen/firebase-admin-sdk-v8`)

```ts
import {
  getServerSession, requireAuth, requireAdmin, isAdmin,
  handleAuthError,
} from '@prmichaelsen/agentbase-core/lib/auth'

// Get session from request cookies
const session = await getServerSession(request)

// Guards throw typed errors — use try-catch
try {
  await requireAuth(request)        // throws UnauthorizedError
  await requireAdmin(request, 'admin@example.com') // throws Unauthorized or Forbidden
} catch (error) {
  return handleAuthError(error)     // converts to Response(401/403/500)
}

// Boolean check (does not throw)
const admin = await isAdmin(request, 'admin@example.com')
```

### Client-Side (requires `firebase`)

```ts
import {
  initializeFirebase, signIn, signUp, signInAnonymously,
  upgradeAnonymousAccount, logout, onAuthChange, getIdToken,
} from '@prmichaelsen/agentbase-core/lib'

initializeFirebase({ apiKey: '...', authDomain: '...', projectId: '...' })

await signIn('user@example.com', 'password')
await signUp('user@example.com', 'password')
await signInAnonymously()
await upgradeAnonymousAccount('user@example.com', 'password')
await logout()

const unsubscribe = onAuthChange((user) => { /* ... */ })
const token = await getIdToken()
```

### Helpers

```ts
import { isRealUser, isRealUserServer } from '@prmichaelsen/agentbase-core/lib/auth'

if (isRealUser(user)) { /* non-anonymous */ }
if (isRealUserServer(authUser)) { /* non-anonymous, typed for AuthUser */ }
```

## Client SDK

Full REST client for agentbase.me with 17 service classes, compound workflows, and OAuth support.

### Setup

```ts
import { HttpClient, AuthSvc, MemoriesSvc, OAuthClient } from '@prmichaelsen/agentbase-core/client'

// With API key
const http = new HttpClient({
  baseUrl: 'https://agentbase.me',
  auth: { type: 'apiKey', key: 'your-api-key' },
})

// With OAuth bearer token
const http = new HttpClient({
  baseUrl: 'https://agentbase.me',
  auth: { type: 'bearer', token: () => oauthClient.getValidToken() },
})

// With session cookie (browser)
const http = new HttpClient({
  baseUrl: 'https://agentbase.me',
  auth: { type: 'cookie' },
})
```

### SvcClient (1:1 REST mirror)

```ts
const memories = new MemoriesSvc(http)

// All methods return SdkResponse<T> — never throws
const result = await memories.search({ query: 'vacation photos', mode: 'semantic' })
if (result.error) {
  console.error(result.error.message)
} else {
  console.log(result.data) // { data: Memory[], total: number }
}

// Or use throwOnError() for cleaner async/await
const { data } = await memories.feed({ limit: 10 }).then(r => r.throwOnError())
```

Available services: `AuthSvc`, `OAuthSvc`, `MemoriesSvc`, `ConversationsSvc`, `ProfilesSvc`, `GroupsSvc`, `DmsSvc`, `SearchSvc`, `NotificationsSvc`, `RelationshipsSvc`, `BoardsSvc`, `TokensSvc`, `IntegrationsSvc`, `SettingsSvc`, `PaymentsSvc`, `UsageSvc`, `JobsSvc`

### AppClient (compound workflows)

```ts
import { AppClient } from '@prmichaelsen/agentbase-core/client'

const app = new AppClient({ auth, memories, conversations, profiles, groups, dms, search, notifications })

await app.loginAndGetSession(idToken)
await app.searchAndFetchMemories('vacation', 5)
await app.createGroupAndInvite('Book Club', 'Monthly reads', ['user-1', 'user-2'])
await app.getFullProfile('user-123') // profile + memory count
await app.startDm('user-456')       // find existing or create new
```

### OAuth Integration

```ts
import {
  OAuthClient, generateCodeVerifier, generateCodeChallenge,
  buildAuthorizationUrl,
} from '@prmichaelsen/agentbase-core/client'

// 1. Generate PKCE params
const verifier = generateCodeVerifier()
const challenge = await generateCodeChallenge(verifier)

// 2. Build authorization URL
const url = buildAuthorizationUrl('https://agentbase.me', {
  clientId: 'your-client-id',
  redirectUri: 'http://localhost:3000/callback',
  scope: 'read write',
  codeChallenge: challenge,
})

// 3. After redirect, exchange code for tokens
const oauth = new OAuthClient(http, { clientId: 'your-client-id' })
await oauth.exchangeCode(code, redirectUri, verifier)

// 4. Get valid token (auto-refreshes if expired)
const token = await oauth.getValidToken()

// API token shortcut
await oauth.exchangeApiToken('your-api-token')
```

## Configuration

Centralized environment variable loading and validation.

```ts
import { loadConfig, validateConfig } from '@prmichaelsen/agentbase-core/config'

const config = loadConfig() // reads from process.env
validateConfig(config, { requireFirebaseAdmin: true }) // throws ValidationError if missing

// Or pass custom env
const config = loadConfig({ FIREBASE_PROJECT_ID: 'my-project', ... })
```

## Logger

Structured logger with automatic sensitive data redaction.

```ts
import { createLogger, authLogger, apiLogger } from '@prmichaelsen/agentbase-core/lib'

const logger = createLogger('MyService')
logger.info('Request', { userId: 'abc', apiKey: 'secret' })
// Output: [MyService] Request { userId: 'abc', apiKey: '[REDACTED]' }
```

### Sanitization Utilities

```ts
import { sanitizeToken, sanitizeEmail, sanitizeUserId, sanitizeObject } from '@prmichaelsen/agentbase-core/lib'

sanitizeToken('abc123...')    // "a1b2c3d4..."
sanitizeEmail('john@x.com')  // "jo***@x.com"
sanitizeObject({ password: 'secret', name: 'ok' })  // { password: '[REDACTED]', name: 'ok' }
```

## Types

```ts
import type { AuthUser, ServerSession, Result, UserId, EmailAddress } from '@prmichaelsen/agentbase-core/types'
import { toUserId, toEmailAddress, toTimestamp } from '@prmichaelsen/agentbase-core/types'

// Branded primitives prevent mixing IDs
const uid: UserId = toUserId('firebase-uid')
const email: EmailAddress = toEmailAddress('user@example.com')
```

## License

MIT
