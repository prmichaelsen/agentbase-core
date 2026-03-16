import { initializeApp as _initializeApp } from '@prmichaelsen/firebase-admin-sdk-v8'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export function initFirebaseAdmin() {
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY
  let serviceAccount = raw
  if (raw) {
    try {
      JSON.parse(raw)
    } catch {
      try {
        serviceAccount = readFileSync(resolve(process.cwd(), raw), 'utf-8')
      } catch (e) {
        throw new Error(`FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY is not valid JSON and could not be read as a file path: ${raw}`)
      }
    }
  }
  _initializeApp({
    serviceAccount,
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}
