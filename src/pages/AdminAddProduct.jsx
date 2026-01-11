import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi'

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const { addProduct } = useProductStore()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'electronics',
    image: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return

    try {
      await addProduct({
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        image: formData.image || 'https://picsum.photos/300',
      })
      navigate('/admin/products')
    } catch (err) {
      console.error('Add product failed', err)
      alert('Failed to add product: ' + err.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/admin/products')} className="p-2"><FiArrowLeft /></button>
        <h1 className="text-2xl font-semibold">Add Product</h1>
      </div>

      <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 p-4 rounded space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Enter price"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700"
          >
            <option>electronics</option>
            <option>clothing</option>
            <option>books</option>
            <option>home</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product description"
            rows={3}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700"
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-medium">
          Add Product
        </button>
      </form>
    </div>
  )
}
