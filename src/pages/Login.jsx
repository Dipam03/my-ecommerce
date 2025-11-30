import { useState } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try{
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    }catch(err){
      setError(err.message)
    }
  }

  const onGoogle = async () => {
    try{
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate('/')
    }catch(err){
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">Login</button>
      </form>

      <div className="mt-3">
        <button onClick={onGoogle} className="w-full py-2 border rounded">Sign in with Google</button>
      </div>

      <p className="mt-3 text-sm">Don\'t have an account? <Link to="/register" className="text-red-600 hover:text-red-700">Register</Link></p>
    </div>
  )
}
