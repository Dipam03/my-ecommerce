import { useParams } from 'react-router-dom'
import { useOrderStore } from '../store/orderStore'
import { FiCopy, FiCheckCircle, FiClock } from 'react-icons/fi'
import dayjs from 'dayjs'

export default function OrderTracking() {
  const { id } = useParams()
  const { getOrder } = useOrderStore()
  
  // order can be undefined during first render
  const order = getOrder(id)

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-12 text-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    )
  }

  const onCopyOrderId = () => {
    navigator.clipboard.writeText(order.id)
  }

  // SAFE fallback if deliveryStatus missing
  const deliverySteps = order.deliveryStatus ?? []

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Order Details</h1>
          <button
            onClick={onCopyOrderId}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded"
            title="Copy order ID"
          >
            <FiCopy size={14} /> {order.id}
          </button>
        </div>
      </div>

      {/* Delivery Timeline */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded mb-4">
        <h3 className="font-semibold mb-4">Delivery Status</h3>

        <div className="space-y-3">
          {deliverySteps.length === 0 ? (
            <p className="text-sm text-gray-500">Status not available yet</p>
          ) : (
            deliverySteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step.completed ? <FiCheckCircle size={16} /> : <FiClock size={16} />}
                </div>

                <div className="flex-1">
                  <div className="font-medium capitalize">{step.step}</div>

                  {step.date && (
                    <div className="text-xs text-gray-500">
                      {dayjs(step.date).format('MMM DD, YYYY hh:mm A')}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded mb-4">
        <h3 className="font-semibold mb-3">Items Ordered</h3>

        <div className="space-y-2">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm pb-2 border-b last:border-0"
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">
                  Size: {item.size} | Qty: {item.qty || 1}
                </div>
              </div>

              <div className="font-medium">
                ${(item.price * (item.qty || 1)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Delivery Address</h3>
        <p className="text-sm whitespace-pre-wrap">{order.address}</p>
        <p className="text-sm mt-2">Phone: {order.phone}</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
        <div className="flex justify-between text-sm mb-2">
          <span>Subtotal:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Shipping:</span>
          <span>Free</span>
        </div>

        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
