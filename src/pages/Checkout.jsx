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
  const [showUPIScanner, setShowUPIScanner] = useState(false)
  const [upiPaymentStatus, setUpiPaymentStatus] = useState(null)
  const [loading, setLoading] = useState(true)

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
        <a href="/products" className="text-orange-600 hover:text-orange-700 font-medium">Continue Shopping →</a>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 pb-24 pt-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Checkout</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address including house number, street, city, state and pin code"
            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none min-h-[100px]"
            rows={4}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit phone number"
            className="w-full px-3 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none min-h-[44px]"
            maxLength={10}
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Payment Method</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg active:bg-gray-50 transition-colors touch-area min-h-[50px]">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-900">Cash on Delivery</span>
                <p className="text-xs text-gray-500 mt-0.5">Pay when you receive the order</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg active:bg-gray-50 transition-colors touch-area min-h-[50px]">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-900">UPI Payment</span>
                <p className="text-xs text-gray-500 mt-0.5">Pay securely using UPI</p>
              </div>
            </label>
          </div>
        </div>

        {/* UPI Details (if selected) */}
        {paymentMethod === 'upi' && (
          <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-lg">
            <p className="text-sm font-semibold text-blue-900">📱 Scan to Pay</p>
            <p className="text-xs text-blue-700 mt-1.5">UPI ID: <strong>support@dsmart.upi</strong></p>
            <p className="text-xs text-blue-700 mt-2">Amount: <strong>₹{total.toFixed(0)}</strong></p>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border-2 border-red-200">
            {error}
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border-2 border-gray-200 sticky top-20 z-10">
          <h3 className="font-bold text-sm text-gray-900 mb-2">Order Summary</h3>
          <div className="space-y-1.5 mb-2.5 max-h-32 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-xs text-gray-700">
                <span className="truncate flex-1">{item.name} <span className="font-semibold">×{item.qty || 1}</span></span>
                <span className="font-medium ml-2">₹{(item.price * (item.qty || 1)).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-orange-600">₹{total.toFixed(0)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg active:opacity-90 touch-area min-h-[48px] text-base transition"
        >
          {paymentMethod === 'upi' ? 'Continue to UPI Payment' : 'Place Order'}
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
