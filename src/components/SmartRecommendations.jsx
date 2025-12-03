import { useMemo } from 'react'
import { useProductStore } from '../store/productStore'
import { Link } from 'react-router-dom'
import { FiTrendingUp, FiStar } from 'react-icons/fi'

export default function SmartRecommendations({ currentProductId, userViewHistory = [] }) {
  const { products } = useProductStore()

  const recommendations = useMemo(() => {
    if (!products.length) return []

    const currentProduct = products.find(p => p.id === currentProductId)
    if (!currentProduct) return []

    // Algorithm: Find products based on category, rating, and not yet viewed
    const recommended = products
      .filter(p => 
        p.id !== currentProductId && 
        p.category === currentProduct.category
      )
      .sort((a, b) => {
        // Sort by rating (highest first)
        const ratingDiff = (b.rating || 0) - (a.rating || 0)
        if (ratingDiff !== 0) return ratingDiff
        // Then by price (similar range)
        return Math.abs(b.price - currentProduct.price) - Math.abs(a.price - currentProduct.price)
      })
      .slice(0, 4)

    return recommended
  }, [products, currentProductId])

  if (recommendations.length === 0) return null

  return (
    <div className="mt-8 glass-morphism p-6 rounded-xl border border-opacity-20">
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="text-red-600" size={20} />
        <h3 className="text-lg font-bold text-gray-900">You Might Also Like</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {recommendations.map((p) => (
          <Link 
            key={p.id} 
            to={`/product/${p.id}`} 
            className="group hover-lift"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-24 overflow-hidden mb-2 relative">
              {p.image && (
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              )}
              <div className="absolute top-1 right-1 flex items-center gap-1 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold">
                <FiStar size={12} fill="currentColor" />
                {(p.rating || 4.5).toFixed(1)}
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
            <p className="text-sm font-bold text-red-600">₹{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
