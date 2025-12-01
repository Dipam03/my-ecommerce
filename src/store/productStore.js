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

    // CORRECT COLLECTION NAME: "products"
    const col = query(collection(db, 'products'), orderBy('createdAt', 'desc'))

    let unsub = onSnapshot(col, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      console.info('[products] products snapshot received, count=', items.length)
      set({ products: items, loading: false })
    }, (err) => {
      console.error('Products snapshot error', err)
      set({ loading: false })

      if (!get()._triedFallback) {
        console.warn('[productStore] retrying snapshot without orderBy(createdAt)')
        try {
          // CORRECT COLLECTION NAME: "products"
          const colFallback = collection(db, 'products')

          const unsubFallback = onSnapshot(colFallback, (snap2) => {
            const items2 = snap2.docs.map(d => ({ id: d.id, ...d.data() }))
            console.info('[productStore] fallback snapshot received, count=', items2.length)
            set({ products: items2, loading: false })
          }, (err2) => {
            console.error('Products fallback snapshot error', err2)
            set({ loading: false })
          })

          set({ _unsubscribe: unsubFallback, _triedFallback: true })
        } catch (e) {
          console.error('[productStore] fallback subscribe failed', e)
        }
      }
    })

    set({ _unsubscribe: unsub })
  },

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
      // CORRECT COLLECTION NAME: "products"
      await addDoc(collection(db, 'products'), payload)
    } catch (e) {
      console.error('addProduct failed', e)
      throw e
    }
  },

  updateProduct: async (id, updates) => {
    try {
      // CORRECT COLLECTION NAME: "products"
      await setDoc(doc(db, 'products', id), { ...updates, updatedAt: serverTimestamp() }, { merge: true })
    } catch (e) {
      console.error('updateProduct failed', e)
      throw e
    }
  },

  deleteProduct: async (id) => {
    try {
      // CORRECT COLLECTION NAME: "products"
      await deleteDoc(doc(db, 'products', id))
    } catch (e) {
      console.error('deleteProduct failed', e)
      throw e
    }
  },

  getProduct: (id) => get().products.find(p => p.id === id),
  getAllProducts: () => get().products,
}))
