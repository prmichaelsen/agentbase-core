# Task 26: Author OpenAPI Spec — Remaining Endpoints

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 3
**Depends on**: T23

---

## Objective

Complete the OpenAPI spec by defining all remaining endpoints: boards/widgets, relationships, spaces, settings, storage, integrations, billing (Stripe + Apple IAP), tokens, scheduled messages, jobs, admin, webhooks, and consent.

---

## Context

This task covers the long tail of API endpoints that don't fit into the major resource categories. While individually smaller, these endpoints are essential for a complete SDK. They include infrastructure concerns (storage, jobs, admin), monetization (Stripe, Apple IAP), and user preferences (settings, consent).

---

## Steps

### 1. Define Boards & Widgets paths

- `GET /api/boards` — list boards
- `POST /api/boards` — create board
- `GET /api/boards/{id}` — get board
- `PUT /api/boards/{id}` — update board
- `DELETE /api/boards/{id}` — delete board
- `GET /api/boards/{id}/widgets` — list widgets
- `POST /api/boards/{id}/widgets` — create widget
- `PUT /api/boards/{id}/widgets/{widgetId}` — update widget
- `DELETE /api/boards/{id}/widgets/{widgetId}` — delete widget
- `POST /api/boards/{id}/widgets/reorder` — reorder widgets

### 2. Define Relationships paths

- `GET /api/relationships` — list relationships
- `POST /api/relationships` — create relationship
- `GET /api/relationships/{id}` — get relationship
- `PUT /api/relationships/{id}` — update relationship
- `DELETE /api/relationships/{id}` — delete relationship
- `POST /api/relationships/reorder` — reorder relationships
- `POST /api/relationships/organize` — organize relationships

### 3. Define Spaces paths

- `GET /api/spaces/feed` — space feed
- `GET /api/spaces/{id}/metadata` — get space metadata
- `GET /api/spaces/{id}/preferences` — get space preferences
- `PUT /api/spaces/{id}/preferences` — update space preferences
- `GET /api/spaces/{id}/sources` — get space sources

### 4. Define Settings paths

- `POST /api/settings/delete-account` — delete user account
- `POST /api/settings/ghost` — toggle ghost mode
- `PUT /api/settings/visibility` — update visibility settings
- `GET /api/settings/ui-preferences` — get UI preferences
- `PUT /api/settings/ui-preferences` — update UI preferences

### 5. Define Storage paths

- `POST /api/storage/upload` — upload image (multipart/form-data)
- `POST /api/storage/crop` — crop uploaded image

### 6. Define Integrations paths

- `GET /api/integrations` — list connected integrations
- `POST /api/integrations/{provider}/disconnect` — disconnect integration
- `GET /api/integrations/{provider}/credentials` — get integration credentials

### 7. Define Stripe paths

- `POST /api/stripe/checkout` — create checkout session
- `POST /api/stripe/portal` — create customer portal session
- `POST /api/stripe/sync` — sync subscription status
- `POST /api/stripe/webhook` — Stripe webhook handler (no auth)

### 8. Define Apple IAP paths

- `POST /api/apple/verify` — verify Apple receipt
- `POST /api/apple/webhook` — Apple server notification handler (no auth)

### 9. Define Tokens paths

- `GET /api/tokens` — list API tokens
- `POST /api/tokens` — create API token
- `GET /api/tokens/{id}` — get API token
- `PUT /api/tokens/{id}` — update API token
- `DELETE /api/tokens/{id}` — revoke API token

### 10. Define Scheduled Messages paths

- `GET /api/scheduled-messages` — list scheduled messages
- `POST /api/scheduled-messages` — create scheduled message
- `GET /api/scheduled-messages/{id}` — get scheduled message
- `PUT /api/scheduled-messages/{id}` — update scheduled message
- `DELETE /api/scheduled-messages/{id}` — delete scheduled message

### 11. Define Jobs paths

- `GET /api/jobs/{id}/status` — get job status
- `POST /api/jobs/{id}/cancel` — cancel running job
- `GET /api/jobs/ingest-status` — get ingest pipeline status

### 12. Define Admin paths

- `POST /api/admin/seed` — seed database
- `GET /api/admin/analytics` — get analytics data
- `GET /api/admin/reports` — get reports
- `GET /api/admin/usage` — get usage statistics
- `GET /api/admin/users` — search users (admin)

### 13. Define Webhooks paths

- `GET /api/webhooks/events` — list webhook event types
- `POST /api/webhooks/instagram` — Instagram webhook handler

### 14. Define Consent paths

- `POST /api/consent/ai` — update AI consent
- `POST /api/consent/tos` — accept terms of service

### 15. Define all remaining schemas

Add all request/response schemas for the above endpoints to `components/schemas`.

---

## Verification

- [ ] Boards and widgets CRUD + reorder endpoints are defined
- [ ] Relationships CRUD + reorder + organize endpoints are defined
- [ ] Spaces feed, metadata, preferences, and sources endpoints are defined
- [ ] Settings endpoints cover account deletion, ghost mode, visibility, and UI preferences
- [ ] Storage upload supports multipart/form-data
- [ ] Integrations list, disconnect, and credentials endpoints are defined
- [ ] Stripe checkout, portal, sync, and webhook endpoints are defined
- [ ] Apple IAP verify and webhook endpoints are defined
- [ ] Tokens CRUD endpoints are defined
- [ ] Scheduled messages CRUD endpoints are defined
- [ ] Jobs status, cancel, and ingest-status endpoints are defined
- [ ] Admin endpoints are defined with appropriate security requirements
- [ ] Webhook and consent endpoints are defined
- [ ] Webhook endpoints (Stripe, Apple, Instagram) correctly omit auth requirements
- [ ] All schemas are complete and referenced
- [ ] Full spec validates with OpenAPI linter

---

**Next Task**: [task-27-type-generation.md](./task-27-type-generation.md)
