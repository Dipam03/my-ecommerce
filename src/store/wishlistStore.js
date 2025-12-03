import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db, auth } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,

      // Add item to wishlist (both local and Firebase)
      addItem: async (product) => {
        const user = auth.currentUser
        set((s) => ({
          items: s.items.some(p => p.id === product.id) ? s.items : [...s.items, product]
        }))

        // Save to Firebase if user is authenticated
        if (user) {
          try {
            const wishlistRef = doc(db, 'wishlists', user.uid)
            const items = get().items
            await setDoc(wishlistRef, { items, updatedAt: new Date().toISOString() }, { merge: true })
          } catch (err) {
            console.error('Failed to save wishlist to Firebase:', err)
          }
        }
      },

      // Remove item from wishlist
      removeItem: async (id) => {
        set((s) => ({ items: s.items.filter(p => p.id !== id) }))

        const user = auth.currentUser
        if (user) {
          try {
            const wishlistRef = doc(db, 'wishlists', user.uid)
            const items = get().items
            await setDoc(wishlistRef, { items, updatedAt: new Date().toISOString() }, { merge: true })
          } catch (err) {
            console.error('Failed to update wishlist in Firebase:', err)
          }
        }
      },

      // Check if product is wishlisted
      isWishlisted: (id) => get().items.some(p => p.id === id),

      // Fetch wishlist from Firebase
      fetchWishlist: async (userId) => {
        if (!userId) return
        set({ loading: true })
        try {
          const wishlistRef = doc(db, 'wishlists', userId)
          const wishlistDoc = await getDoc(wishlistRef)
          
          if (wishlistDoc.exists()) {
            const data = wishlistDoc.data()
            set({ items: data.items || [], loading: false, error: null })
          } else {
            set({ loading: false })
          }
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },

      // Clear all wishlist items
      clear: async () => {
        set({ items: [] })
        const user = auth.currentUser
        if (user) {
          try {
            const wishlistRef = doc(db, 'wishlists', user.uid)
            await setDoc(wishlistRef, { items: [] }, { merge: true })
          } catch (err) {
            console.error('Failed to clear wishlist:', err)
          }
        }
      }
    }),
    { name: 'wishlist' }
  )
)
