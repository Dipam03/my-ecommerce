import { useState, useEffect, useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, storage } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import { FiEdit2, FiPhone, FiMessageCircle, FiLogOut } from 'react-icons/fi'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref as sRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { updateProfile, signOut } from 'firebase/auth'
import { LanguageContext } from '../LanguageContext'

export default function Account(){
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      village: '',
      city: '',
      po: '',
      ps: '',
      district: '',
      pin: '',
      landmark: '',
      mobile: ''
    }
  })
  const [editingAddress, setEditingAddress] = useState(false)
  const [tempAddress, setTempAddress] = useState(form.address)
  const [saving, setSaving] = useState(false)
  const [recently, setRecently] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Load user data from Firestore on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setForm(form => ({
              ...form,
              name: user.displayName || userData.name || '',
              email: user.email || userData.email || '',
              phone: user.phoneNumber || userData.phone || '',
              address: userData.address || form.address
            }))
            setTempAddress(userData.address || form.address)
          } else {
            // Initialize user data if doesn't exist
            setForm(prev => ({
              ...prev,
              name: user.displayName || '',
              email: user.email || '',
              phone: user.phoneNumber || ''
            }))
          }
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      }
      setLoading(false)
    }

    loadUserData()
  }, [user, form.address])

  // Load recently viewed from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('recentlyViewed')
      const list = raw ? JSON.parse(raw) : []
      setRecently(list)
    } catch {
      setRecently([])
    }
  }, [])

  const handleAddressChange = (field, value) => {
    setTempAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveAddress = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: tempAddress,
        updatedAt: new Date()
      }, { merge: true })
      
      setForm(prev => ({
        ...prev,
        address: tempAddress
      }))
      setEditingAddress(false)
      alert('Address saved successfully!')
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Error saving address. Please try again.')
    }
    setSaving(false)
  }

  const handleCancelEdit = () => {
    setTempAddress(form.address)
    setEditingAddress(false)
  }

  const handleCallSupport = () => {
    window.location.href = 'tel:+919000000000'
  }

  // Handle profile picture file selection and upload
  const handleProfileFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file || !user) return

    const storagePath = `profiles/${user.uid}/${Date.now()}_${file.name}`
    const storageRef = sRef(storage, storagePath)

    try {
      setUploading(true)
      setUploadProgress(0)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setUploadProgress(progress)
      })

      await uploadTask
      const url = await getDownloadURL(storageRef)

      // Update Firebase Auth profile
      try {
        await updateProfile(auth.currentUser, { photoURL: url })
      } catch (e) {
        console.warn('updateProfile failed', e)
      }

      // Update Firestore user doc as well
      try {
        const userDocRef = doc(db, 'users', user.uid)
        await setDoc(userDocRef, { photoURL: url, updatedAt: new Date() }, { merge: true })
      } catch (e) {
        console.warn('Failed to update user doc with photoURL', e)
      }

      alert('Profile picture updated')
    } catch (err) {
      console.error('Profile upload failed', err)
      alert('Failed to upload profile picture')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleChatSupport = () => {
    const whatsappUrl = 'https://wa.me/919000000000?text=Hello%20I%20need%20support'
    window.open(whatsappUrl, '_blank')
  }

  const handleLogout = async () => {
    if (window.confirm(t('logout') + ' — Are you sure?')) {
      try {
        await signOut(auth)
        navigate('/')
      } catch (e) {
        console.warn('Logout failed', e)
        alert('Failed to logout. Please try again.')
      }
    }
  }

  const { language, setLanguage, t } = useContext(LanguageContext)

  const handleChangeLanguage = (e) => {
    setLanguage(e.target.value)
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4 pb-32 flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

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
          <label className="block text-xs text-gray-500">Profile Photo</label>
          <div className="flex items-center gap-2 mt-1">
            <input id="profileFile" type="file" accept="image/*" onChange={handleProfileFile} className="hidden" />
            <label htmlFor="profileFile" className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-50 cursor-pointer">Change</label>
            {uploading && <div className="text-xs text-gray-500">Uploading {uploadProgress}%</div>}
          </div>
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
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Address</h3>
          {!editingAddress && (
            <button 
              onClick={() => setEditingAddress(true)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <FiEdit2 size={16} /> Edit
            </button>
          )}
        </div>

        {editingAddress ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Village/City</label>
              <input 
                type="text" 
                value={tempAddress.village}
                onChange={(e) => handleAddressChange('village', e.target.value)}
                placeholder="Village or City name"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">P.O (Post Office)</label>
              <input 
                type="text" 
                value={tempAddress.po}
                onChange={(e) => handleAddressChange('po', e.target.value)}
                placeholder="Post Office"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">P.S (Police Station)</label>
              <input 
                type="text" 
                value={tempAddress.ps}
                onChange={(e) => handleAddressChange('ps', e.target.value)}
                placeholder="Police Station"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
              <input 
                type="text" 
                value={tempAddress.district}
                onChange={(e) => handleAddressChange('district', e.target.value)}
                placeholder="District"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">PIN Code</label>
              <input 
                type="text" 
                value={tempAddress.pin}
                onChange={(e) => handleAddressChange('pin', e.target.value)}
                placeholder="PIN Code"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Landmark</label>
              <input 
                type="text" 
                value={tempAddress.landmark}
                onChange={(e) => handleAddressChange('landmark', e.target.value)}
                placeholder="Landmark (Optional)"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mobile Number</label>
              <input 
                type="tel" 
                value={tempAddress.mobile}
                onChange={(e) => handleAddressChange('mobile', e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full p-2 border rounded text-sm"
                maxLength="10"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleSaveAddress}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Saving...' : 'Save Address'}
              </button>
              <button 
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded text-sm font-medium hover:bg-gray-400 disabled:opacity-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-700">Village/City: {form.address.village || form.address.city || '—'}</div>
            <div className="text-sm text-gray-700">P.O: {form.address.po || '—'}</div>
            <div className="text-sm text-gray-700">P.S: {form.address.ps || '—'}</div>
            <div className="text-sm text-gray-700">District: {form.address.district || '—'}</div>
            <div className="text-sm text-gray-700">PIN: {form.address.pin || '—'}</div>
            <div className="text-sm text-gray-700">Landmark: {form.address.landmark || '—'}</div>
            <div className="text-sm text-gray-700">Mobile: {form.address.mobile || '—'}</div>
          </>
        )}
      </section>

      <section className="mb-4 bg-white p-3 rounded border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Recently Viewed</h3>
          <button
            onClick={() => {
              localStorage.removeItem('recentlyViewed')
              setRecently([])
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </div>

        {recently.length === 0 ? (
          <p className="text-sm text-gray-500">No recent items</p>
        ) : (
          <div className="space-y-2">
            {recently.map((it) => (
              <Link key={it.id} to={`/product/${it.id}`} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                  {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{it.name}</div>
                  <div className="text-xs text-gray-500">Viewed {new Date(it.viewedAt).toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mb-4 bg-white p-3 rounded border">
        <h3 className="font-semibold mb-3">{t('customerSupport')}</h3>
        <div className="space-y-2 mb-3">
          <p className="text-sm text-gray-700">Email: support@crodyto.example</p>
          <p className="text-sm text-gray-700">Phone: +91 90000 00000</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCallSupport}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition"
          >
            <FiPhone size={18} /> Call Now
          </button>
          <button 
            onClick={handleChatSupport}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            <FiMessageCircle size={18} /> Chat
          </button>
        </div>
      </section>

      <section className="mb-4 bg-white p-3 rounded border">
        <h3 className="font-semibold mb-3">Language</h3>
        <div className="flex items-center gap-2">
          <select value={language} onChange={handleChangeLanguage} className="p-2 border rounded flex-1">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
          </select>
          <button onClick={() => setLanguage(language)} className="px-3 py-2 bg-gray-100 rounded">Apply</button>
        </div>
      </section>

      {user && (
        <section className="mb-4 bg-white p-3 rounded border border-red-200 bg-red-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 active:opacity-90 transition touch-area min-h-[44px]"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </section>
      )}
    </div>
  )
}
