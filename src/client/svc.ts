import type { HttpClient, SdkResponse } from './http-transport.js'
import type { components, operations } from './api-types.generated.js'

type Schemas = components['schemas']

// ─── Auth ───────────────────────────────────────────

export class AuthSvc {
  constructor(private http: HttpClient) {}

  login(body: { idToken: string; captchaToken?: string }) {
    return this.http.post<Schemas['SuccessResponse']>('/api/auth/login', body)
  }

  logout() {
    return this.http.post<Schemas['SuccessResponse']>('/api/auth/logout')
  }

  getSession() {
    return this.http.get<Schemas['SessionResponse']>('/api/auth/session')
  }

  connectAcp() {
    return this.http.post<Schemas['SuccessResponse']>('/api/auth/acp/connect')
  }

  disconnectAcp() {
    return this.http.post<Schemas['SuccessResponse']>('/api/auth/acp/disconnect')
  }

  githubCallback(body: { code: string }) {
    return this.http.post<Schemas['SuccessResponse']>('/api/auth/github/callback', body)
  }

  instagramCallback(body: { code: string }) {
    return this.http.post<Schemas['SuccessResponse']>('/api/auth/instagram/callback', body)
  }

  youtubeCallback(body: { code: string }) {
    return this.http.post<Schemas['SuccessResponse']>('/api/auth/youtube/callback', body)
  }

  eventbriteConnect() {
    return this.http.post<{ url: string }>('/api/auth/eventbrite/connect')
  }

  eventbriteCallback(body: { code: string }) {
    return this.http.post<Schemas['SuccessResponse']>('/api/auth/eventbrite/callback', body)
  }

  googleCalendarConnect() {
    return this.http.post<{ url: string }>('/api/auth/google-calendar/connect')
  }
}

// ─── OAuth ──────────────────────────────────────────

export class OAuthSvc {
  constructor(private http: HttpClient) {}

  getMetadata() {
    return this.http.get<object>('/.well-known/oauth-authorization-server')
  }

  authorize(body: {
    response_type: 'code'
    client_id: string
    redirect_uri: string
    scope?: string
    state?: string
    code_challenge?: string
    code_challenge_method?: 'S256'
  }) {
    return this.http.post<{ code: string; state?: string }>('/oauth/authorize', body)
  }

  token(body: Schemas['OAuthTokenRequest']) {
    return this.http.post<Schemas['OAuthTokenResponse']>('/api/oauth/token', body)
  }
}

// ─── Memories ───────────────────────────────────────

export class MemoriesSvc {
  constructor(private http: HttpClient) {}

  feed(params?: { cursor?: string; limit?: number }) {
    return this.http.get<{ data: Schemas['Memory'][]; cursor: string | null; has_more: boolean }>('/api/memories/feed', params)
  }

  search(body: { query: string; mode?: 'hybrid' | 'bm25' | 'semantic'; limit?: number }) {
    return this.http.post<{ data: Schemas['Memory'][]; total: number }>('/api/memories/search', body)
  }

  get(memoryId: string) {
    return this.http.get<Schemas['Memory']>(`/api/memories/${memoryId}`)
  }

  getSimilar(memoryId: string, params?: { limit?: number }) {
    return this.http.get<{ data: Schemas['Memory'][] }>(`/api/memories/${memoryId}/similar`, params)
  }

  batch(ids: string[]) {
    return this.http.post<{ data: Schemas['Memory'][] }>('/api/memories/batch', { ids })
  }

  addComment(memoryId: string, body: { content: string }) {
    return this.http.post<object>(`/api/memories/${memoryId}/comments`, body)
  }

  rate(memoryId: string, rating: number) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/memories/${memoryId}/rate`, { rating })
  }

  publish(memoryId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/memories/${memoryId}/publish`)
  }

  retract(memoryId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/memories/${memoryId}/retract`)
  }

  delete(memoryId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/memories/${memoryId}/delete`)
  }

  restore(memoryId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/memories/${memoryId}/restore`)
  }

  organize(memoryId: string, body: { tags?: string[] }) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/memories/${memoryId}/organize`, body)
  }

  confirm(memoryId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/memories/${memoryId}/confirm`)
  }

  getConversations(memoryId: string) {
    return this.http.get<{ data: Schemas['Conversation'][] }>(`/api/memory-conversations/${memoryId}`)
  }
}

// ─── Conversations ──────────────────────────────────

export class ConversationsSvc {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ data: Schemas['Conversation'][] }>('/api/conversations')
  }

  create(body: { type: 'dm' | 'group'; participants?: string[] }) {
    return this.http.post<Schemas['Conversation']>('/api/conversations/create', body)
  }

  get(conversationId: string) {
    return this.http.get<Schemas['Conversation']>(`/api/conversations/${conversationId}`)
  }

  addMessage(conversationId: string, body: { content: string }) {
    return this.http.post<Schemas['Message']>(`/api/conversations/${conversationId}/messages`, body)
  }

  bulkImport(conversationId: string, messages: object[]) {
    return this.http.post<{ imported: number }>(`/api/conversations/${conversationId}/bulk-import`, { messages })
  }
}

// ─── Profiles ───────────────────────────────────────

export class ProfilesSvc {
  constructor(private http: HttpClient) {}

  get(userId: string) {
    return this.http.get<Schemas['Profile']>(`/api/profile/${userId}`)
  }

  feed(userId: string, params?: { cursor?: string }) {
    return this.http.get<{ data: Schemas['Memory'][]; cursor: string | null }>(`/api/profile/${userId}/feed`, params)
  }

  memoriesCount(userId: string) {
    return this.http.get<{ count: number }>(`/api/profile/${userId}/memories/count`)
  }

  checkUsername(username: string) {
    return this.http.post<{ available: boolean }>('/api/profile/username-check', { username })
  }

  list() {
    return this.http.get<{ data: Schemas['Profile'][] }>('/api/profiles')
  }
}

// ─── Groups ─────────────────────────────────────────

export class GroupsSvc {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ data: Schemas['Group'][] }>('/api/groups')
  }

  create(body: { name: string; description?: string }) {
    return this.http.post<Schemas['Group']>('/api/groups/create', body)
  }

  batch(ids: string[]) {
    return this.http.post<{ data: Schemas['Group'][] }>('/api/groups/batch', { ids })
  }

  get(groupId: string) {
    return this.http.get<Schemas['Group']>(`/api/groups/${groupId}`)
  }

  update(groupId: string, body: { name?: string; description?: string }) {
    return this.http.patch<Schemas['Group']>(`/api/groups/${groupId}`, body)
  }

  delete(groupId: string) {
    return this.http.delete<Schemas['SuccessResponse']>(`/api/groups/${groupId}`)
  }

  listMembers(groupId: string) {
    return this.http.get<{ data: Schemas['GroupMember'][] }>(`/api/groups/${groupId}/members`)
  }

  addMember(groupId: string, userId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/groups/${groupId}/members/${userId}`)
  }

  removeMember(groupId: string, userId: string) {
    return this.http.delete<Schemas['SuccessResponse']>(`/api/groups/${groupId}/members/${userId}`)
  }

  ban(groupId: string, userId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/groups/${groupId}/ban`, { userId })
  }

  unban(groupId: string, userId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/groups/${groupId}/unban`, { userId })
  }

  mute(groupId: string, userId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/groups/${groupId}/mute`, { userId })
  }

  unmute(groupId: string, userId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/groups/${groupId}/unmute`, { userId })
  }

  getLinks(groupId: string) {
    return this.http.post<{ code: string; url: string }>(`/api/groups/${groupId}/links`)
  }

  redeemLink(code: string) {
    return this.http.post<{ groupId: string }>(`/api/group-links/${code}/redeem`)
  }
}

// ─── DMs ────────────────────────────────────────────

export class DmsSvc {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ data: Schemas['Conversation'][] }>('/api/dm')
  }

  create(participantId: string) {
    return this.http.post<Schemas['Conversation']>('/api/dm/create', { participantId })
  }

  get(conversationId: string) {
    return this.http.get<Schemas['Conversation']>(`/api/dm/${conversationId}`)
  }

  createLink() {
    return this.http.post<{ code: string; url: string }>('/api/dm-links')
  }

  redeemLink(code: string) {
    return this.http.post<{ conversationId: string }>(`/api/dm-links/${code}/redeem`)
  }
}

// ─── Search ─────────────────────────────────────────

export class SearchSvc {
  constructor(private http: HttpClient) {}

  users(query: string) {
    return this.http.post<{ data: Schemas['Profile'][] }>('/api/search/users', { query })
  }

  conversations(query: string) {
    return this.http.post<{ data: Schemas['Conversation'][] }>('/api/search/conversations', { query })
  }

  groups(query: string) {
    return this.http.post<{ data: Schemas['Group'][] }>('/api/search/groups', { query })
  }

  messages(query: string) {
    return this.http.post<{ data: Schemas['Message'][] }>('/api/search/messages', { query })
  }
}

// ─── Notifications ──────────────────────────────────

export class NotificationsSvc {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ data: Schemas['Notification'][] }>('/api/notifications')
  }

  get(notificationId: string) {
    return this.http.get<Schemas['Notification']>(`/api/notifications/${notificationId}`)
  }

  delete(notificationId: string) {
    return this.http.delete<Schemas['SuccessResponse']>(`/api/notifications/${notificationId}`)
  }

  markAllRead() {
    return this.http.post<Schemas['SuccessResponse']>('/api/notifications', { action: 'mark_all_read' })
  }

  unreadCount() {
    return this.http.get<{ count: number }>('/api/notifications/unread-count')
  }

  registerFcmToken(token: string) {
    return this.http.post<Schemas['SuccessResponse']>('/api/notifications/fcm-token', { token })
  }
}

// ─── Relationships ──────────────────────────────────

export class RelationshipsSvc {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ data: Schemas['Relationship'][] }>('/api/relationships')
  }

  create(relatedUserId: string) {
    return this.http.post<Schemas['Relationship']>('/api/relationships', { relatedUserId })
  }
}

// ─── Boards ─────────────────────────────────────────

export class BoardsSvc {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ data: Schemas['Board'][] }>('/api/boards')
  }

  create(name: string) {
    return this.http.post<Schemas['Board']>('/api/boards', { name })
  }

  get(boardId: string) {
    return this.http.get<Schemas['Board']>(`/api/boards/${boardId}`)
  }

  update(boardId: string, body: { name?: string }) {
    return this.http.patch<Schemas['Board']>(`/api/boards/${boardId}`, body)
  }

  delete(boardId: string) {
    return this.http.delete<Schemas['SuccessResponse']>(`/api/boards/${boardId}`)
  }

  listWidgets(boardId: string) {
    return this.http.get<{ data: Schemas['Widget'][] }>(`/api/boards/${boardId}/widgets`)
  }

  addWidget(boardId: string, body: { type: string; config?: object }) {
    return this.http.post<Schemas['Widget']>(`/api/boards/${boardId}/widgets`, body)
  }
}

// ─── Tokens ─────────────────────────────────────────

export class TokensSvc {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<{ data: Schemas['ApiToken'][] }>('/api/tokens')
  }

  create(name: string) {
    return this.http.post<Schemas['ApiToken']>('/api/tokens', { name })
  }

  update(tokenId: string, body: { name?: string }) {
    return this.http.patch<Schemas['ApiToken']>(`/api/tokens/${tokenId}`, body)
  }

  delete(tokenId: string) {
    return this.http.delete<Schemas['SuccessResponse']>(`/api/tokens/${tokenId}`)
  }
}

// ─── Integrations ───────────────────────────────────

export class IntegrationsSvc {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<object>('/api/integrations')
  }

  disconnect(provider: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/integrations/${provider}/disconnect`)
  }
}

// ─── Settings ───────────────────────────────────────

export class SettingsSvc {
  constructor(private http: HttpClient) {}

  deleteAccount() {
    return this.http.post<Schemas['SuccessResponse']>('/api/settings/delete-account')
  }

  toggleGhost() {
    return this.http.post<{ ghost: boolean }>('/api/settings/ghost')
  }

  updateVisibility(visibility: 'public' | 'friends' | 'private') {
    return this.http.post<Schemas['SuccessResponse']>('/api/settings/visibility', { visibility })
  }

  acceptAiConsent() {
    return this.http.post<Schemas['SuccessResponse']>('/api/consent/ai')
  }

  acceptTos() {
    return this.http.post<Schemas['SuccessResponse']>('/api/consent/tos')
  }
}

// ─── Payments ───────────────────────────────────────

export class PaymentsSvc {
  constructor(private http: HttpClient) {}

  createCheckout() {
    return this.http.post<{ url: string }>('/api/stripe/checkout')
  }

  getBillingPortal() {
    return this.http.post<{ url: string }>('/api/stripe/portal')
  }

  syncSubscription() {
    return this.http.post<Schemas['SuccessResponse']>('/api/stripe/sync')
  }

  getSubscription() {
    return this.http.get<{ active: boolean; plan: string | null }>('/api/subscription')
  }
}

// ─── Usage ──────────────────────────────────────────

export class UsageSvc {
  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<object>('/api/usage')
  }
}

// ─── Storage ────────────────────────────────────────
// NOTE: File uploads use a WebSocket-based signed URL flow (GET /api/storage/ws),
// not a simple REST POST. This is out of scope for the REST client SDK.
// Implement upload flows directly using the WebSocket endpoint in your application.

// ─── Jobs ───────────────────────────────────────────

export class JobsSvc {
  constructor(private http: HttpClient) {}

  get(jobId: string) {
    return this.http.get<{ id: string; status: string; progress: number }>(`/api/jobs/${jobId}`)
  }

  cancel(jobId: string) {
    return this.http.post<Schemas['SuccessResponse']>(`/api/jobs/${jobId}/cancel`)
  }
}
