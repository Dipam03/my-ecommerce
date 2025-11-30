import { useParams } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import ReviewSection from '../components/ReviewSection'
import { FiHeart, FiShare2 } from 'react-icons/fi'
import { useState } from 'react'

export default function ProductDetails(){
  const { id } = useParams()
  const addToCart = useCartStore(s=>s.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore()
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('M')
  const [added, setAdded] = useState(false)

  const product = { id, name: `Product ${id}`, price: Number(id)*10, rating: 4.5, reviews: 120 }
  const isWishlisted = wishlistItems.some(p => p.id === id)

  const onAddCart = () => {
    addToCart({ ...product, qty, size })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const onToggleWishlist = () => {
    if (isWishlisted) removeFromWishlist(id)
    else addToWishlist(product)
  }

  const onShare = async () => {
    const url = window.location.href
    const text = `Check out ${product.name} - $${product.price}`

    if (navigator.share) {
      navigator.share({ title: 'MiniFlip', text, url }).catch(() => {})
    } else {
      // Fallback: copy to clipboard and show WhatsApp option
      navigator.clipboard.writeText(`${text}\n${url}`)
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <div className="bg-gray-200 dark:bg-gray-700 rounded h-64 mb-4" />
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="text-sm text-gray-500">★ {product.rating} ({product.reviews} reviews)</div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onToggleWishlist}
            className={`p-2 rounded border ${isWishlisted ? 'bg-red-50 text-red-500 border-red-300' : ''}`}
          >
            <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={onShare}
            className="p-2 rounded border"
          >
            <FiShare2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-2xl font-bold mb-4">${product.price}</p>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-2 border rounded">
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setQty(Math.max(1, qty-1))} className="px-3 py-1 border rounded">-</button>
            <span className="w-8 text-center">{qty}</span>
            <button onClick={() => setQty(qty+1)} className="px-3 py-1 border rounded">+</button>
          </div>
        </div>

        <button 
          onClick={onAddCart}
          className={`w-full py-3 rounded font-medium transition ${added ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
        >
          {added ? '✓ Added to cart' : 'Add to cart'}
        </button>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={id} />
    </div>
  )
}

