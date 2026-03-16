import { describe, it, expect } from 'vitest';
import {
  BASE,
  STORAGE_BASE,
  APP_CONFIG,
  PUBLIC_PROFILES,
  PRIVATE_PROFILES,
  USERS,
  PASSWORD_RESETS,
  EMAIL_VERIFICATIONS,
  CREDENTIALS,
  OAUTH_INTEGRATIONS,
  MCP_SERVERS,
  REST_API_CONFIGURATIONS,
  DELETION_NOTIFICATIONS,
  RELATIONSHIPS,
  FRIEND_LINKS,
  DM_LINKS,
  USERNAMES,
  API_USAGE,
  SPACE_METADATA,
  MEMORY_CONVERSATIONS,
  OAUTH_REFRESH_QUEUE,
  STRIPE_CUSTOMERS,
  APPLE_TRANSACTIONS,
  SCHEDULED_MESSAGES,
  API_TOKENS,
  OAUTH_CLIENTS,
  OAUTH_AUTHORIZATION_CODES,
  OAUTH_REFRESH_TOKENS,
  getUserConversations,
  getUserConversationMessages,
  getUserCredentialsCollection,
  getUserConversationToolCalls,
  getSharedConversations,
  getSharedConversationMessages,
  getSharedConversationToolCalls,
  getUserOAuthIntegrationsCollection,
  getUserProfileCollection,
  getUserProfileViewsCollection,
  getUserRelationshipIndexCollection,
  getUserSpacePreferencesCollection,
  getUserNotificationsCollection,
  getUserFcmTokensCollection,
  getUserConsentCollection,
  getGhostConversationId,
  getUserNameChangeLog,
  getWebhookEventsCollection,
  getUserSubscriptionCollection,
  getUserUsageCollection,
  getUserNotificationPreferencesCollection,
  getUserUIPreferencesCollection,
  getUserWidgetBoardsCollection,
  getWidgetBoardWidgetsCollection,
  getUserMediaCropsCollection,
  getUserSearchFeedbackCollection,
} from './collections.js';

describe('collections', () => {
  describe('platform-level constants', () => {
    it('BASE is "agentbase"', () => {
      expect(BASE).toBe('agentbase');
    });

    it('STORAGE_BASE uses underscores not dots', () => {
      expect(STORAGE_BASE).toBe('agentbase');
      expect(STORAGE_BASE).not.toContain('.');
    });

    it.each([
      ['APP_CONFIG', APP_CONFIG, 'agentbase.app-config'],
      ['PUBLIC_PROFILES', PUBLIC_PROFILES, 'agentbase.public-profiles'],
      ['PRIVATE_PROFILES', PRIVATE_PROFILES, 'agentbase.private-profiles'],
      ['USERS', USERS, 'agentbase.users'],
      ['PASSWORD_RESETS', PASSWORD_RESETS, 'agentbase.password-resets'],
      ['EMAIL_VERIFICATIONS', EMAIL_VERIFICATIONS, 'agentbase.email-verifications'],
      ['CREDENTIALS', CREDENTIALS, 'agentbase.credentials'],
      ['OAUTH_INTEGRATIONS', OAUTH_INTEGRATIONS, 'agentbase.oauth-integrations'],
      ['MCP_SERVERS', MCP_SERVERS, 'agentbase.mcp-servers'],
      ['REST_API_CONFIGURATIONS', REST_API_CONFIGURATIONS, 'agentbase.rest-api-configurations'],
      ['DELETION_NOTIFICATIONS', DELETION_NOTIFICATIONS, 'agentbase.deletion-notifications'],
      ['RELATIONSHIPS', RELATIONSHIPS, 'agentbase.relationships'],
      ['FRIEND_LINKS', FRIEND_LINKS, 'agentbase.friend-links'],
      ['DM_LINKS', DM_LINKS, 'agentbase.dm-links'],
      ['USERNAMES', USERNAMES, 'agentbase.usernames'],
      ['API_USAGE', API_USAGE, 'agentbase.api-usage'],
      ['SPACE_METADATA', SPACE_METADATA, 'agentbase.space-metadata'],
      ['MEMORY_CONVERSATIONS', MEMORY_CONVERSATIONS, 'agentbase.memory-conversations'],
      ['OAUTH_REFRESH_QUEUE', OAUTH_REFRESH_QUEUE, 'agentbase.oauth-refresh-queue'],
      ['STRIPE_CUSTOMERS', STRIPE_CUSTOMERS, 'agentbase.stripe-customers'],
      ['APPLE_TRANSACTIONS', APPLE_TRANSACTIONS, 'agentbase.apple-transactions'],
      ['SCHEDULED_MESSAGES', SCHEDULED_MESSAGES, 'agentbase.scheduled-messages'],
      ['API_TOKENS', API_TOKENS, 'agentbase.api-tokens'],
      ['OAUTH_CLIENTS', OAUTH_CLIENTS, 'agentbase.oauth-clients'],
      ['OAUTH_AUTHORIZATION_CODES', OAUTH_AUTHORIZATION_CODES, 'agentbase.oauth-authorization-codes'],
      ['OAUTH_REFRESH_TOKENS', OAUTH_REFRESH_TOKENS, 'agentbase.oauth-refresh-tokens'],
    ])('%s = "%s"', (_name, actual, expected) => {
      expect(actual).toBe(expected);
    });
  });

  describe('user-scoped path functions', () => {
    const uid = 'user123';
    const convId = 'conv456';
    const boardId = 'board789';

    it('getUserConversations', () => {
      expect(getUserConversations(uid)).toBe('agentbase.users/user123/conversations');
    });

    it('getUserConversationMessages', () => {
      expect(getUserConversationMessages(uid, convId)).toBe('agentbase.users/user123/conversations/conv456/messages');
    });

    it('getUserCredentialsCollection', () => {
      expect(getUserCredentialsCollection(uid)).toBe('agentbase.users/user123/credentials');
    });

    it('getUserConversationToolCalls', () => {
      expect(getUserConversationToolCalls(uid, convId)).toBe('agentbase.users/user123/conversations/conv456/tool_calls');
    });

    it('getSharedConversations', () => {
      expect(getSharedConversations()).toBe('agentbase.conversations');
    });

    it('getSharedConversationMessages', () => {
      expect(getSharedConversationMessages(convId)).toBe('agentbase.conversations/conv456/messages');
    });

    it('getSharedConversationToolCalls', () => {
      expect(getSharedConversationToolCalls(convId)).toBe('agentbase.conversations/conv456/tool_calls');
    });

    it('getUserOAuthIntegrationsCollection', () => {
      expect(getUserOAuthIntegrationsCollection(uid)).toBe('agentbase.users/user123/oauth-integrations');
    });

    it('getUserProfileCollection', () => {
      expect(getUserProfileCollection(uid)).toBe('agentbase.users/user123/profile');
    });

    it('getUserProfileViewsCollection', () => {
      expect(getUserProfileViewsCollection(uid)).toBe('agentbase.users/user123/profile-views');
    });

    it('getUserRelationshipIndexCollection', () => {
      expect(getUserRelationshipIndexCollection(uid)).toBe('agentbase.users/user123/relationship_index');
    });

    it('getUserSpacePreferencesCollection', () => {
      expect(getUserSpacePreferencesCollection(uid)).toBe('agentbase.users/user123/space-preferences');
    });

    it('getUserNotificationsCollection', () => {
      expect(getUserNotificationsCollection(uid)).toBe('agentbase.users/user123/notifications');
    });

    it('getUserFcmTokensCollection', () => {
      expect(getUserFcmTokensCollection(uid)).toBe('agentbase.users/user123/fcm_tokens');
    });

    it('getUserConsentCollection', () => {
      expect(getUserConsentCollection(uid)).toBe('agentbase.users/user123/consent');
    });

    it('getGhostConversationId', () => {
      expect(getGhostConversationId('owner1')).toBe('ghost:owner1');
    });

    it('getUserNameChangeLog', () => {
      expect(getUserNameChangeLog(uid)).toBe('agentbase.users/user123/name-change-log');
    });

    it('getWebhookEventsCollection', () => {
      expect(getWebhookEventsCollection()).toBe('agentbase.webhook-events');
    });

    it('getUserSubscriptionCollection', () => {
      expect(getUserSubscriptionCollection(uid)).toBe('agentbase.users/user123/subscription');
    });

    it('getUserUsageCollection', () => {
      expect(getUserUsageCollection(uid)).toBe('agentbase.users/user123/usage');
    });

    it('getUserNotificationPreferencesCollection', () => {
      expect(getUserNotificationPreferencesCollection(uid)).toBe('agentbase.users/user123/notification-preferences');
    });

    it('getUserUIPreferencesCollection', () => {
      expect(getUserUIPreferencesCollection(uid)).toBe('agentbase.users/user123/ui-preferences');
    });

    it('getUserWidgetBoardsCollection', () => {
      expect(getUserWidgetBoardsCollection(uid)).toBe('agentbase.users/user123/widget-boards');
    });

    it('getWidgetBoardWidgetsCollection', () => {
      expect(getWidgetBoardWidgetsCollection(uid, boardId)).toBe('agentbase.users/user123/widget-boards/board789/widgets');
    });

    it('getUserMediaCropsCollection', () => {
      expect(getUserMediaCropsCollection(uid)).toBe('agentbase.users/user123/media-crops');
    });

    it('getUserSearchFeedbackCollection', () => {
      expect(getUserSearchFeedbackCollection(uid)).toBe('agentbase.users/user123/search-feedback');
    });
  });
});
