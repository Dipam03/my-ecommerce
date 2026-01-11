import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiHeart, FiUser, FiShoppingBag, FiSearch } from 'react-icons/fi'
import CartBar from './CartBar'
import { useWishlistStore } from '../store/wishlistStore'

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const wishlistItems = useWishlistStore(state => state.items)

  const isActive = (path) => pathname === path || (path === '/products' && pathname.startsWith('/products'))

  const navItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: FiSearch, label: 'Search', path: '/products' },
    { icon: FiUser, label: 'Account', path: '/account' },
    { icon: FiShoppingBag, label: 'Orders', path: '/orders' },
    { icon: FiHeart, label: 'Wishlist', path: '/wishlist', badge: wishlistItems.length }
  ]

  return (
    <>
      <CartBar />
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-10 safe-area-bottom">
        <div className="max-w-6xl mx-auto flex justify-between items-stretch h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 touch-area relative transition-colors ${
                  active
                    ? 'text-orange-600 border-t-2 border-orange-600 bg-orange-50'
                    : 'text-gray-600 border-t-2 border-transparent hover:text-gray-900'
                }`}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} />
                <span className="text-xs font-medium truncate">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-2 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
