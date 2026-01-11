import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db, auth } from '../firebase'
import { collection, addDoc, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore'

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      error: null,

      // -----------------------------
      // ADD ORDER (fixed)
      // -----------------------------
      addOrder: async (order) => {
        try {
          const user = auth.currentUser
          if (!user) throw new Error('User not authenticated')

          const deliveryStatus = [
            { step: 'Order placed', completed: true, date: new Date().toISOString() },
            { step: 'Confirmed', completed: true, date: new Date().toISOString() },
            { step: 'Processing', completed: false, date: null },
            { step: 'Shipped', completed: false, date: null },
            { step: 'Out for delivery', completed: false, date: null },
            { step: 'Delivered', completed: false, date: null }
          ]

          const payload = {
            ...order,
            userId: user.uid,
            createdAt: new Date().toISOString(),
            status: 'confirmed',
            deliveryStatus,   // 🔥 IMPORTANT
          }

          const docRef = await addDoc(collection(db, 'orders'), payload)

          set((s) => ({
            orders: [{ id: docRef.id, ...payload }, ...s.orders]
          }))

          return docRef.id
        } catch (err) {
          set({ error: err.message })
          throw err
        }
      },

      // -----------------------------
      // FETCH ORDERS (real-time)
      // -----------------------------
      fetchOrders: async (userId) => {
        if (!userId) return

        set({ loading: true })
        try {
          const q = query(collection(db, 'orders'), where('userId', '==', userId))

          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }))

              set({ orders, loading: false, error: null })
            },
            (err) => set({ error: err.message, loading: false })
          )

          return unsubscribe
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },

      // -----------------------------
      // UPDATE STATUS (fixed)
      // -----------------------------
      updateStatus: async (orderId, newStatus) => {
        try {
          const order = get().orders.find(o => o.id === orderId)
          if (!order) throw new Error("Order not found")

          const updatedStatus = order.deliveryStatus.map((step) => {
            if (step.step.toLowerCase() === newStatus.toLowerCase()) {
              return { ...step, completed: true, date: new Date().toISOString() }
            }
            return step
          })

          const orderRef = doc(db, 'orders', orderId)
          await updateDoc(orderRef, {
            status: newStatus,
            deliveryStatus: updatedStatus,
          })

          // Update local state
          set((s) => ({
            orders: s.orders.map(o =>
              o.id === orderId ? { ...o, status: newStatus, deliveryStatus: updatedStatus } : o
            ),
          }))
        } catch (err) {
          set({ error: err.message })
        }
      },

      cancelOrder: async (orderId) => {
        try {
          const deliveryStatus = [
            { step: 'Cancelled', completed: true, date: new Date().toISOString() }
          ]

          const orderRef = doc(db, 'orders', orderId)
          await updateDoc(orderRef, {
            status: 'cancelled',
            deliveryStatus
          })

          set((s) => ({
            orders: s.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled', deliveryStatus } : o)
          }))
        } catch (err) {
          set({ error: err.message })
        }
      },

      getOrder: (id) => get().orders.find(o => o.id === id),
    }),
    { name: 'orders' }
  )
)
