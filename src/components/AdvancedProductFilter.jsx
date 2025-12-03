import { useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import PriceRangeSlider from './PriceRangeSlider'

export default function AdvancedProductFilter({ onFilterChange, categories = [] }) {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [selectedRating, setSelectedRating] = useState(0)
  const [sortBy, setSortBy] = useState('latest')

  const handleFilterChange = () => {
    onFilterChange?.({
      category: selectedCategory,
      priceRange,
      rating: selectedRating,
      sortBy,
    })
  }

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max })
    onFilterChange?.({
      category: selectedCategory,
      priceRange: { min, max },
      rating: selectedRating,
      sortBy,
    })
  }

  const handleReset = () => {
    setSelectedCategory('')
    setSelectedRating(0)
    setPriceRange({ min: 0, max: 100000 })
    setSortBy('latest')
    onFilterChange?.({
      category: '',
      priceRange: { min: 0, max: 100000 },
      rating: 0,
      sortBy: 'latest',
    })
  }

  return (
    <div>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all mb-4"
      >
        <FiFilter size={18} />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filter Panel */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white rounded-lg p-4 border border-gray-200 shadow-soft glass-morphism`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
          {(selectedCategory || selectedRating || sortBy !== 'latest') && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
            >
              <FiX size={14} /> Reset
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Sort By</label>
            <div className="space-y-2">
              {[
                { value: 'latest', label: 'Latest' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'trending', label: 'Trending' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-red-50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      onFilterChange?.({
                        category: selectedCategory,
                        priceRange,
                        rating: selectedRating,
                        sortBy: e.target.value,
                      })
                    }}
                    className="w-4 h-4 cursor-pointer accent-red-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-red-50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={() => {
                      setSelectedCategory('')
                      handleFilterChange()
                    }}
                    className="w-4 h-4 cursor-pointer accent-red-600"
                  />
                  <span className="text-sm text-gray-700">All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer hover:bg-red-50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={() => {
                        setSelectedCategory(cat)
                        onFilterChange?.({
                          category: cat,
                          priceRange,
                          rating: selectedRating,
                          sortBy,
                        })
                      }}
                      className="w-4 h-4 cursor-pointer accent-red-600"
                    />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <PriceRangeSlider
              onPriceChange={handlePriceChange}
              initialMin={priceRange.min}
              initialMax={priceRange.max}
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Rating</label>
            <div className="space-y-2">
              {[
                { value: 0, label: 'All Ratings' },
                { value: 4, label: '4★ & above' },
                { value: 3, label: '3★ & above' },
                { value: 2, label: '2★ & above' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer hover:bg-red-50 p-2 rounded transition-colors">
                  <input
                    type="radio"
                    name="rating"
                    value={option.value}
                    checked={selectedRating === option.value}
                    onChange={() => {
                      setSelectedRating(option.value)
                      onFilterChange?.({
                        category: selectedCategory,
                        priceRange,
                        rating: option.value,
                        sortBy,
                      })
                    }}
                    className="w-4 h-4 cursor-pointer accent-red-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
