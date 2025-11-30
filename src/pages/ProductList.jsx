import { Link } from 'react-router-dom'

export default function ProductList(){
  const products = Array.from({length:12}).map((_,i)=>({id:i+1,name:`Product ${i+1}`,price:(i+1)*10}))

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-24 pt-2">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Shop All Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {products.map(p=> (
          <Link to={`/product/${p.id}`} key={p.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="h-24 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-400 group-hover:from-gray-200 group-hover:to-gray-300 transition-colors">
              Image
            </div>
            <div className="p-2 sm:p-3">
              <div className="text-sm sm:text-base font-medium text-gray-900 truncate">{p.name}</div>
              <div className="text-xs sm:text-sm text-red-600 font-semibold mt-1">₹{p.price}</div>
              <div className="text-xs text-gray-400 mt-1">★★★★☆ (24)</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
