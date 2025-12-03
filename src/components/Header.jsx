import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiSearch, FiMenu } from 'react-icons/fi'
import { useCartStore } from '../store/cartStore'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import Logo from './Logo'

export default function Header({ onCartClick }) {
  const total = useCartStore((s) => s.totalCount)
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [user] = useAuthState(auth)

  const onSearch = (e) => {
    e.preventDefault()
    navigate('/products?q=' + encodeURIComponent(q))
  }

  const onLogout = async () => {
    try { await signOut(auth) } catch (e) { console.warn(e) }
  }

  return (
    <header className="w-full bg-gradient-to-r from-orange-600 to-orange-700 border-b border-orange-800 px-3 sm:px-4 py-3 sticky top-0 z-20 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* Desktop view */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/" aria-label="Home" className="transform hover:scale-105 transition-transform">
            <Logo />
          </Link>

          <form onSubmit={onSearch} className="flex-1 max-w-md">
            <div className="flex items-center bg-white bg-opacity-20 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-opacity-30 transition-all">
              <input
                className="flex-1 px-3 py-2 bg-transparent outline-none text-sm text-white placeholder-red-100"
                placeholder="Search products..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="px-3 py-2 text-white hover:bg-red-500 transition-all" aria-label="search">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <button onClick={onCartClick} className="relative text-white hover:bg-orange-500 p-2 rounded-lg transition-all" aria-label="cart">
              <FiShoppingCart size={20} />
              {total > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-glow">{total}</span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">{user.displayName || user.email.substring(0, 10)}</span>
                <button onClick={onLogout} className="px-3 py-1 text-sm border border-orange-200 text-white rounded-lg hover:bg-orange-500 transition-all font-medium">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="px-3 py-1 text-sm border border-orange-200 text-white rounded-lg hover:bg-orange-500 transition-all font-medium">Login</Link>
            )}
          </div>
        </div>

        {/* Mobile view */}
        <div className="sm:hidden flex items-center justify-between">
          <Link to="/" aria-label="Home" className="transform hover:scale-105 transition-transform">
            <Logo small />
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={onCartClick} className="relative p-2 text-white hover:bg-orange-500 rounded-lg transition-all" aria-label="cart">
              <FiShoppingCart size={20} />
              {total > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-red-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-glow">{total}</span>
              )}
            </button>

            {user ? (
              <button onClick={onLogout} className="p-2 text-xs bg-gray-100 text-gray-900 rounded-lg font-medium">Out</button>
            ) : (
              <Link to="/login" className="p-2 text-xs bg-gray-100 text-gray-900 rounded-lg font-medium">Login</Link>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        <form onSubmit={onSearch} className="sm:hidden mt-3">
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <input
              className="flex-1 px-3 py-2 bg-transparent outline-none text-sm"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" className="px-3 py-2 text-gray-600 hover:text-red-600 transition-colors" aria-label="search">
              <FiSearch size={16} />
            </button>
          </div>
        </form>
      </div>
    </header>
  )
}
