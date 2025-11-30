import { useCartStore } from '../store/cartStore'
import { useNavigate } from 'react-router-dom'

export default function CartBar(){
  const navigate = useNavigate()
  const items = useCartStore(state => state.items)
  const total = items.reduce((s,i)=>s + i.price * (i.qty||1), 0)
  if (!items || items.length === 0) return null

  // Place the cart bar above the bottom nav and safe-area inset
  const bottomStyle = { bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)' }

  return (
    <div className="fixed left-0 right-0 z-40 flex justify-center md:hidden" style={bottomStyle}>
      <div className="max-w-3xl w-full mx-3 bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">{items.length} item{items.length>1?'s':''}</div>
          <div className="text-sm text-gray-500">₹{total.toFixed(0)}</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white text-gray-900 border rounded" onClick={()=>navigate('/cart')}>View Cart</button>
          <button className="px-3 py-1 bg-gray-900 text-white rounded" onClick={()=>navigate('/checkout')}>Checkout</button>
        </div>
      </div>
    </div>
  )
}
