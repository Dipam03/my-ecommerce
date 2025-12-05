import { useCartStore } from '../store/cartStore'
import { FiX, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { items, removeItem, updateQty } = useCartStore()
  const total = items.reduce((s, i) => s + i.price * (i.qty || 1), 0)
  const itemCount = items.reduce((s, i) => s + (i.qty || 1), 0)

  const onCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      <div onClick={onClose} className="flex-1 bg-black bg-opacity-40 backdrop-blur-sm" />
      <div className="w-full sm:w-96 bg-white shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-orange-600" size={20} />
            <h2 className="font-bold text-lg text-gray-900">My Cart</h2>
            {itemCount > 0 && (
              <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">{itemCount}</span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-orange-200 rounded-lg transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
              <FiShoppingCart size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-xs text-gray-400 mt-2">Add products to get started</p>
              <button
                onClick={() => {
                  onClose()
                  navigate('/products')
                }}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  {/* Product Image & Name */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.category || 'Product'}</p>
                      <p className="text-orange-600 font-bold mt-1">₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <FiX size={16} className="text-red-500" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, Math.max(1, (item.qty || 1) - 1))}
                      className="p-1 border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">{item.qty || 1}</span>
                    <button
                      onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                      className="p-1 border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all"
                    >
                      <FiPlus size={14} />
                    </button>
                    <span className="ml-auto text-sm font-semibold text-gray-900">
                      ₹{(item.price * (item.qty || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gradient-to-t from-orange-50 to-transparent space-y-3 sticky bottom-0">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Subtotal:</span>
              <span className="text-lg font-bold text-gray-900">₹{total.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500">Shipping & taxes calculated at checkout</div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
