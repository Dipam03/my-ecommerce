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
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div onClick={onClose} className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      {/* Drawer */}
      <div className="w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-orange-700 flex items-center justify-between sticky top-0 z-10 safe-area-top">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-white" size={20} />
            <h2 className="font-bold text-base sm:text-lg text-white">Cart</h2>
            {itemCount > 0 && (
              <span className="bg-yellow-400 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-orange-500 rounded-lg transition-colors touch-area active:opacity-70" aria-label="close cart">
            <FiX size={20} className="text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto scrollable">
          {items.length === 0 ? (
            <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center h-full">
              <FiShoppingCart size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-600 font-semibold text-sm">Your cart is empty</p>
              <p className="text-xs text-gray-500 mt-1">Add products to get started</p>
              <button
                onClick={() => {
                  onClose()
                  navigate('/products')
                }}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold active:opacity-70 touch-area min-h-[44px]"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-3 sm:p-4 active:bg-gray-50">
                  {/* Product Image & Name */}
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.category || 'Product'}</p>
                      <p className="text-orange-600 font-bold mt-1.5 text-sm">₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 active:opacity-70 touch-area"
                      aria-label="remove item"
                    >
                      <FiX size={16} className="text-red-500" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-1.5 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQty(item.id, Math.max(1, (item.qty || 1) - 1))}
                        className="p-1.5 text-gray-600 active:bg-orange-50 touch-area min-h-[40px] min-w-[40px]"
                        aria-label="decrease quantity"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.qty || 1}</span>
                      <button
                        onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                        className="p-1.5 text-gray-600 active:bg-orange-50 touch-area min-h-[40px] min-w-[40px]"
                        aria-label="increase quantity"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      ₹{(item.price * (item.qty || 1)).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-t from-gray-50 space-y-2.5 sticky bottom-0 safe-area-bottom">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium text-sm">Subtotal:</span>
              <span className="text-lg sm:text-xl font-bold text-orange-600">₹{total.toFixed(0)}</span>
            </div>
            <p className="text-xs text-gray-500 text-center">Shipping & taxes at checkout</p>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold active:opacity-90 touch-area min-h-[48px] text-sm transition"
            >
              Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-900 py-2.5 rounded-lg font-semibold active:opacity-70 touch-area min-h-[44px] text-sm transition"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
