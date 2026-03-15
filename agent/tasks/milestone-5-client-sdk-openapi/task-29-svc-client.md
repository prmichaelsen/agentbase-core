# Task 29: SvcClient Resource Classes (1:1 REST Mirror)

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 3
**Depends on**: T28

---

## Objective

Create resource-specific service classes that provide a 1:1 mapping to all REST API endpoints, using generated types for full type safety. These form the `SvcClient` — the low-level, complete API surface.

---

## Context

The SvcClient layer sits between the HttpClient (transport) and the AppClient (workflows). Each service class owns a group of related endpoints and provides typed methods that directly mirror the REST API. Developers who need fine-grained control use SvcClient directly; those who want convenience use AppClient.

---

## Steps

### 1. Create src/client/svc/ directory structure

```bash
mkdir -p src/client/svc
```

### 2. Create base service class

Create `src/client/svc/base-service.ts` with a `BaseService` class that:
- Accepts `HttpClient` in constructor
- Provides protected helper methods for common patterns
- Handles path parameter interpolation

### 3. Create resource service classes

Create one file per resource domain in `src/client/svc/`:

- `auth.svc.ts` — `AuthSvc`: login, logout, session, connect/disconnect providers
- `memories.svc.ts` — `MemoriesSvc`: feed, search, get, similar, batch, comments, rate, publish, retract, delete, restore, organize, confirm, memory-conversations
- `conversations.svc.ts` — `ConversationsSvc`: list, create, get, messages, bulk-import, tool-calls
- `profiles.svc.ts` — `ProfilesSvc`: get, feed, memories, count, boards, widgets, username-check, bio-conversation, all
- `groups.svc.ts` — `GroupsSvc`: CRUD, batch, members, ban/unban, mute/unmute, links, redeem
- `dms.svc.ts` — `DmsSvc`: list, create, get, links, redeem
- `search.svc.ts` — `SearchSvc`: users, conversations, groups, messages, relationships, settings, feedback
- `notifications.svc.ts` — `NotificationsSvc`: list, bulk, get, delete, preferences, fcm-token, unread-count, test
- `relationships.svc.ts` — `RelationshipsSvc`: CRUD, reorder, organize
- `boards.svc.ts` — `BoardsSvc`: CRUD, widgets CRUD, reorder
- `spaces.svc.ts` — `SpacesSvc`: feed, metadata, preferences, sources
- `tokens.svc.ts` — `TokensSvc`: CRUD for API tokens
- `integrations.svc.ts` — `IntegrationsSvc`: list, disconnect, credentials
- `storage.svc.ts` — `StorageSvc`: upload, crop
- `stripe.svc.ts` — `StripeSvc`: checkout, portal, sync
- `admin.svc.ts` — `AdminSvc`: seed, analytics, reports, usage, users-search
- `scheduled-messages.svc.ts` — `ScheduledMessagesSvc`: CRUD
- `jobs.svc.ts` — `JobsSvc`: status, cancel, ingest-status

### 4. Type each method with generated types

Every method should:
- Accept typed request parameters (from `types.generated.ts`)
- Return `Promise<SdkResponse<T>>` with the correct response type
- Use proper HTTP method via `HttpClient`

Example pattern:
```typescript
async getMemory(id: string): Promise<SdkResponse<paths['/api/memories/{id}']['get']['responses']['200']['content']['application/json']>> {
  return this.http.get(`/api/memories/${id}`);
}
```

### 5. Create SvcClient facade

Create `src/client/svc/svc-client.ts` that composes all service classes:
```typescript
class SvcClient {
  readonly auth: AuthSvc;
  readonly memories: MemoriesSvc;
  readonly conversations: ConversationsSvc;
  // ... all services
  constructor(http: HttpClient) { ... }
}
```

### 6. Create barrel export

Create `src/client/svc/index.ts` exporting `SvcClient` and all service classes.

---

## Verification

- [ ] All 18 service classes exist and compile
- [ ] Each service method maps 1:1 to an API endpoint
- [ ] All methods use generated types for request/response
- [ ] All methods return `Promise<SdkResponse<T>>`
- [ ] `SvcClient` facade class composes all services
- [ ] `src/client/svc/index.ts` barrel exports everything
- [ ] No `any` types used — full type safety throughout
- [ ] Method names follow consistent conventions (get, list, create, update, delete)

---

**Next Task**: [task-30-app-client.md](./task-30-app-client.md)
