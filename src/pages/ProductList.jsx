import { Link, useSearchParams } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useMemo, useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'

export default function ProductList(){
  const [searchParams] = useSearchParams()
  const { products } = useProductStore()
  const query = searchParams.get('q') || ''
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
    return cats
  }, [products])

  // Filter products based on search query, category, and price
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.category?.toLowerCase().includes(lowerQuery)
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)

    return filtered
  }, [products, query, selectedCategory, priceRange])

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 pb-24 pt-2">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {query ? `Search: "${query}"` : selectedCategory ? selectedCategory : 'Shop All Products'}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            <FiFilter size={18} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-4">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-full sm:w-48 bg-white p-4 rounded-lg border mb-4 sm:mb-0 sm:sticky sm:top-4">
            <div className="flex items-center justify-between mb-4 sm:hidden">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1">
                <FiX size={20} />
              </button>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-sm mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left text-sm px-2 py-1 rounded ${
                      !selectedCategory ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left text-sm px-2 py-1 rounded ${
                        selectedCategory === cat ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3">Price Range</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600">Min: ₹{priceRange.min}</label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Max: ₹{priceRange.max}</label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedCategory || priceRange.min !== 0 || priceRange.max !== 100000) && (
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  setPriceRange({ min: 0, max: 100000 })
                }}
                className="w-full py-2 text-sm border rounded hover:bg-gray-50 font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="w-full text-center py-12">
            <p className="text-gray-500 mb-4">No products found</p>
            <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium">
              View all products →
            </Link>
          </div>
        ) : (
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {filteredProducts.map(p=> (
                <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="h-24 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-400 group-hover:from-gray-200 group-hover:to-gray-300 transition-colors overflow-hidden relative">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : 'Image'}
                    {p.discount && (
                      <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {p.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-3">
                    <div className="text-sm sm:text-base font-medium text-gray-900 truncate">{p.name}</div>
                    {p.category && <div className="text-xs text-gray-500">{p.category}</div>}
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs sm:text-sm text-red-600 font-semibold">₹{p.price}</div>
                      <div className="text-xs text-gray-400">★ {(p.rating || 4.5).toFixed(1)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
