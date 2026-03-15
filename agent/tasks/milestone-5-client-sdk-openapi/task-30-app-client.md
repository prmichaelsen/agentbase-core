# Task 30: AppClient Compound Workflows

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: T29

---

## Objective

Create the `AppClient` layer that wraps `SvcClient` to provide convenient, multi-step workflow methods for common developer use cases.

---

## Context

While `SvcClient` provides 1:1 endpoint access, real-world usage often involves chaining multiple API calls. `AppClient` encapsulates these patterns so developers don't have to manually orchestrate them. For example, logging in and fetching the session, or creating a group and inviting members, become single method calls with proper error handling across steps.

---

## Steps

### 1. Create src/client/app/ directory

```bash
mkdir -p src/client/app
```

### 2. Create AppClient class

Create `src/client/app/app-client.ts`:
- Constructor accepts `SvcClient` (or `HttpClient` to create one internally)
- Exposes `svc` property for direct access to low-level methods when needed

### 3. Implement loginAndGetSession()

- Call `svc.auth.login(credentials)`
- If successful, call `svc.auth.getSession()`
- Return combined result with user session data

### 4. Implement createGroupAndInvite()

- Call `svc.groups.create(groupData)`
- If members provided, call `svc.groups.addMembers(groupId, members)`
- Optionally create an invite link via `svc.groups.createLink(groupId)`
- Return group with member list and optional invite link

### 5. Implement searchAndFetchMemories()

- Call `svc.memories.search(query)`
- Fetch full details for top N results via `svc.memories.get(id)` (parallel)
- Optionally fetch similar memories for the top result
- Return enriched search results

### 6. Implement oauthAuthorizeAndExchange()

- Generate PKCE challenge (using oauth helpers from T31)
- Call `svc.auth.oauthAuthorize(request)` with PKCE params
- Exchange authorization code for tokens via `svc.auth.oauthToken()`
- Return tokens

### 7. Implement additional workflows

Consider adding:
- `createConversationWithMessages()` — create conversation and add initial messages
- `getProfileWithMemories()` — fetch profile and recent memories in parallel
- `connectProviderAndVerify()` — connect external provider and verify connection
- `bulkImportAndTrack()` — start bulk import and poll job status

### 8. Error handling across steps

Each workflow should:
- Short-circuit on first error (return early with error)
- Include which step failed in the error context
- Clean up partial state where possible (e.g., delete group if invite fails)

### 9. Create barrel export

Create `src/client/app/index.ts` exporting `AppClient`.

---

## Verification

- [ ] `src/client/app/app-client.ts` exists and compiles
- [ ] `loginAndGetSession()` chains login + session correctly
- [ ] `createGroupAndInvite()` handles group creation + member addition
- [ ] `searchAndFetchMemories()` enriches search results with full details
- [ ] `oauthAuthorizeAndExchange()` handles full PKCE flow
- [ ] Error handling short-circuits on failures
- [ ] `AppClient` exposes `svc` for direct low-level access
- [ ] `src/client/app/index.ts` barrel export exists
- [ ] All methods are fully typed with no `any`

---

**Next Task**: [task-31-oauth-helpers.md](./task-31-oauth-helpers.md)
