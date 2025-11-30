import { useCartStore } from '../store/cartStore'
import { FiX, FiPlus, FiMinus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { items, removeItem, updateQty } = useCartStore()
  const total = items.reduce((s, i) => s + i.price * (i.qty || 1), 0)

  const onCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div onClick={onClose} className="flex-1 bg-black/30" />
      <div className="w-80 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Cart</h2>
          <button onClick={onClose}><FiX /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Cart is empty</div>
          ) : (
            items.map(item => (
              <div key={item.id} className="p-3 border-b">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">${item.price}</div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500"><FiX size={16} /></button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.id, (item.qty || 1) - 1)} className="p-1 border rounded"><FiMinus size={14} /></button>
                  <span className="text-sm">{item.qty || 1}</span>
                  <button onClick={() => updateQty(item.id, (item.qty || 1) + 1)} className="p-1 border rounded"><FiPlus size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <div className="text-lg font-semibold mb-3">Total: ${total.toFixed(2)}</div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-white text-gray-900 py-2 rounded disabled:bg-gray-400 hover:bg-gray-100"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
