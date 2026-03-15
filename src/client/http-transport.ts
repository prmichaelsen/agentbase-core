import { AppError, ExternalError, UnauthorizedError, RateLimitError } from '../errors/index.js'

export interface SdkResponse<T> {
  data: T | null
  error: AppError | null
  status: number
  /** Throw the error if present, otherwise return { data, status } with non-null data. */
  throwOnError(): { data: T; status: number }
}

function createSdkResponse<T>(data: T | null, error: AppError | null, status: number): SdkResponse<T> {
  return {
    data,
    error,
    status,
    throwOnError() {
      if (error) throw error
      return { data: data as T, status }
    },
  }
}

export type AuthStrategy =
  | { type: 'bearer'; token: string | (() => Promise<string>) }
  | { type: 'apiKey'; key: string }
  | { type: 'cookie' }

export interface HttpClientConfig {
  baseUrl: string
  auth?: AuthStrategy
  headers?: Record<string, string>
  timeout?: number
}

export class HttpClient {
  private config: HttpClientConfig

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { auth } = this.config
    if (!auth) return {}

    switch (auth.type) {
      case 'bearer': {
        const token = typeof auth.token === 'function' ? await auth.token() : auth.token
        return { Authorization: `Bearer ${token}` }
      }
      case 'apiKey':
        return { Authorization: `Bearer ${auth.key}` }
      case 'cookie':
        return {} // cookies sent automatically by browser
    }
  }

  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown
      params?: Record<string, string | number | undefined>
      headers?: Record<string, string>
    }
  ): Promise<SdkResponse<T>> {
    let url = `${this.config.baseUrl}${path}`

    if (options?.params) {
      const searchParams = new URLSearchParams()
      for (const [k, v] of Object.entries(options.params)) {
        if (v !== undefined) searchParams.set(k, String(v))
      }
      const qs = searchParams.toString()
      if (qs) url += `?${qs}`
    }

    const authHeaders = await this.getAuthHeaders()
    const headers: Record<string, string> = {
      ...this.config.headers,
      ...authHeaders,
      ...options?.headers,
    }

    if (options?.body) {
      headers['Content-Type'] = 'application/json'
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout!)

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
        credentials: this.config.auth?.type === 'cookie' ? 'include' : undefined,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json() as T
        return createSdkResponse(data, null, response.status)
      }

      const errorBody = await response.json().catch(() => ({ error: response.statusText })) as { error?: string }
      const message = errorBody.error || response.statusText

      let error: AppError
      switch (response.status) {
        case 401:
          error = new UnauthorizedError(message)
          break
        case 429:
          error = new RateLimitError(message)
          break
        default:
          error = new ExternalError(message, { status: response.status })
      }

      return createSdkResponse<T>(null, error, response.status)
    } catch (err) {
      clearTimeout(timeoutId)

      if (err instanceof AppError) {
        return createSdkResponse<T>(null, err, 0)
      }

      const message = err instanceof Error ? err.message : 'Network error'
      return createSdkResponse<T>(null, new ExternalError(message), 0)
    }
  }

  get<T>(path: string, params?: Record<string, string | number | undefined>) {
    return this.request<T>('GET', path, { params })
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, { body })
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, { body })
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path)
  }
}
