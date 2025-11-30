import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiHeart, FiUser, FiShoppingBag, FiSearch, FiMoreHorizontal } from 'react-icons/fi'
import CartBar from './CartBar'
import { useCartStore } from '../store/cartStore'

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const items = useCartStore(state => state.items)

  return (
    <>
      <CartBar />
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="max-w-3xl mx-auto flex justify-between px-4 py-2 h-14 items-center">
          <button onClick={()=>navigate('/')} className="flex flex-col items-center text-xs">
            <FiHome />
            <span className={pathname === '/' ? 'text-gray-900 font-medium' : 'text-gray-500'}>Home</span>
          </button>

          <button onClick={()=>navigate('/products')} className="flex flex-col items-center text-xs">
            <FiSearch />
            <span className={pathname.startsWith('/products') ? 'text-gray-900 font-medium' : 'text-gray-500'}>Search</span>
          </button>

          <button onClick={()=>navigate('/account')} className="flex flex-col items-center text-xs">
            <FiUser />
            <span className={pathname === '/account' ? 'text-gray-900 font-medium' : 'text-gray-500'}>Account</span>
          </button>

          <button onClick={()=>navigate('/orders')} className="flex flex-col items-center text-xs">
            <FiShoppingBag />
            <span className={pathname === '/orders' ? 'text-gray-900 font-medium' : 'text-gray-500'}>Orders</span>
          </button>

          <button onClick={()=>navigate('/wishlist')} className="flex flex-col items-center text-xs relative">
            <FiHeart />
            <span className={pathname === '/wishlist' ? 'text-gray-900 font-medium' : 'text-gray-500'}>Wishlist</span>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xxs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{items.length}</span>
            )}
          </button>
        </div>
      </nav>
    </>
  )
}
