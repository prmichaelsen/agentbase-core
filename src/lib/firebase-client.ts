/**
 * Firebase Client — singleton initialization and auth helpers.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously as firebaseSignInAnonymously,
  linkWithCredential,
  linkWithPopup,
  EmailAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
  type UserCredential,
  type AuthProvider,
} from 'firebase/auth'

let app: FirebaseApp | null = null
let authInstance: Auth | null = null

interface FirebaseConfig {
  apiKey?: string
  authDomain?: string
  projectId?: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
  measurementId?: string
}

export function initializeFirebase(config: FirebaseConfig): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(config) : getApp()
    authInstance = getAuth(app)
  }
  return app
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) throw new Error('Firebase not initialized. Call initializeFirebase() first.')
  return app
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) throw new Error('Firebase not initialized. Call initializeFirebase() first.')
  return authInstance
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password)
}

export async function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
}

export async function signInAnonymously(): Promise<UserCredential> {
  return firebaseSignInAnonymously(getFirebaseAuth())
}

export async function upgradeAnonymousAccount(
  email: string,
  password: string,
): Promise<UserCredential> {
  const user = getFirebaseAuth().currentUser
  if (!user || !user.isAnonymous) throw new Error('No anonymous user to upgrade')
  const credential = EmailAuthProvider.credential(email, password)
  return linkWithCredential(user, credential)
}

export async function upgradeAnonymousWithPopup(
  provider: AuthProvider,
): Promise<UserCredential> {
  const user = getFirebaseAuth().currentUser
  if (!user || !user.isAnonymous) throw new Error('No anonymous user to upgrade')
  return linkWithPopup(user, provider)
}

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(getFirebaseAuth(), email)
}

export async function logout(): Promise<void> {
  return signOut(getFirebaseAuth())
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}

export async function getCurrentUser(): Promise<User | null> {
  return getFirebaseAuth().currentUser
}

export async function getIdToken(): Promise<string | null> {
  const user = getFirebaseAuth().currentUser
  if (!user) return null
  return user.getIdToken()
}

export type { User, UserCredential, Auth }
