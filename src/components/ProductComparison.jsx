import { FiX, FiCheck } from 'react-icons/fi'

export default function ProductComparison({ products = [], onClose }) {
  if (!products.length) return null

  const specs = ['Rating', 'Price', 'Category', 'Discount']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-green-50">
          <h2 className="text-xl font-bold text-gray-900">Compare Products</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <FiX size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Specification</th>
                {products.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-center min-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="text-sm font-semibold text-gray-900 text-center">{p.name}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {specs.map((spec) => (
                <tr key={spec} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-50">{spec}</td>
                  {products.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-center">
                      {spec === 'Rating' && (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold text-gray-900">{(p.rating || 4.5).toFixed(1)}</span>
                        </div>
                      )}
                      {spec === 'Price' && (
                        <span className="font-bold text-red-600">₹{p.price}</span>
                      )}
                      {spec === 'Category' && (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {p.category || 'N/A'}
                        </span>
                      )}
                      {spec === 'Discount' && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          {p.discount ? `${p.discount}%` : 'No discount'}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gradient-to-r from-red-50 to-green-50">
                <td className="px-4 py-3 font-semibold text-gray-900">Action</td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-center">
                    <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Add to Cart
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
