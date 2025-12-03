import { useState, useEffect } from 'react'
import { useCartStore } from '../store/cartStore'
import { useOrderStore } from '../store/orderStore'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import UPIScanner from '../components/UPIScanner'
import { FiCheck } from 'react-icons/fi'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, clear } = useCartStore()
  const { addOrder } = useOrderStore()
  const [user] = useAuthState(auth)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showUPIScanner, setShowUPIScanner] = useState(false)
  const [upiPaymentStatus, setUpiPaymentStatus] = useState(null)

  // Load saved address from Firestore on mount
  useEffect(() => {
    const loadAddress = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            const addr = userData.address
            if (addr) {
              // Build address string from components
              const addrParts = [
                addr.village || addr.city,
                addr.po,
                addr.ps,
                addr.district,
                addr.pin
              ].filter(Boolean).join(', ')
              const addrWithLandmark = addr.landmark ? `${addrParts} (${addr.landmark})` : addrParts
              setAddress(addrWithLandmark)
              // Use mobile from address, fallback to phone
              setPhone(addr.mobile || addr.phone || user.phoneNumber || '')
            }
          }
        } catch (e) {
          console.warn('Failed to load address', e)
        }
      }
      setLoading(false)
    }
    
    loadAddress()
  }, [user])

  const total = items.reduce((s, i) => s + i.price * (i.qty || 1), 0)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!address || !phone) {
      setError('Please fill in all fields')
      return
    }

    // For UPI, payment MUST be completed before placing order
    if (paymentMethod === 'upi') {
      if (!upiPaymentStatus) {
        setError('Please complete UPI payment to place order')
        setShowUPIScanner(true)
        return
      }
      if (upiPaymentStatus.status !== 'success') {
        setError('Payment was not successful. Please try again')
        setUpiPaymentStatus(null)
        setShowUPIScanner(true)
        return
      }
    }

    const order = {
      items,
      total,
      paymentMethod,
      address,
      phone,
      paymentDetails: upiPaymentStatus || null,
      deliveryStatus: [
        { step: 'confirmed', completed: true, date: new Date().toISOString() },
        { step: 'processing', completed: false, date: null },
        { step: 'shipped', completed: false, date: null },
        { step: 'delivered', completed: false, date: null },
      ]
    }

    try {
      await addOrder(order)
      clear()
      navigate('/orders')
    } catch (err) {
      setError('Failed to place order: ' + err.message)
    }
  }

  const handleUPIPaymentSuccess = async (paymentData) => {
    setUpiPaymentStatus(paymentData)
    setShowUPIScanner(false)
    // Auto-submit the order after successful payment
    setTimeout(async () => {
      const order = {
        items,
        total,
        paymentMethod,
        address,
        phone,
        paymentDetails: paymentData,
        deliveryStatus: [
          { step: 'confirmed', completed: true, date: new Date().toISOString() },
          { step: 'processing', completed: false, date: null },
          { step: 'shipped', completed: false, date: null },
          { step: 'delivered', completed: false, date: null },
        ]
      }
      try {
        await addOrder(order)
        clear()
        navigate('/orders')
      } catch (err) {
        setError('Failed to place order: ' + err.message)
      }
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Cart is empty</p>
        <a href="/products" className="text-gray-900 font-medium">Continue Shopping →</a>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 pb-24 pt-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Address */}
        <div className="form-group">
          <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="input-field text-sm sm:text-base"
            rows={4}
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit phone number"
            className="input-field text-sm sm:text-base"
            maxLength={10}
          />
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-3">Payment Method</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm sm:text-base font-medium text-gray-900">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm sm:text-base font-medium text-gray-900">UPI Payment</span>
            </label>
          </div>
        </div>

        {/* UPI Details (if selected) */}
        {paymentMethod === 'upi' && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm sm:text-base font-medium text-blue-900">📱 UPI ID: <strong>support@dsmart.upi</strong></p>
            <p className="text-xs sm:text-sm text-blue-700 mt-2">Payment will be processed via UPI. You'll receive a prompt to complete the transaction.</p>
          </div>
        )}

        {error && <div className="text-sm sm:text-base text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{error}</div>}

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 mb-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-xs sm:text-sm text-gray-700">
                <span className="truncate">{item.name} <span className="font-semibold">x{item.qty || 1}</span></span>
                <span className="font-medium">₹{(item.price * (item.qty || 1)).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
            <span className="text-base sm:text-lg font-bold text-gray-900">Total:</span>
            <span className="text-lg sm:text-2xl font-bold text-gray-900">₹{total.toFixed(0)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full text-base sm:text-lg font-semibold py-3 bg-green-600 hover:bg-green-700"
        >
          Place Order
        </button>
      </form>

      {/* UPI Scanner Modal */}
      {showUPIScanner && (
        <UPIScanner 
          onSuccess={handleUPIPaymentSuccess}
          onClose={() => setShowUPIScanner(false)}
          amount={total}
          upiId="support@dsmart.upi"
        />
      )}
    </div>
  )
}
