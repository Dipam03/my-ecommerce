import { useOrderStore } from '../store/orderStore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'
import { FiEye, FiTrash2 } from 'react-icons/fi'
import dayjs from 'dayjs'
import { useEffect } from 'react'

export default function Orders() {
  const { orders, fetchOrders, loading, error, cancelOrder, updateStatus } = useOrderStore()
  const [user] = useAuthState(auth)

  // Check if user is admin (via environment variable)
  const isAdmin = !!(user && (
    (import.meta.env.VITE_ADMIN_UID && user.uid === import.meta.env.VITE_ADMIN_UID) ||
    (import.meta.env.VITE_ADMIN_EMAIL && user.email === import.meta.env.VITE_ADMIN_EMAIL)
  ))

  useEffect(() => {
    if (user) {
      fetchOrders(user.uid)
    }
  }, [user, fetchOrders])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 pb-24 text-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 pb-24">
        <p className="text-red-600 bg-red-50 p-3 rounded">Error loading orders: {error}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-4 pb-24 text-center">
        <p className="text-gray-500 mb-4">Please login to view your orders</p>
        <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-3">No orders yet</p>
          <Link to="/products" className="text-gray-900">Continue shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-white-800 p-4 rounded border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{order.id}</div>
                  <div className="text-xs text-gray-500">{dayjs(order.createdAt).format('MMM DD, YYYY')}</div>
                </div>
                <div className={`text-sm px-2 py-1 rounded ${
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'shipped' ? 'bg-orange-100 text-orange-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-900'
                }`}>
                  {order.status.toUpperCase()}
                </div>
              </div>

              <div className="text-sm mb-3">
                <div className="text-gray-600">Items: {order.items.length}</div>
                <div className="font-medium">₹{order.total.toFixed(0)}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/order/${order.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500 border-2 border-yellow-600"
                >
                  <FiEye size={16} /> Track
                </Link>

                {isAdmin ? (
                  <>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="flex-1 p-2 border rounded text-sm font-medium"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-3 py-2 border rounded text-sm hover:bg-red-50"
                      title="Cancel order"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </>
                ) : (
                  order.status === 'confirmed' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 border"
                    >
                      <FiTrash2 size={16} /> Cancel
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
