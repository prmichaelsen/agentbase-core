# Task 23: Author OpenAPI 3.1 Spec — Auth + OAuth Endpoints

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: None

---

## Objective

Create the foundational `openapi.yaml` file with OpenAPI 3.1 specification covering authentication and OAuth endpoints, security schemes, and related request/response schemas.

---

## Context

This is the first task in the OpenAPI specification effort. The spec will serve as the single source of truth for type generation, client SDK development, and API documentation. Auth and OAuth endpoints form the security foundation that all other endpoints depend on.

---

## Steps

### 1. Create openapi.yaml with base structure

Create `openapi.yaml` at the project root with:
- `openapi: "3.1.0"`
- `info` block (title, version, description, contact)
- `servers` block (local dev, staging, production)
- `tags` for endpoint grouping (auth, oauth)

### 2. Define security schemes

Add three security schemes under `components/securitySchemes`:
- **FirebaseToken**: HTTP bearer scheme for Firebase ID tokens
- **OAuthBearer**: HTTP bearer scheme for OAuth access tokens
- **ApiKey**: API key scheme via `X-API-Key` header

### 3. Define auth paths

Define the following under `paths`:
- `POST /api/auth/login` — authenticate with Firebase token, return session
- `POST /api/auth/logout` — invalidate session
- `GET /api/auth/session` — retrieve current session info

### 4. Define OAuth paths

- `POST /api/oauth/authorize` — initiate PKCE authorization flow
- `POST /api/oauth/token` — token endpoint supporting 3 grant types:
  - `api_token` — exchange API token for access token
  - `authorization_code` — exchange auth code for tokens (PKCE)
  - `refresh_token` — refresh expired access token

### 5. Define well-known endpoint

- `GET /.well-known/oauth-authorization-server` — OAuth server metadata discovery

### 6. Define auth integration paths

- `POST /api/auth/connect/{provider}` — connect external provider (ACP, GitHub, Instagram, YouTube, Eventbrite, Google Calendar)
- `POST /api/auth/disconnect/{provider}` — disconnect external provider
- `GET /api/auth/callback/{provider}` — OAuth callback handler for each provider

### 7. Define auth schemas

Add to `components/schemas`:
- `LoginRequest`, `LoginResponse`
- `SessionResponse`
- `OAuthAuthorizeRequest`, `OAuthAuthorizeResponse`
- `OAuthTokenRequest` (discriminated by `grant_type`), `OAuthTokenResponse`
- `OAuthServerMetadata`
- `ConnectProviderRequest`, `ConnectProviderResponse`
- `AuthProvider` enum (acp, github, instagram, youtube, eventbrite, google_calendar)

---

## Verification

- [ ] `openapi.yaml` exists at project root and is valid YAML
- [ ] OpenAPI version is 3.1.0
- [ ] All three security schemes are defined
- [ ] Auth paths (login, logout, session) are fully specified with request/response schemas
- [ ] OAuth paths (authorize, token) are fully specified with all 3 grant types
- [ ] Well-known endpoint is defined
- [ ] Provider connect/disconnect/callback paths are defined
- [ ] All referenced schemas exist in `components/schemas`
- [ ] Spec validates with an OpenAPI linter (e.g., `npx @redocly/cli lint openapi.yaml`)

---

**Next Task**: [task-24-openapi-memories-conversations.md](./task-24-openapi-memories-conversations.md)
