import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set((s) => ({
        items: s.items.some(p => p.id === product.id) ? s.items : [...s.items, product]
      })),
      removeItem: (id) => set((s) => ({ items: s.items.filter(p => p.id !== id) })),
      isWishlisted: (id) => get().items.some(p => p.id === id)
    }),
    { name: 'wishlist' }
  )
)
