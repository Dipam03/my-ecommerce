import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useMemo, useState, useContext } from 'react'
import { FiFilter, FiX, FiHeart, FiShoppingCart } from 'react-icons/fi'
import { LanguageContext } from '../LanguageContext'

export default function ProductList(){
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { products } = useProductStore()
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, isWishlisted, removeItem: removeFromWishlist } = useWishlistStore()
  const { t } = useContext(LanguageContext)
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
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 pb-20 pt-2">
      {/* Header */}
      <div className="mb-4 sticky top-0 bg-white z-10 py-2">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate flex-1">
            {query ? `${t('search')}: "${query}"` : selectedCategory || t('products')}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-700 active:opacity-70 min-h-[44px] font-medium text-sm"
          >
            <FiFilter size={16} />
            <span className="hidden sm:inline">{t('Filter')}</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500">
          {filteredProducts.length} {filteredProducts.length !== 1 ? t('products') : t('products')}
        </p>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowFilters(false)} />
      )}

      <div className="flex gap-3 lg:gap-4">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-white p-4 rounded-t-lg md:rounded-lg border md:w-48 md:sticky md:top-32 max-h-96 md:max-h-[calc(100vh-200px)] overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 text-gray-500 active:opacity-70" aria-label="close filters">
                <FiX size={20} />
              </button>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-sm mb-3 text-gray-900">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setShowFilters(false)
                    }}
                    className={`w-full text-left text-sm px-3 py-2 rounded touch-area min-h-[44px] transition ${
                      !selectedCategory
                        ? 'bg-orange-100 text-orange-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setShowFilters(false)
                      }}
                      className={`w-full text-left text-sm px-3 py-2 rounded touch-area min-h-[44px] transition ${
                        selectedCategory === cat
                          ? 'bg-orange-100 text-orange-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
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
              <h4 className="font-semibold text-sm mb-3 text-gray-900">Price Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Min: ₹{priceRange.min}</label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full h-2 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Max: ₹{priceRange.max}</label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full h-2 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            {(selectedCategory || priceRange.min !== 0 || priceRange.max !== 100000) && (
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  setPriceRange({ min: 0, max: 100000 })
                }}
                className="w-full py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 active:opacity-70 touch-area"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="w-full text-center py-12">
            <p className="text-gray-500 mb-4">No products found</p>
            <Link to="/products" className="text-orange-600 hover:text-orange-700 font-medium">
              View all products →
            </Link>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {filteredProducts.map(p => {
                const isLiked = isWishlisted(p.id)
                const handleWishlistToggle = (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isLiked) {
                    removeFromWishlist(p.id)
                  } else {
                    addToWishlist(p)
                  }
                }
                const handleAddToCart = (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart({ ...p, qty: 1, size: 'M' })
                }
                const handleBuyNow = (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart({ ...p, qty: 1, size: 'M' })
                  navigate('/checkout')
                }

                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group active:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-24 sm:h-32">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-active:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">Image</div>
                      )}
                      {p.discount && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          {p.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-2 sm:p-3">
                      <div className="mb-1 sm:mb-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2">{p.name}</h3>
                        {p.category && <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>}
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs sm:text-sm font-bold text-orange-600">₹{p.price}</div>
                        <div className="text-xs text-gray-500">★ {(p.rating || 4.5).toFixed(1)}</div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 text-xs sm:text-sm">
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 py-1.5 sm:py-2 bg-orange-100 text-orange-700 rounded font-medium active:opacity-70 min-h-[40px]"
                          title="Add to cart"
                        >
                          <FiShoppingCart size={14} className="mx-auto" />
                        </button>

                        <button
                          onClick={handleWishlistToggle}
                          className={`flex-1 py-1.5 sm:py-2 rounded font-medium active:opacity-70 min-h-[40px] transition ${
                            isLiked
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                          title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <FiHeart size={14} className="mx-auto" fill={isLiked ? 'currentColor' : 'none'} />
                        </button>

                        <button
                          onClick={handleBuyNow}
                          className="flex-1 py-1.5 sm:py-2 bg-green-600 text-white rounded font-medium active:opacity-70 min-h-[40px]"
                          title="Buy now"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
