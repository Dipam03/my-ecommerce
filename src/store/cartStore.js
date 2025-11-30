import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items.slice()
    const idx = items.findIndex(i => i.id === item.id)
    if (idx > -1) {
      items[idx].qty = (items[idx].qty || 1) + (item.qty || 1)
    } else {
      items.push({ ...item, qty: item.qty || 1 })
    }
    set({ items })
  },
  removeItem: (id) => set((s)=>({ items: s.items.filter(i=>i.id!==id) })),
  updateQty: (id, qty) => set((s)=>({ items: s.items.map(i => i.id===id?{...i,qty}:i) })),
  clear: ()=>set({ items: [] }),
  get totalCount(){
    return get().items.reduce((s,i)=>s+(i.qty||0),0)
  }
}))
