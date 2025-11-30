import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try{
      if (!phone) throw new Error('Mobile number is required')
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCred.user
      if (name) await updateProfile(user, { displayName: name })
      // Save additional user info to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: name || user.displayName || '',
          email: user.email,
          phone,
          createdAt: serverTimestamp(),
        })
      } catch (e) {
        console.warn('Failed to write user doc', e)
      }
      navigate('/')
    }catch(err){
      setError(err.message)
    }
  }

  const handleProviderSignIn = async (providerName) => {
    setError('')
    try {
      let provider
      if (providerName === 'google') provider = new GoogleAuthProvider()
      else if (providerName === 'facebook') provider = new FacebookAuthProvider()
      else throw new Error('Unsupported provider')

      const result = await signInWithPopup(auth, provider)
      const user = result.user
      // Ensure user doc exists and if phone was collected locally use it
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          provider: providerName,
          updatedAt: serverTimestamp(),
        }, { merge: true })
      } catch (e) {
        console.warn('Failed to write user doc for provider sign-in', e)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <div className="space-y-3">
        <button type="button" onClick={()=>handleProviderSignIn('google')} className="w-full flex items-center justify-center gap-2 border p-2 rounded bg-white hover:bg-gray-50">
          <span>Continue with Google</span>
        </button>
        <button type="button" onClick={()=>handleProviderSignIn('facebook')} className="w-full flex items-center justify-center gap-2 border p-2 rounded bg-white hover:bg-gray-50">
          <span>Continue with Facebook</span>
        </button>

        <div className="text-center text-sm text-gray-500">or register with email</div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Mobile number (required)" className="w-full p-2 border rounded" required inputMode="tel" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button className="w-full bg-green-600 text-white py-2 rounded">Create account</button>
        </form>
      </div>

      <p className="mt-3 text-sm">Already have an account? <Link to="/login" className="text-gray-900">Login</Link></p>
    </div>
  )
}
