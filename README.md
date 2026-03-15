# @prmichaelsen/agentbase-core

Shared service infrastructure for agentbase projects — BaseService, auth, Firebase wrappers, logging, and common utilities.

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
import type { ... } from '@prmichaelsen/agentbase-core/types' // AuthUser, ServerSession, AuthResult
```

## Services

### BaseService

Abstract base class for all services. Provides config injection, structured logging, and lifecycle hooks.

```ts
import { BaseService, type Logger } from '@prmichaelsen/agentbase-core/services'

interface MyConfig { dbUrl: string }

class UserService extends BaseService<MyConfig> {
  constructor(config: MyConfig, logger: Logger) {
    super(config, logger)
  }

  async initialize() {
    this.logger.info('Connecting to database', { url: this.config.dbUrl })
  }

  async shutdown() {
    this.logger.info('Closing connections')
  }
}
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
if (action) {
  // Execute the confirmed action
}
```

## Auth

### Server-Side (requires `@prmichaelsen/firebase-admin-sdk-v8`)

```ts
import { getServerSession, requireAuth, requireAdmin, isAdmin } from '@prmichaelsen/agentbase-core/lib/auth'

// Get session from request cookies
const session = await getServerSession(request)

// Guard: returns null if authorized, Response(401) if not
const authError = await requireAuth(request)
if (authError) return authError

// Guard: returns null if admin, Response(401/403) if not
const adminError = await requireAdmin(request, 'admin@example.com,other@example.com')
if (adminError) return adminError

// Check admin status
const admin = await isAdmin(request, 'admin@example.com')
```

### Client-Side (requires `firebase`)

```ts
import {
  initializeFirebase, signIn, signUp, signInAnonymously,
  upgradeAnonymousAccount, logout, onAuthChange, getIdToken,
} from '@prmichaelsen/agentbase-core/lib'

// Initialize once
initializeFirebase({ apiKey: '...', authDomain: '...', projectId: '...' })

// Auth flows
await signIn('user@example.com', 'password')
await signUp('user@example.com', 'password')
await signInAnonymously()
await upgradeAnonymousAccount('user@example.com', 'password')
await logout()

// Listen for auth changes
const unsubscribe = onAuthChange((user) => {
  console.log(user ? `Signed in: ${user.uid}` : 'Signed out')
})

// Get ID token for API calls
const token = await getIdToken()
```

### Helpers

```ts
import { isRealUser, isRealUserServer } from '@prmichaelsen/agentbase-core/lib/auth'

// Client-side: works with any { isAnonymous?: boolean }
if (isRealUser(user)) { /* non-anonymous */ }

// Server-side: typed for AuthUser
if (isRealUserServer(authUser)) { /* non-anonymous */ }
```

## Logger

Structured logger with automatic sensitive data redaction.

```ts
import { createLogger, authLogger, apiLogger, dbLogger, chatLogger } from '@prmichaelsen/agentbase-core/lib'

const logger = createLogger('MyService')
logger.info('Processing request', { userId: 'abc', apiKey: 'secret' })
// Output: [MyService] Processing request { userId: 'abc', apiKey: '[REDACTED]' }

logger.debug('Only in development')  // Only logs when NODE_ENV=development
logger.error('Failed', new Error('boom'))
```

### Sanitization Utilities

```ts
import { sanitizeToken, sanitizeEmail, sanitizeUserId, sanitizeObject } from '@prmichaelsen/agentbase-core/lib'

sanitizeToken('abc123...')     // "a1b2c3d4..."
sanitizeEmail('john@x.com')   // "jo***@x.com"
sanitizeUserId('user-12345')  // "user_user-123"
sanitizeObject({ password: 'secret', name: 'ok' })  // { password: '[REDACTED]', name: 'ok' }
```

## Firebase Admin

```ts
import { initFirebaseAdmin } from '@prmichaelsen/agentbase-core/lib'

// Reads FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY and FIREBASE_PROJECT_ID from env
initFirebaseAdmin()
```

## Rate Limiter

Works with Cloudflare Workers Rate Limiting API.

```ts
import { checkRateLimit, createRateLimitResponse, getRateLimitIdentifier } from '@prmichaelsen/agentbase-core/lib'

const identifier = getRateLimitIdentifier(request, userId)
const result = await checkRateLimit(rateLimiter, identifier, {
  limit: 100,
  period: 60,
  keyPrefix: 'api',
})

if (!result.success) {
  return createRateLimitResponse(result) // 429 with proper headers
}
```

## Utilities

```ts
import { formatExactTime, getRelativeTime, linkifyText, generateUUID } from '@prmichaelsen/agentbase-core/lib'

formatExactTime('2026-03-15T14:30:00Z')  // "2:30 PM Sat 3/15/26"
getRelativeTime('2026-03-15T14:00:00Z')  // "30m ago"
linkifyText('Visit https://example.com')  // "Visit [https://example.com](https://example.com)"
generateUUID()                             // "a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5"
```

## Types

```ts
import type { AuthUser, ServerSession, AuthResult } from '@prmichaelsen/agentbase-core/types'

interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  isAnonymous: boolean
}

interface ServerSession {
  user: AuthUser
}

interface AuthResult {
  success: boolean
  error?: string
}
```

## License

MIT
