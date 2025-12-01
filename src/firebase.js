// Firebase initialization using Vite env variables
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Verify config is loaded
if (!firebaseConfig.apiKey) {
  console.error('Firebase config not loaded. Check your .env file.')
} else {
  console.info('[Firebase] Config loaded successfully. Project:', firebaseConfig.projectId)
}

const app = initializeApp(firebaseConfig)

let analytics
if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID && typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (e) {
    console.warn('Firebase analytics init failed', e)
  }
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export { analytics }

export default app
