import { Link, useSearchParams } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useMemo } from 'react'

export default function ProductList(){
  const [searchParams] = useSearchParams()
  const { products } = useProductStore()
  const query = searchParams.get('q') || ''

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products
    
    const lowerQuery = query.toLowerCase()
    return products.filter(p => 
      p.name?.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
    )
  }, [products, query])

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-24 pt-2">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {query ? `Search results for "${query}"` : 'Shop All Products'}
        </h1>
        {query && (
          <p className="text-sm text-gray-500">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No products found</p>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            View all products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {filteredProducts.map(p=> (
            <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="h-24 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-400 group-hover:from-gray-200 group-hover:to-gray-300 transition-colors overflow-hidden">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : 'Image'}
              </div>
              <div className="p-2 sm:p-3">
                <div className="text-sm sm:text-base font-medium text-gray-900 truncate">{p.name}</div>
                <div className="text-xs sm:text-sm text-red-600 font-semibold mt-1">₹{p.price}</div>
                <div className="text-xs text-gray-400 mt-1">★★★★☆ (24)</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
