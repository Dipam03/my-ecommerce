import { useWishlistStore } from '../store/wishlistStore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'
import { FiX, FiShoppingCart } from 'react-icons/fi'
import { useEffect } from 'react'
import { useCartStore } from '../store/cartStore'

export default function Wishlist() {
  const { items, removeItem, fetchWishlist, loading } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const [user] = useAuthState(auth)

  // Fetch wishlist from Firebase when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist(user.uid)
    }
  }, [user, fetchWishlist])

  const handleAddToCart = (product) => {
    addToCart({ ...product, qty: 1, size: 'M' })
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 pb-24 text-center">
        <p className="text-gray-500">Loading wishlist...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-semibold mb-4">My Wishlist ({items.length})</h1>
      
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="mb-3">Your wishlist is empty</p>
          <Link to="/products" className="text-red-600 font-medium">Continue shopping →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              {/* Remove Button */}
              <button 
                onClick={() => removeItem(p.id)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white dark:bg-gray-700 rounded-full hover:bg-red-50"
                title="Remove from wishlist"
              >
                <FiX size={16} className="text-red-600" />
              </button>

              {/* Product Image */}
              <Link to={`/product/${p.id}`} className="block relative overflow-hidden bg-gray-100 h-28 sm:h-32">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Image</div>
                )}
              </Link>

              {/* Product Info */}
              <div className="p-2 sm:p-3">
                <Link to={`/product/${p.id}`} className="block">
                  <div className="text-sm font-medium text-gray-900 truncate hover:text-red-600">{p.name}</div>
                  {p.category && <div className="text-xs text-gray-500">{p.category}</div>}
                  <div className="text-sm text-red-600 font-semibold mt-1">₹{p.price}</div>
                </Link>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(p)}
                  className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 transition"
                >
                  <FiShoppingCart size={14} /> Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
