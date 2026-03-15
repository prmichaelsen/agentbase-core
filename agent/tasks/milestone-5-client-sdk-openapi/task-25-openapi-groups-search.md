# Task 25: Author OpenAPI Spec — Groups + DMs + Search + Notifications

**Milestone**: M5 — Client SDK + OpenAPI
**Status**: not_started
**Estimated Hours**: 3
**Depends on**: T23

---

## Objective

Extend the OpenAPI spec with endpoint definitions for groups, direct messages, search, and notifications — the social and discovery layer of the application.

---

## Context

Groups and DMs provide the social/collaborative features. Search spans multiple resource types. Notifications include both REST endpoints and WebSocket support. These endpoints involve complex operations like member management, moderation (ban/mute), invite links, and real-time updates.

---

## Steps

### 1. Define Groups paths

Add to `paths`:
- `GET /api/groups` — list groups
- `POST /api/groups` — create group
- `GET /api/groups/{id}` — get group
- `PUT /api/groups/{id}` — update group
- `DELETE /api/groups/{id}` — delete group
- `POST /api/groups/batch` — batch group operations
- `GET /api/groups/{id}/members` — list members
- `POST /api/groups/{id}/members` — add members
- `DELETE /api/groups/{id}/members/{userId}` — remove member
- `POST /api/groups/{id}/ban` — ban user from group
- `POST /api/groups/{id}/unban` — unban user
- `POST /api/groups/{id}/mute` — mute user in group
- `POST /api/groups/{id}/unmute` — unmute user
- `GET /api/groups/{id}/links` — get invite links
- `POST /api/groups/{id}/links` — create invite link
- `POST /api/groups/redeem` — redeem invite link

### 2. Define DMs paths

- `GET /api/dms` — list DM conversations
- `POST /api/dms` — create DM conversation
- `GET /api/dms/{id}` — get DM conversation
- `GET /api/dms/{id}/links` — get DM share links
- `POST /api/dms/{id}/links` — create DM share link
- `POST /api/dms/redeem` — redeem DM link

### 3. Define Search paths

- `GET /api/search/users` — search users
- `GET /api/search/conversations` — search conversations
- `GET /api/search/groups` — search groups
- `GET /api/search/messages` — search messages
- `GET /api/search/relationships` — search relationships
- `GET /api/search/settings` — search settings
- `GET /api/search/feedback` — search feedback

### 4. Define Notifications paths

- `GET /api/notifications` — list notifications with pagination
- `POST /api/notifications/bulk` — bulk mark as read/dismiss
- `GET /api/notifications/{id}` — get single notification
- `DELETE /api/notifications/{id}` — delete notification
- `GET /api/notifications/preferences` — get notification preferences
- `PUT /api/notifications/preferences` — update notification preferences
- `POST /api/notifications/fcm-token` — register FCM token for push notifications
- `GET /api/notifications/unread-count` — get unread notification count
- `POST /api/notifications/test` — trigger test notification
- `GET /api/notifications/ws` — WebSocket endpoint for real-time notifications

### 5. Define all request/response schemas

Add to `components/schemas`:
- Group schemas: `Group`, `GroupListResponse`, `CreateGroupRequest`, `UpdateGroupRequest`, `GroupMember`, `BanRequest`, `MuteRequest`, `InviteLink`, `RedeemLinkRequest`
- DM schemas: `DmConversation`, `DmListResponse`, `CreateDmRequest`, `DmLink`
- Search schemas: `UserSearchResult`, `ConversationSearchResult`, `GroupSearchResult`, `MessageSearchResult`, `SearchParams`
- Notification schemas: `Notification`, `NotificationListResponse`, `BulkNotificationRequest`, `NotificationPreferences`, `FcmTokenRequest`, `UnreadCountResponse`

---

## Verification

- [ ] All group CRUD and moderation endpoints are defined
- [ ] Member management endpoints include add, remove, ban, unban, mute, unmute
- [ ] Invite link creation and redemption endpoints are defined for both groups and DMs
- [ ] All DM endpoints are defined
- [ ] Search endpoints cover all 7 resource types
- [ ] Notification endpoints include preferences, FCM token, unread count, and WebSocket
- [ ] All request/response schemas are complete
- [ ] Security requirements applied to all endpoints
- [ ] Spec validates after additions

---

**Next Task**: [task-26-openapi-remaining.md](./task-26-openapi-remaining.md)
