import { useState, useRef, useEffect } from 'react'
import { FiX, FiCamera } from 'react-icons/fi'

export default function UPIScanner({ onSuccess, onClose, amount, upiId }) {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const videoRef = useRef(null)

  const initializeScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.')
      console.error('Camera error:', err)
    }
  }

  useEffect(() => {
    if (scanning) {
      setTimeout(() => initializeScanner(), 0)
    }
    return () => {
      const videoElement = videoRef.current
      if (videoElement?.srcObject) {
        videoElement.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [scanning])

  const handleManualUPI = () => {
    // Simulate UPI payment received
    // In a real app, you'd open UPI app here or check for payment confirmation
    // For now, we'll simulate successful payment
    setTimeout(() => {
      onSuccess({
        transactionId: 'UPI_' + Date.now(),
        status: 'success',
        amount: amount
      })
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">UPI Payment</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Amount Display */}
          <div className="text-center py-4 bg-blue-50 rounded">
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-3xl font-bold text-blue-600">₹{amount}</div>
          </div>

          {/* UPI ID Display */}
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-xs text-gray-500 mb-1">UPI ID</div>
            <div className="text-sm font-mono font-bold">{upiId}</div>
          </div>

          {/* Scanner Section */}
          {scanning ? (
            <div className="space-y-2">
              <div className="relative bg-black rounded overflow-hidden h-64">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-green-500 border-dashed m-8 rounded"></div>
              </div>
              <button 
                onClick={() => setScanning(false)}
                className="w-full py-2 bg-gray-200 text-gray-900 rounded font-medium"
              >
                Close Scanner
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setScanning(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <FiCamera size={20} /> Open Camera
            </button>
          )}

          {/* Manual Payment Trigger */}
          <button 
            onClick={handleManualUPI}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Complete Payment
          </button>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Click "Complete Payment" once you've sent the payment via UPI
          </div>
        </div>
      </div>
    </div>
  )
}
