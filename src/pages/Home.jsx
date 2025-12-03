import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useProductStore } from '../store/productStore'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useMemo, useState } from 'react'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'

export default function Home() {
  const navigate = useNavigate()
  const { products } = useProductStore()
  const { addToCart } = useCartStore()
  const { addItem, removeItem, isWishlisted } = useWishlistStore()
  const [actionLoading, setActionLoading] = useState(null)
  
  // Show featured products (first 4)
  const featuredProducts = useMemo(() => {
    return products.slice(0, 4)
  }, [products])

  const handleWishlistToggle = async (e, p) => {
    e.preventDefault()
    e.stopPropagation()
    setActionLoading(`wishlist-${p.id}`)
    try {
      if (isWishlisted(p.id)) {
        await removeItem(p.id)
      } else {
        await addItem(p)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddToCart = (e, p) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ ...p, qty: 1, size: 'M' })
  }

  const handleBuyNow = (e, p) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ ...p, qty: 1, size: 'M' })
    navigate('/checkout')
  }

  const banners = [
    { id: 1, title: 'Big Sale', color: 'bg-indigo-500' },
    { id: 2, title: 'New Arrivals', color: 'bg-emerald-500' },
    { id: 3, title: 'Trending', color: 'bg-pink-500' },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-24 pt-2">
      <section className="mb-6">
        <Swiper spaceBetween={12} slidesPerView={1} className="rounded-lg overflow-hidden">
          {banners.map((b) => (
            <SwiperSlide key={b.id}>
              <div className={`${b.color} rounded-lg h-40 sm:h-48 flex items-center justify-center text-white font-bold text-xl sm:text-2xl transition-all hover:scale-105 animate-slideUp`}>{b.title}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 animate-slideInLeft">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-red-600 hover:text-red-700 hover:translate-x-1 transition-all">View all →</Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {featuredProducts.map((p, idx)=> {
              const isWishlisted_ = isWishlisted(p.id)
              return (
                <div key={p.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden group animate-slideUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <Link to={`/product/${p.id}`} className="block h-24 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-400 overflow-hidden relative hover:scale-110 transition-transform">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : 'Image'}
                    {p.discount && (
                      <div className="absolute top-1 right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-bounce-gentle">{p.discount}%</div>
                    )}
                  </Link>
                  <div className="p-2 sm:p-3">
                    <Link to={`/product/${p.id}`} className="text-sm sm:text-base font-medium text-gray-900 truncate hover:text-red-600 transition-colors block">{p.name}</Link>
                    <div className="text-xs sm:text-sm text-red-600 font-bold mt-1">₹{p.price}</div>
                    <div className="text-xs text-gray-400 mt-1">★★★★☆ (42)</div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1 sm:gap-2 mt-2">
                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs sm:text-sm font-medium py-1.5 rounded transition-all flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-red-200"
                      >
                        <FiShoppingCart size={14} className="hidden sm:block" />
                        <span className="text-xs sm:text-sm">Add</span>
                      </button>
                      <button
                        onClick={(e) => handleWishlistToggle(e, p)}
                        disabled={actionLoading === `wishlist-${p.id}`}
                        className={`px-2 py-1.5 rounded transition-all hover:scale-110 ${isWishlisted_ ? 'bg-gradient-to-r from-red-100 to-red-50 shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <FiHeart size={16} className={isWishlisted_ ? 'text-red-600 fill-current animate-glow' : 'text-gray-600'} />
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(e, p)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs sm:text-sm font-medium py-1.5 rounded transition-all hover:shadow-lg hover:shadow-green-200"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
