import { useProductStore } from '../store/productStore'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function AdminProducts() {
  const navigate = useNavigate()
  const { products, deleteProduct } = useProductStore()

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <button
          onClick={() => navigate('/admin/add-product')}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded text-sm"
        >
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-3">No products yet</p>
          <button
            onClick={() => navigate('/admin/add-product')}
            className="text-green-600"
          >
            Create the first product
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-800 p-3 rounded border flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-gray-500">
                  ${product.price} | {product.category}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                  className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-900/20"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm('Delete this product?')) return
                    try {
                      await deleteProduct(product.id)
                    } catch (err) {
                      console.error('Delete failed', err)
                      alert('Failed to delete product')
                    }
                  }}
                  className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-900/20 text-gray-900"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
