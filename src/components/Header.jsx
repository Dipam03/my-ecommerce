import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiSearch } from 'react-icons/fi'
import { useCartStore } from '../store/cartStore'
import { useState, useContext } from 'react'
import Logo from './Logo'
import { LanguageContext } from '../LanguageContext'

export default function Header({ onCartClick }) {
  const total = useCartStore((s) => s.totalCount)
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const { t } = useContext(LanguageContext)

  const onSearch = (e) => {
    e.preventDefault()
    if (q.trim()) {
      navigate('/products?q=' + encodeURIComponent(q))
      setQ('')
    }
  }

  return (
    <header className="w-full bg-gradient-to-r from-orange-600 to-orange-700 border-b border-orange-800 px-3 sm:px-4 py-2 sm:py-3 sticky top-0 z-20 shadow-lg safe-area-top">
      <div className="max-w-6xl mx-auto">
        {/* Desktop view */}
        <div className="hidden sm:flex items-center gap-4">
          <Link to="/" aria-label="Home" className="flex-shrink-0 touch-area">
            <Logo />
          </Link>

          <form onSubmit={onSearch} className="flex-1 max-w-md">
            <div className="flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden backdrop-blur-sm">
              <input
                className="flex-1 px-3 py-2 bg-transparent outline-none text-sm text-white placeholder-orange-100 font-normal"
                placeholder={t('search') + ' ' + t('products') + '...'}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="px-3 py-2 text-white active:opacity-70" aria-label="search">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <button onClick={onCartClick} className="relative touch-area text-white active:opacity-70" aria-label="cart">
              <FiShoppingCart size={20} />
              {total > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-orange-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{total > 99 ? '99+' : total}</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile view */}
        <div className="sm:hidden flex items-center justify-between gap-2">
          <Link to="/" aria-label="Home" className="flex-shrink-0 touch-area">
            <Logo small />
          </Link>

          <form onSubmit={onSearch} className="flex-1 min-w-0">
            <div className="flex items-center bg-white bg-opacity-90 rounded-lg overflow-hidden h-10">
              <input
                type="search"
                className="flex-1 px-3 py-2 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
                placeholder={t('search') + '...'}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="px-3 py-2 text-gray-600 active:opacity-70 flex-shrink-0" aria-label="search">
                <FiSearch size={16} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={onCartClick} className="relative touch-area text-white active:opacity-70" aria-label="cart">
              <FiShoppingCart size={20} />
              {total > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-orange-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{total > 99 ? '99+' : total}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
