// src/config/index.ts
// Pattern: Config Environment (core-sdk.config-environment.md)
// Ported from remember-core

import { ValidationError } from '../errors/index.js'

export interface FirebaseAdminConfig {
  serviceAccountKey?: string
  projectId?: string
}

export interface FirebaseClientConfig {
  apiKey?: string
  authDomain?: string
  projectId?: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
  measurementId?: string
}

export interface AuthConfig {
  ownerEmails: string[]
}

export interface AgentbaseConfig {
  firebaseAdmin: FirebaseAdminConfig
  firebaseClient: FirebaseClientConfig
  auth: AuthConfig
}

/**
 * Load config from environment variables (or a passed env object).
 */
export function loadConfig(env: Record<string, string | undefined> = process.env): AgentbaseConfig {
  return {
    firebaseAdmin: {
      serviceAccountKey: env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY,
      projectId: env.FIREBASE_PROJECT_ID,
    },
    firebaseClient: {
      apiKey: env.VITE_FIREBASE_API_KEY ?? env.FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? env.FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID ?? env.FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? env.FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID ?? env.FIREBASE_APP_ID,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? env.FIREBASE_MEASUREMENT_ID,
    },
    auth: {
      ownerEmails: (env.OWNER_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean),
    },
  }
}

/**
 * Validate that required config fields are present.
 * Throws ValidationError listing all missing fields.
 */
export function validateConfig(
  config: AgentbaseConfig,
  options?: { requireFirebaseAdmin?: boolean; requireFirebaseClient?: boolean }
): void {
  const missing: string[] = []

  if (options?.requireFirebaseAdmin) {
    if (!config.firebaseAdmin.serviceAccountKey) missing.push('FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY')
    if (!config.firebaseAdmin.projectId) missing.push('FIREBASE_PROJECT_ID')
  }

  if (options?.requireFirebaseClient) {
    if (!config.firebaseClient.apiKey) missing.push('FIREBASE_API_KEY')
    if (!config.firebaseClient.projectId) missing.push('FIREBASE_PROJECT_ID')
  }

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required config: ${missing.join(', ')}`,
      { missing }
    )
  }
}
