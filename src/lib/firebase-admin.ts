import { initializeApp as _initializeApp } from '@prmichaelsen/firebase-admin-sdk-v8'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export function initFirebaseAdmin() {
  let serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY
  // If the value looks like a file path, read the file content
  if (serviceAccount && (serviceAccount.startsWith('./') || serviceAccount.startsWith('/'))) {
    serviceAccount = readFileSync(resolve(process.cwd(), serviceAccount), 'utf-8')
  }
  _initializeApp({
    serviceAccount,
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}
