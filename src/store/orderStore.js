import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((s) => ({
        orders: [
          {
            ...order,
            id: 'ORD-' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'confirmed',
          },
          ...s.orders,
        ]
      })),
      updateStatus: (orderId, status) => set((s) => ({
        orders: s.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),
      cancelOrder: (orderId) => set((s) => ({
        orders: s.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
      })),
      getOrder: (id) => get().orders.find(o => o.id === id),
    }),
    { name: 'orders' }
  )
)
