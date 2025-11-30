import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function Home() {
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
              <div className={`${b.color} rounded-lg h-40 sm:h-48 flex items-center justify-center text-white font-bold text-xl sm:text-2xl`}>{b.title}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-red-600 hover:text-red-700">View all →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {[1,2,3,4].map((i)=> (
            <Link to={`/product/${i}`} key={i} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-24 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-400">
                Image
              </div>
              <div className="p-2 sm:p-3">
                <div className="text-sm sm:text-base font-medium text-gray-900 truncate">Product {i}</div>
                <div className="text-xs sm:text-sm text-red-600 font-semibold">₹{10*i}</div>
                <div className="text-xs text-gray-400 mt-1">★★★★☆ (42)</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
