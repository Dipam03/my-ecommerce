import { useOrderStore } from '../store/orderStore'
import { Link } from 'react-router-dom'
import { FiEye, FiTrash2 } from 'react-icons/fi'
import dayjs from 'dayjs'

export default function Orders() {
  const { orders, cancelOrder } = useOrderStore()

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
            <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{order.id}</div>
                  <div className="text-xs text-gray-500">{dayjs(order.createdAt).format('MMM DD, YYYY')}</div>
                </div>
                <div className={`text-sm px-2 py-1 rounded ${order.status === 'confirmed' ? 'bg-gray-100 text-gray-900' : order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-900'}`}>
                  {order.status.toUpperCase()}
                </div>
              </div>

              <div className="text-sm mb-3">
                <div className="text-gray-600">Items: {order.items.length}</div>
                <div className="font-medium">${order.total.toFixed(2)}</div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/order/${order.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-white text-gray-900 rounded text-sm hover:bg-gray-100"
                >
                  <FiEye size={16} /> Track
                </Link>
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-900 rounded text-sm hover:bg-gray-50"
                  >
                    <FiTrash2 size={16} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
