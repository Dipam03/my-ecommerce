import { create } from 'zustand'
import { db } from '../firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: true,
  _unsubscribe: null,

  // start real-time listener to Firestore `products` collection
  subscribeToProducts: () => {
    if (get()._unsubscribe) return
    const col = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(col, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      set({ products: items, loading: false })
    }, (err) => {
      console.error('Products snapshot error', err)
      set({ loading: false })
    })
    set({ _unsubscribe: unsub })
  },

  // stop listener
  unsubscribeProducts: async () => {
    const u = get()._unsubscribe
    if (u) {
      try { u() } catch (e) { console.warn('unsubscribe error', e) }
      set({ _unsubscribe: null })
    }
  },

  addProduct: async (product) => {
    const payload = {
      ...product,
      createdAt: serverTimestamp(),
    }
    try {
      await addDoc(collection(db, 'products'), payload)
    } catch (e) {
      console.error('addProduct failed', e)
      throw e
    }
  },

  updateProduct: async (id, updates) => {
    try {
      await setDoc(doc(db, 'products', id), { ...updates, updatedAt: serverTimestamp() }, { merge: true })
    } catch (e) {
      console.error('updateProduct failed', e)
      throw e
    }
  },

  deleteProduct: async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id))
    } catch (e) {
      console.error('deleteProduct failed', e)
      throw e
    }
  },

  getProduct: (id) => get().products.find(p => p.id === id),
  getAllProducts: () => get().products,
}))
