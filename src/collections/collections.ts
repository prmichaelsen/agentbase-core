const APP_NAME = 'agentbase';

// Always use production collections. Environment isolation is handled by
// separate project deployments (e0, e1, etc.), not by collection prefixes.
export const BASE = APP_NAME;

/**
 * Get storage path prefix (uses underscores - Firebase Storage strips dots)
 * - Development: e0_agentbase
 * - Production: agentbase
 */
export const STORAGE_BASE = BASE.replace(/\./g, '_');

// App configuration
export const APP_CONFIG = `${BASE}.app-config`;

// User profile collections
export const PUBLIC_PROFILES = `${BASE}.public-profiles`;
export const PRIVATE_PROFILES = `${BASE}.private-profiles`;
export const USERS = `${BASE}.users`;

// Authentication collections
export const PASSWORD_RESETS = `${BASE}.password-resets`;
export const EMAIL_VERIFICATIONS = `${BASE}.email-verifications`;

// Generic credentials collection (all OAuth tokens)
export const CREDENTIALS = `${BASE}.credentials`;

// OAuth integration tracking (user-level connection state)
export const OAUTH_INTEGRATIONS = `${BASE}.oauth-integrations`;

// MCP server registry (platform-level)
export const MCP_SERVERS = `${BASE}.mcp-servers`;

// REST API configuration registry (platform-level)
export const REST_API_CONFIGURATIONS = `${BASE}.rest-api-configurations`;

// Deletion notification records (email captured before auth deletion)
export const DELETION_NOTIFICATIONS = `${BASE}.deletion-notifications`;

// Chat collections - user-scoped
// Conversations are stored as: users/{userId}/conversations/{conversationId}
// Messages are stored as: users/{userId}/conversations/{conversationId}/messages/{messageId}

/**
 * Get the conversations collection path for a specific user
 */
export function getUserConversations(userId: string): string {
  return `${BASE}.users/${userId}/conversations`;
}

/**
 * Get the messages collection path for a specific conversation
 */
export function getUserConversationMessages(userId: string, conversationId: string): string {
  return `${BASE}.users/${userId}/conversations/${conversationId}/messages`;
}

/**
 * Get the credentials collection path for a specific user
 * Returns the collection path (credentials are stored as documents in this collection)
 * Pattern: {BASE}.users/{userId}/credentials
 * Document ID will be the provider name (e.g., 'instagram', 'eventbrite')
 */
export function getUserCredentialsCollection(userId: string): string {
  return `${BASE}.users/${userId}/credentials`;
}

/**
 * Get the tool_calls collection path for a specific conversation
 */
export function getUserConversationToolCalls(userId: string, conversationId: string): string {
  return `${BASE}.users/${userId}/conversations/${conversationId}/tool_calls`;
}

/**
 * Get the shared conversation path for DM/group conversations.
 * Not user-scoped — single source of truth for the conversation document.
 * Pattern: {BASE}.conversations (collection)
 */
export function getSharedConversations(): string {
  return `${BASE}.conversations`;
}

/**
 * Get the shared messages collection path for DM/group conversations.
 * Not user-scoped — all participants read/write from the same location.
 */
export function getSharedConversationMessages(conversationId: string): string {
  return `${BASE}.conversations/${conversationId}/messages`;
}

/**
 * Get the shared tool_calls collection path for DM/group conversations.
 */
export function getSharedConversationToolCalls(conversationId: string): string {
  return `${BASE}.conversations/${conversationId}/tool_calls`;
}

/**
 * Get OAuth integrations collection path for a user
 * Returns the collection path (integrations are stored as documents in this collection)
 * Pattern: {BASE}.users/{userId}/oauth-integrations
 * Document ID will be the provider name (e.g., 'instagram', 'eventbrite')
 */
export function getUserOAuthIntegrationsCollection(userId: string): string {
  return `${BASE}.users/${userId}/oauth-integrations`;
}

/**
 * Get the profile collection path for a specific user
 * Profile document is stored with a fixed ID of 'default'
 * Pattern: {BASE}.users/{userId}/profile
 */
export function getUserProfileCollection(userId: string): string {
  return `${BASE}.users/${userId}/profile`;
}

/**
 * Get the profile-views collection path for a specific user.
 * Tracks which profiles this user has viewed and when.
 * Pattern: {BASE}.users/{userId}/profile-views
 * Document ID: viewedUserId
 */
export function getUserProfileViewsCollection(userId: string): string {
  return `${BASE}.users/${userId}/profile-views`;
}

// Relationships (platform-level)
export const RELATIONSHIPS = `${BASE}.relationships`;

/**
 * Get the relationship index collection path for a specific user
 * Pattern: {BASE}.users/{userId}/relationship_index
 * Document ID is the related user's ID
 */
export function getUserRelationshipIndexCollection(userId: string): string {
  return `${BASE}.users/${userId}/relationship_index`;
}

// Friend links (platform-level)
export const FRIEND_LINKS = `${BASE}.friend-links`;

// DM links (platform-level)
export const DM_LINKS = `${BASE}.dm-links`;

// Username uniqueness registry (platform-level)
// Documents keyed by username: { user_id: string, created_at: number }
export const USERNAMES = `${BASE}.usernames`;

// API usage tracking
export const API_USAGE = `${BASE}.api-usage`;

// Space metadata (platform-level)
// Documents keyed by space ID: { id, name, description, ... }
export const SPACE_METADATA = `${BASE}.space-metadata`;

/**
 * Get the space preferences collection path for a specific user
 * Single document with ID 'default' storing followed/pinned source IDs
 * Pattern: {BASE}.users/{userId}/space-preferences
 */
export function getUserSpacePreferencesCollection(userId: string): string {
  return `${BASE}.users/${userId}/space-preferences`;
}

/**
 * Get the notifications collection path for a specific user
 * Pattern: {BASE}.users/{userId}/notifications
 */
export function getUserNotificationsCollection(userId: string): string {
  return `${BASE}.users/${userId}/notifications`;
}

/**
 * Get the FCM tokens collection path for a specific user
 * Pattern: {BASE}.users/{userId}/fcm_tokens
 * Document ID is the FCM token hash (to enable upsert by token)
 */
export function getUserFcmTokensCollection(userId: string): string {
  return `${BASE}.users/${userId}/fcm_tokens`;
}

/**
 * Get the memory_conversations collection (platform-level, not user-scoped)
 * Document ID: {userId}_{memoryId}
 * Pattern: {BASE}.memory-conversations
 */
export const MEMORY_CONVERSATIONS = `${BASE}.memory-conversations`;

/**
 * Get the consent collection path for a specific user
 * Pattern: {BASE}.users/{userId}/consent
 * Document IDs: 'ai' (AI data sharing consent)
 */
export function getUserConsentCollection(userId: string): string {
  return `${BASE}.users/${userId}/consent`;
}
/**
 * Build the deterministic ghost conversation document ID for a (accessor, ghost_owner) pair.
 * Format: ghost:{ghostOwnerId}
 * For group ghosts (post-MVP): ghost:group:{groupId}
 */
export function getGhostConversationId(ghostOwnerId: string): string {
  return `ghost:${ghostOwnerId}`;
}

/**
 * Get the name-change-log subcollection for a specific user.
 * Each doc records a display_name or username change event.
 * Pattern: {BASE}.users/{userId}/name-change-log
 */
export function getUserNameChangeLog(userId: string): string {
  return `${BASE}.users/${userId}/name-change-log`;
}

/**
 * Get the webhook events collection for deduplication (platform-level).
 * Pattern: {BASE}.webhook-events
 */
export function getWebhookEventsCollection(): string {
  return `${BASE}.webhook-events`;
}

/**
 * Get the subscription collection path for a specific user.
 * Single document with ID 'current' tracking subscription tier + limits.
 * Pattern: {BASE}.users/{userId}/subscription
 */
export function getUserSubscriptionCollection(userId: string): string {
  return `${BASE}.users/${userId}/subscription`;
}

/**
 * Get the usage collection path for a specific user.
 * Single document with ID 'current' tracking token + storage usage.
 * Pattern: {BASE}.users/{userId}/usage
 */
export function getUserUsageCollection(userId: string): string {
  return `${BASE}.users/${userId}/usage`;
}

/**
 * OAuth refresh queue (platform-level).
 * Document ID: {userId}_{provider}
 * Tracks which credentials need proactive refresh and when.
 * Pattern: {BASE}.oauth-refresh-queue
 */
export const OAUTH_REFRESH_QUEUE = `${BASE}.oauth-refresh-queue`;

/**
 * Stripe customer ID → Firebase UID inverted index (platform-level).
 * Document ID is the Stripe customer ID, value is { firebase_uid: string }.
 * Pattern: {BASE}.stripe-customers
 */
export const STRIPE_CUSTOMERS = `${BASE}.stripe-customers`;

/**
 * Apple original transaction ID → Firebase UID inverted index (platform-level).
 * Document ID is the Apple original transaction ID, value is { firebase_uid: string }.
 * Pattern: {BASE}.apple-transactions
 */
export const APPLE_TRANSACTIONS = `${BASE}.apple-transactions`;

/**
 * Get the notification preferences collection path for a specific user.
 * Single document with ID 'main' storing per-type opt-in/out booleans.
 * Pattern: {BASE}.users/{userId}/notification-preferences
 */
export function getUserNotificationPreferencesCollection(userId: string): string {
  return `${BASE}.users/${userId}/notification-preferences`;
}

/**
 * Get the UI preferences collection path for a specific user.
 * Single document with ID 'main' storing UI-specific preference toggles.
 * Pattern: {BASE}.users/{userId}/ui-preferences
 */
export function getUserUIPreferencesCollection(userId: string): string {
  return `${BASE}.users/${userId}/ui-preferences`;
}

/**
 * Get the widget boards collection path for a specific user.
 * Pattern: {BASE}.users/{userId}/widget-boards
 */
export function getUserWidgetBoardsCollection(userId: string): string {
  return `${BASE}.users/${userId}/widget-boards`;
}

/**
 * Get the widgets collection path for a specific board.
 * Pattern: {BASE}.users/{userId}/widget-boards/{boardId}/widgets
 */
export function getWidgetBoardWidgetsCollection(userId: string, boardId: string): string {
  return `${BASE}.users/${userId}/widget-boards/${boardId}/widgets`;
}

/**
 * Get the media-crops collection path for a specific user.
 * Stores per-image crop metadata keyed by mediaId.
 * Pattern: {BASE}.users/{userId}/media-crops
 */
export function getUserMediaCropsCollection(userId: string): string {
  return `${BASE}.users/${userId}/media-crops`;
}

/**
 * Scheduled messages queue (platform-level).
 * Document ID: sm_{uuid}
 * Top-level collection so cron can query across all users by scheduled_at.
 * Pattern: {BASE}.scheduled-messages
 */
export const SCHEDULED_MESSAGES = `${BASE}.scheduled-messages`;

/**
 * Get the search-feedback collection path for a specific user.
 * Stores relevance feedback on carousel memory results.
 * Pattern: {BASE}.users/{userId}/search-feedback
 */
export function getUserSearchFeedbackCollection(userId: string): string {
  return `${BASE}.users/${userId}/search-feedback`;
}

/**
 * API tokens collection (platform-level, not user-scoped).
 * Document ID = SHA-256 hex hash of the raw token.
 * Enables O(1) lookup during token exchange without knowing the user.
 * Pattern: {BASE}.api-tokens
 */
export const API_TOKENS = `${BASE}.api-tokens`;

/**
 * OAuth clients collection (platform-level).
 * Document ID = client_id (e.g., "remember-mcp-oauth-service").
 * Pattern: {BASE}.oauth-clients
 */
export const OAUTH_CLIENTS = `${BASE}.oauth-clients`;

/**
 * OAuth authorization codes collection (platform-level).
 * Document ID = the authorization code string.
 * Pattern: {BASE}.oauth-authorization-codes
 */
export const OAUTH_AUTHORIZATION_CODES = `${BASE}.oauth-authorization-codes`;

/**
 * OAuth refresh tokens collection (platform-level).
 * Document ID = SHA-256 hash of the refresh token.
 * Pattern: {BASE}.oauth-refresh-tokens
 */
export const OAUTH_REFRESH_TOKENS = `${BASE}.oauth-refresh-tokens`;
