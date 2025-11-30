import { useWishlistStore } from '../store/wishlistStore'
import { Link } from 'react-router-dom'
import { FiX } from 'react-icons/fi'

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore()

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-semibold mb-4">My Wishlist</h1>
      
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="mb-3">Your wishlist is empty</p>
          <Link to="/products" className="text-red-600">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm relative">
              <button 
                onClick={() => removeItem(p.id)}
                className="absolute top-1 right-1 p-1 bg-white dark:bg-gray-700 rounded-full"
              >
                <FiX size={16} />
              </button>
              <Link to={`/product/${p.id}`}>
                <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">${p.price}</div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
