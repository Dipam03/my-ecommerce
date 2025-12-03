import { useState, useCallback } from 'react'
import { FiFilter } from 'react-icons/fi'

export default function PriceRangeSlider({ min = 0, max = 100000, onPriceChange, initialMin = 0, initialMax = 100000 }) {
  const [minPrice, setMinPrice] = useState(initialMin)
  const [maxPrice, setMaxPrice] = useState(initialMax)

  const handleMinChange = useCallback((e) => {
    const value = parseInt(e.target.value)
    if (value <= maxPrice) {
      setMinPrice(value)
      onPriceChange?.(value, maxPrice)
    }
  }, [maxPrice, onPriceChange])

  const handleMaxChange = useCallback((e) => {
    const value = parseInt(e.target.value)
    if (value >= minPrice) {
      setMaxPrice(value)
      onPriceChange?.(minPrice, value)
    }
  }, [minPrice, onPriceChange])

  const percentage1 = ((minPrice - min) / (max - min)) * 100
  const percentage2 = ((maxPrice - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter size={18} className="text-red-600" />
        <h3 className="font-bold text-gray-900">Price Range</h3>
      </div>

      <div className="space-y-3">
        {/* Price display */}
        <div className="flex justify-between items-center bg-gradient-to-r from-red-50 to-green-50 p-3 rounded-lg border border-red-100">
          <div className="text-sm font-semibold text-gray-700">
            ₹<span className="text-red-600">{minPrice.toLocaleString()}</span>
          </div>
          <div className="text-gray-400">to</div>
          <div className="text-sm font-semibold text-gray-700">
            ₹<span className="text-green-600">{maxPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Range slider */}
        <div className="relative pt-8 pb-2">
          {/* Track background */}
          <div className="absolute top-8 w-full h-2 bg-gray-200 rounded-full pointer-events-none" />
          
          {/* Active range track */}
          <div
            className="absolute top-8 h-2 bg-gradient-to-r from-red-600 to-green-600 rounded-full pointer-events-none"
            style={{
              left: `calc(${percentage1}% + ${(min / (max - min)) * 100}%)`,
              right: `calc(${100 - percentage2}% + ${((max - max) / (max - min)) * 100}%)`,
            }}
          />

          {/* Min slider */}
          <input
            type="range"
            min={min}
            max={max}
            value={minPrice}
            onChange={handleMinChange}
            className="absolute w-full top-8 h-2 bg-transparent rounded-full appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-red-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-lg"
            style={{ zIndex: minPrice > max - 100000 / 2 ? 5 : 3 }}
          />

          {/* Max slider */}
          <input
            type="range"
            min={min}
            max={max}
            value={maxPrice}
            onChange={handleMaxChange}
            className="absolute w-full top-8 h-2 bg-transparent rounded-full appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-lg"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Quick select buttons */}
        <div className="flex gap-2 flex-wrap pt-2">
          {[
            { label: 'Under ₹500', min: 0, max: 500 },
            { label: '₹500-₹2000', min: 500, max: 2000 },
            { label: '₹2000-₹5000', min: 2000, max: 5000 },
            { label: 'Above ₹5000', min: 5000, max: max },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setMinPrice(preset.min)
                setMaxPrice(preset.max)
                onPriceChange?.(preset.min, preset.max)
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-gray-100 to-gray-50 hover:from-red-100 hover:to-red-50 border border-gray-200 transition-all hover:border-red-300"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
