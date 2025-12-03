import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiTrendingUp } from 'react-icons/fi'
import { useProductStore } from '../store/productStore'

export default function AdvancedSearchBar() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { products } = useProductStore()
  const navigate = useNavigate()

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    
    const q = query.toLowerCase()
    return products
      .filter(p => 
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(p => ({ id: p.id, name: p.name, category: p.category, image: p.image }))
  }, [query, products])

  const trendingSearches = ['Electronics', 'Fashion', 'Home & Garden', 'Sports']

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query)}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`)
    setShowSuggestions(false)
    setQuery('')
  }

  return (
    <div className="relative flex-1 max-w-md mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center bg-white rounded-full border-2 border-gray-200 hover:border-red-400 transition-all focus-within:border-red-600 focus-within:shadow-lg focus-within:shadow-red-200">
          <FiSearch className="ml-4 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(e.target.value.trim() !== '')
            }}
            onFocus={() => query && setShowSuggestions(true)}
            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
          />
          <button 
            type="submit"
            className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {suggestions.length > 0 ? (
              <div className="divide-y">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                  >
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <FiSearch size={14} className="text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3 font-semibold flex items-center gap-2">
                  <FiTrendingUp size={16} className="text-red-600" />
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setQuery(search)
                        navigate(`/products?q=${encodeURIComponent(search)}`)
                        setShowSuggestions(false)
                      }}
                      className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-50 text-red-700 text-xs font-semibold rounded-full hover:from-red-200 hover:to-red-100 transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
