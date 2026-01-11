// Firebase initialization using Vite env variables
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Prefer Vite env vars, fallback to window.__FIREBASE_CONFIG__ (useful on GitHub Pages)
const env = typeof import.meta !== 'undefined' ? import.meta.env : {}
const globalCfg = typeof window !== 'undefined' ? window.__FIREBASE_CONFIG__ : undefined

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || (globalCfg && globalCfg.apiKey) || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || (globalCfg && globalCfg.authDomain) || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || (globalCfg && globalCfg.projectId) || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || (globalCfg && globalCfg.storageBucket) || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || (globalCfg && globalCfg.messagingSenderId) || '',
  appId: env.VITE_FIREBASE_APP_ID || (globalCfg && globalCfg.appId) || '',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || (globalCfg && globalCfg.measurementId) || '',
}

let app = null
let analytics = null
let _auth = null
let _db = null
let _storage = null

if (!firebaseConfig.apiKey) {
  console.error('Firebase config not loaded. App will run without Firebase. Provide VITE_FIREBASE_* env vars or window.__FIREBASE_CONFIG__.')
} else {
  try {
    app = initializeApp(firebaseConfig)
    try {
      if (firebaseConfig.measurementId && typeof window !== 'undefined') {
        analytics = getAnalytics(app)
      }
    } catch (e) {
      console.warn('Firebase analytics init failed', e)
    }

    _auth = getAuth(app)
    _db = getFirestore(app)
    _storage = getStorage(app)
    console.info('[Firebase] Initialized for project:', firebaseConfig.projectId)
  } catch (e) {
    console.error('Firebase initialization failed:', e)
  }
}

export const auth = _auth
export const db = _db
export const storage = _storage
export { analytics }

export default app
