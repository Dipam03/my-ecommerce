import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import ReviewSection from '../components/ReviewSection'
import ImageLightbox from '../components/ImageLightbox'
import { FiHeart, FiShare2 } from 'react-icons/fi'
import { useState, useEffect, useMemo } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { useProductStore } from '../store/productStore'

export default function ProductDetails(){
  const { id } = useParams()
  const addToCart = useCartStore(s=>s.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore()
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('M')
  const [added, setAdded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const getProduct = useProductStore(s => s.getProduct)
  const updateProduct = useProductStore(s => s.updateProduct)
  const [user] = useAuthState(auth)

  // Try to read product from product store (Firestore). Fallback to sample product.
  const storeProduct = getProduct(id)
  const product = storeProduct || { id, name: `Product ${id}`, price: Number(id)*10, rating: 4.5, reviews: 120, image: `https://via.placeholder.com/500x500?text=Product+${id}+Image` }

  // Build images array
  const productImages = (product.images && product.images.length)
    ? product.images
    : (product.image ? [product.image] : [
      `https://via.placeholder.com/500x500?text=Product+${id}+Image+1`,
      `https://via.placeholder.com/500x500?text=Product+${id}+Image+2`,
      `https://via.placeholder.com/500x500?text=Product+${id}+Image+3`,
    ])

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

  const navigate = useNavigate()

  const onBuyNow = () => {
    // Add to cart and go to checkout immediately
    addToCart({ ...product, qty, size })
    navigate('/checkout')
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

  const openLightbox = (index) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }

  // Add to recently viewed (localStorage)
  useEffect(() => {
    try {
      const key = 'recentlyViewed'
      const raw = localStorage.getItem(key)
      const list = raw ? JSON.parse(raw) : []
      // remove existing with same id
      const filtered = list.filter(it => String(it.id) !== String(id))
      const item = { id, name: product.name, image: productImages[0] || '', viewedAt: Date.now() }
      filtered.unshift(item)
      const limited = filtered.slice(0, 10)
      localStorage.setItem(key, JSON.stringify(limited))
    } catch (e) {
      console.warn('Failed to update recently viewed', e)
    }
  }, [id, product.name, productImages])

  // Inline edit image (prompts for URL) — updates Firestore via product store
  const onEditImage = async () => {
    const url = window.prompt('Enter new image URL for this product', productImages[0] || '')
    if (!url) return
    try {
      await updateProduct(id, { image: url })
      alert('Image updated')
    } catch (e) {
      console.error('Failed to update image', e)
      alert('Failed to update image')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      {/* Main Product Image */}
      <div 
        onClick={() => openLightbox(0)}
        className="bg-gray-200 dark:bg-gray-700 rounded h-64 mb-4 cursor-pointer hover:opacity-80 transition overflow-hidden"
      >
        <img 
          src={productImages[0]} 
          alt="Product main" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Image Thumbnails */}
      {productImages.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {productImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => openLightbox(idx)}
              className="flex-shrink-0 w-16 h-16 rounded border-2 border-transparent hover:border-gray-400 cursor-pointer transition overflow-hidden"
            >
              <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {product.category && <div className="text-sm text-gray-500">{product.category}</div>}
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

      <p className="text-2xl font-bold mb-4">₹{product.price}</p>

      {/* Product Description */}
      {product.description && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4">
          <h3 className="font-semibold text-sm mb-2">Description</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
        </div>
      )}

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

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onAddCart}
            className={`w-full py-3 rounded font-medium transition ${added ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            {added ? '✓ Added' : 'Add to cart'}
          </button>

          <button
            onClick={onBuyNow}
            className="w-full py-3 rounded font-medium bg-green-600 text-white hover:bg-green-700"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox 
        images={productImages} 
        initialIndex={selectedImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Reviews Section */}
      <ReviewSection productId={id} />

      {/* Related Products (Same Category) */}
      {product.category && (
        <RelatedProducts category={product.category} currentProductId={id} />
      )}
    </div>
  )
}

// Related Products Component
function RelatedProducts({ category, currentProductId }) {
  const { products } = useProductStore()
  
  const relatedProducts = useMemo(() => {
    return products
      .filter(p => p.category === category && p.id !== currentProductId)
      .slice(0, 6)
  }, [products, category, currentProductId])

  if (relatedProducts.length === 0) return null

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">More from {category}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {relatedProducts.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="h-24 sm:h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                'Image'
              )}
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
              <div className="text-sm text-red-600 font-semibold mt-1">₹{p.price}</div>
              <div className="text-xs text-gray-500 mt-1">★ {(p.rating || 4.5).toFixed(1)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

