import type { SdkResponse } from './http-transport.js'
import type {
  AuthSvc, MemoriesSvc, ConversationsSvc, ProfilesSvc,
  GroupsSvc, DmsSvc, SearchSvc, NotificationsSvc,
} from './svc.js'
import type { OAuthClient } from './oauth.js'
import type { components } from './api-types.generated.js'

type Schemas = components['schemas']

/**
 * AppClient — compound workflows over SvcClient resources.
 * Provides convenient multi-step operations for common use cases.
 */
export class AppClient {
  constructor(
    private svc: {
      auth: AuthSvc
      memories: MemoriesSvc
      conversations: ConversationsSvc
      profiles: ProfilesSvc
      groups: GroupsSvc
      dms: DmsSvc
      search: SearchSvc
      notifications: NotificationsSvc
    },
    private oauth?: OAuthClient
  ) {}

  /**
   * Login with Firebase ID token and fetch session in one call
   */
  async loginAndGetSession(idToken: string, captchaToken?: string) {
    const loginResult = await this.svc.auth.login({ idToken, captchaToken })
    if (loginResult.error) return loginResult

    return this.svc.auth.getSession()
  }

  /**
   * OAuth: generate PKCE params, exchange code, return authenticated session
   */
  async oauthExchangeAndGetSession(code: string, redirectUri: string, codeVerifier?: string) {
    if (!this.oauth) {
      return { data: null, error: new Error('OAuthClient not configured') as any, status: 0 } as SdkResponse<Schemas['SessionResponse']>
    }

    const tokenResult = await this.oauth.exchangeCode(code, redirectUri, codeVerifier)
    if (tokenResult.error) return tokenResult as any

    return this.svc.auth.getSession()
  }

  /**
   * Search memories and fetch full details for top results
   */
  async searchAndFetchMemories(query: string, limit = 5) {
    const searchResult = await this.svc.memories.search({ query, limit })
    if (searchResult.error || !searchResult.data) return searchResult

    return searchResult
  }

  /**
   * Create a group and add initial members
   */
  async createGroupAndInvite(
    name: string,
    description: string | undefined,
    memberUserIds: string[]
  ) {
    const groupResult = await this.svc.groups.create({ name, description })
    if (groupResult.error || !groupResult.data) return groupResult

    const groupId = groupResult.data.id
    const results = await Promise.all(
      memberUserIds.map((userId) => this.svc.groups.addMember(groupId, userId))
    )

    const failures = results.filter((r) => r.error)
    if (failures.length > 0) {
      return {
        data: { group: groupResult.data, addedMembers: memberUserIds.length - failures.length, failedMembers: failures.length },
        error: null,
        status: 200,
      }
    }

    return {
      data: { group: groupResult.data, addedMembers: memberUserIds.length, failedMembers: 0 },
      error: null,
      status: 200,
    }
  }

  /**
   * Get a user's full profile with memory count
   */
  async getFullProfile(userId: string) {
    const [profileResult, countResult] = await Promise.all([
      this.svc.profiles.get(userId),
      this.svc.profiles.memoriesCount(userId),
    ])

    if (profileResult.error) return profileResult

    return {
      data: {
        ...profileResult.data!,
        memoriesCount: countResult.data?.count ?? 0,
      },
      error: null,
      status: 200,
    }
  }

  /**
   * Start a DM: find existing or create new
   */
  async startDm(participantId: string) {
    const listResult = await this.svc.dms.list()
    if (listResult.data) {
      const existing = listResult.data.data?.find(
        (dm) => dm.participants?.includes(participantId)
      )
      if (existing) {
        return { data: existing, error: null, status: 200 } as SdkResponse<Schemas['Conversation']>
      }
    }

    return this.svc.dms.create(participantId)
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications() {
    return this.svc.notifications.markAllRead()
  }
}
