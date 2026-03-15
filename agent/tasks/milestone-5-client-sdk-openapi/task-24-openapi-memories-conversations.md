# Task 24: Author OpenAPI Spec — Memories + Conversations + Profiles

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 3
**Depends on**: T23

---

## Objective

Extend the OpenAPI spec with comprehensive endpoint definitions for memories, conversations, and profiles — the core content resources of the application.

---

## Context

Memories, conversations, and profiles represent the primary content and user identity surfaces. These endpoints have the largest variety of operations including search (hybrid, BM25, semantic), batch operations, and social features (comments, ratings, publishing). The spec must capture all query parameters, request bodies, and response shapes accurately.

---

## Steps

### 1. Define Memories paths

Add to `paths` in `openapi.yaml`:
- `GET /api/memories` — feed with pagination, filtering
- `POST /api/memories/search` — hybrid, BM25, and semantic search modes
- `GET /api/memories/{id}` — get single memory
- `GET /api/memories/{id}/similar` — get similar memories
- `POST /api/memories/batch` — batch create/update memories
- `POST /api/memories/{id}/comments` — add comment to memory
- `POST /api/memories/{id}/rate` — rate a memory
- `POST /api/memories/{id}/publish` — publish memory
- `POST /api/memories/{id}/retract` — retract published memory
- `POST /api/memories/{id}/delete` — soft delete memory
- `POST /api/memories/{id}/restore` — restore deleted memory
- `POST /api/memories/{id}/organize` — organize memory into collections
- `POST /api/memories/{id}/confirm` — confirm memory accuracy
- `GET /api/memories/{id}/conversations` — get conversations linked to a memory

### 2. Define Conversations paths

- `GET /api/conversations` — list conversations with pagination
- `POST /api/conversations` — create new conversation
- `GET /api/conversations/{id}` — get conversation by ID
- `POST /api/conversations/{id}/messages` — add messages to conversation
- `POST /api/conversations/bulk-import` — bulk import conversations
- `POST /api/conversations/{id}/tool-calls` — execute tool calls within conversation

### 3. Define Profiles paths

- `GET /api/profiles/{userId}` — get user profile
- `GET /api/profiles` — get all profiles (admin/discovery)
- `GET /api/profiles/feed` — profile feed
- `GET /api/profiles/{userId}/memories` — get user's memories
- `GET /api/profiles/{userId}/memories/count` — get memory count
- `GET /api/profiles/{userId}/boards` — get user's boards
- `GET /api/profiles/{userId}/boards/{boardId}/widgets` — get board widgets
- `POST /api/profiles/username-check` — check username availability
- `POST /api/profiles/bio-conversation` — generate bio via conversation
- `GET /api/profiles/all` — list all profiles

### 4. Define all request/response schemas

Add to `components/schemas`:
- Memory schemas: `Memory`, `MemoryFeedResponse`, `MemorySearchRequest`, `MemorySearchResponse`, `MemoryBatchRequest`, `MemoryCommentRequest`, `MemoryRateRequest`
- Conversation schemas: `Conversation`, `ConversationListResponse`, `CreateConversationRequest`, `MessageRequest`, `BulkImportRequest`, `ToolCallRequest`
- Profile schemas: `Profile`, `ProfileFeedResponse`, `UsernameCheckRequest`, `UsernameCheckResponse`, `BioConversationRequest`
- Shared schemas: `PaginationParams`, `PaginatedResponse`

---

## Verification

- [ ] All memory endpoints are defined with correct HTTP methods and paths
- [ ] Search endpoint supports hybrid, BM25, and semantic modes via request body
- [ ] All conversation endpoints are defined including bulk-import and tool-calls
- [ ] All profile endpoints are defined including boards and widgets
- [ ] Request/response schemas are complete and referenced correctly
- [ ] Pagination parameters are consistent across list endpoints
- [ ] Security requirements are applied to all endpoints
- [ ] Spec still validates after additions

---

**Next Task**: [task-25-openapi-groups-search.md](./task-25-openapi-groups-search.md)
