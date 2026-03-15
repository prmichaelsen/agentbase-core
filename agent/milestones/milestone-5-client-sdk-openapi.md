# Milestone 5: Client SDK + OpenAPI

**ID**: M5
**Status**: not_started
**Estimated Duration**: 3 weeks
**Priority**: High
**Depends on**: M2 (error types)

## Goal

Create a full client SDK for agentbase.me, starting with an OpenAPI spec generated from the ~135 API endpoints, then building HTTP transport, SvcClient (1:1 REST mirror), and AppClient (compound workflows) layers. Enable third-party OAuth integration with agentbase.me.

## Context

agentbase.me is a TanStack Start app on Cloudflare Workers with:
- ~135 API endpoints across auth, conversations, memories, groups, profiles, boards, search, notifications, relationships, payments, integrations
- Firebase + OAuth + API token auth
- WebSocket endpoints for real-time features
- Zod schemas for request validation
- Rate limiting via Cloudflare Workers API

No OpenAPI spec exists — it must be authored from the route definitions in `~/.acp/projects/agentbase.me/src/routes/api/`.

## Deliverables

- `openapi.yaml` — full OpenAPI 3.1 spec for agentbase.me
- Type generation from spec (openapi-typescript)
- `src/client/http-transport.ts` — shared fetch layer with auth
- `src/client/svc/` — 1:1 REST resource clients
- `src/client/app/` — compound workflow clients
- `src/client/index.ts` — barrel export
- OAuth helper utilities
- New export entry point: `@prmichaelsen/agentbase-core/client`

## API Areas Covered

| Area | Endpoints | Priority |
|------|-----------|----------|
| Auth (login, session, OAuth) | ~12 | Critical |
| Memories (CRUD, search, feed) | ~14 | Critical |
| Conversations (CRUD, messages) | ~6 | Critical |
| Profiles (get, feed, boards) | ~8 | High |
| Groups (CRUD, members, moderation) | ~15 | High |
| DMs (CRUD, links) | ~5 | High |
| Search (users, conversations, messages) | ~6 | High |
| Notifications (CRUD, preferences, FCM) | ~8 | Medium |
| Relationships (CRUD, organize) | ~8 | Medium |
| Boards & Widgets (CRUD) | ~12 | Medium |
| Spaces (feed, metadata) | ~4 | Medium |
| Tokens & API keys | ~4 | Medium |
| Integrations (connect/disconnect) | ~8 | Low |
| Storage (upload, crop) | ~3 | Low |
| Stripe/IAP (checkout, webhooks) | ~6 | Low |
| Admin (seed, analytics) | ~4 | Low |
| Scheduled messages | ~4 | Low |
| Jobs (status, cancel) | ~3 | Low |

## Tasks

| Task | Name | Est. Hours |
|------|------|------------|
| T23 | Author OpenAPI 3.1 spec — auth + OAuth endpoints | 2 |
| T24 | Author OpenAPI spec — memories + conversations + profiles | 3 |
| T25 | Author OpenAPI spec — groups + DMs + search + notifications | 3 |
| T26 | Author OpenAPI spec — remaining endpoints (boards, relationships, spaces, integrations, payments, admin) | 3 |
| T27 | Type generation setup (openapi-typescript) | 1 |
| T28 | HTTP transport layer with auth (Firebase token, OAuth, API key) | 2 |
| T29 | SvcClient resource classes (1:1 REST mirror) | 3 |
| T30 | AppClient compound workflows | 2 |
| T31 | OAuth helper utilities (PKCE, token refresh) | 1.5 |
| T32 | Client SDK tests | 2 |
| T33 | Package exports + documentation | 1.5 |

**Total**: ~24 hours

## Success Criteria

- [ ] openapi.yaml validates with OpenAPI linter
- [ ] Types generated from spec match actual API responses
- [ ] SvcClient covers all ~135 endpoints
- [ ] AppClient provides convenient multi-step workflows
- [ ] OAuth flow works end-to-end (authorize, token exchange, refresh)
- [ ] `@prmichaelsen/agentbase-core/client` export entry point works
- [ ] README documents client SDK usage
