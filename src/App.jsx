import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderTracking from './pages/OrderTracking'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminProducts from './pages/AdminProducts'
import AdminAddProduct from './pages/AdminAddProduct'
import AdminEditProduct from './pages/AdminEditProduct'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import { useProductStore } from './store/productStore'
import './App.css'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      useProductStore.getState().subscribeToProducts()
    } catch (e) {
      console.warn('subscribeToProducts failed', e)
    }
    return () => {
      try {
        useProductStore.getState().unsubscribeProducts()
      } catch (e) {
        console.warn('unsubscribeProducts failed', e)
      }
    }
  }, [])

  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error)
      setError(`Error: ${event.error?.message || 'Unknown error'}`)
    }
    window.addEventListener('error', handleError)

    const handleTouchMove = (e) => {
      if (!e.target.closest('.scrollable')) {
        e.preventDefault()
      }
    }
    document.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('error', handleError)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-white text-gray-900 overflow-hidden">
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                window.location.href = (import.meta.env.VITE_BASE || (import.meta.env.PROD ? '/my-ecommerce/' : '/'))
              }}
              className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-100"
            >
              Go Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <Router basename={import.meta.env.VITE_BASE || (import.meta.env.PROD ? '/my-ecommerce/' : '/')}>
      <div className="flex flex-col h-screen bg-white text-gray-900 overflow-hidden">
        <Header onCartClick={() => setCartOpen(true)} />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

        <main className="flex-1 overflow-y-auto scrollable">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderTracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
            <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  )
}

export default App
