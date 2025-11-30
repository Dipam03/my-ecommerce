import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Account(){
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    address: {
      village: '',
      city: '',
      po: '',
      ps: '',
      district: '',
      pin: '',
      landmark: ''
    }
  })

  return (
    <div className="max-w-md mx-auto p-4 pb-32">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <div className="text-xl text-gray-600">{user?.displayName?.[0] || 'U'}</div>
          )}
        </div>
        <div>
          <div className="font-semibold text-lg">{user?.displayName || 'Guest'}</div>
          <div className="text-sm text-gray-500">{user?.email || 'Not signed in'}</div>
        </div>
      </div>

      <section className="mb-4 bg-white p-3 rounded border">
        <h3 className="font-semibold mb-2">Customer Details</h3>
        <div className="text-sm text-gray-700">Name: {form.name}</div>
        <div className="text-sm text-gray-700">Contact: {form.phone || '—'}</div>
        <button onClick={()=>navigate('/orders')} className="mt-3 text-sm text-gray-900">View Orders</button>
      </section>

      <section className="mb-4 bg-white p-3 rounded border">
        <h3 className="font-semibold mb-2">Address</h3>
        <div className="text-sm text-gray-700">Village/City: {form.address.village || form.address.city || '—'}</div>
        <div className="text-sm text-gray-700">P.O: {form.address.po || '—'}</div>
        <div className="text-sm text-gray-700">P.S: {form.address.ps || '—'}</div>
        <div className="text-sm text-gray-700">District: {form.address.district || '—'}</div>
        <div className="text-sm text-gray-700">PIN: {form.address.pin || '—'}</div>
        <div className="text-sm text-gray-700">Landmark: {form.address.landmark || '—'}</div>
      </section>

      <section className="mb-4 bg-white p-3 rounded border">
        <h3 className="font-semibold mb-2">Recently Viewed</h3>
        <p className="text-sm text-gray-500">No recent items</p>
      </section>

      <section className="mb-4 bg-white p-3 rounded border">
        <h3 className="font-semibold mb-2">Customer Support</h3>
        <p className="text-sm text-gray-700">Email: support@crodyto.example</p>
        <p className="text-sm text-gray-700">Phone: +91 90000 00000</p>
      </section>
    </div>
  )
}
