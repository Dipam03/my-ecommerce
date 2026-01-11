import { useState, useContext } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import { LanguageContext } from '../LanguageContext'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useContext(LanguageContext)

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
      <h1 className="text-xl font-semibold mb-4">{t('login')}</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={t('email')} className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder={t('password')} type="password" className="w-full p-2 border rounded" />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">{t('login')}</button>
      </form>

      <div className="mt-3">
        <button onClick={onGoogle} className="w-full py-2 border rounded">Sign in with Google</button>
      </div>

      <p className="mt-3 text-sm">{t('dontHaveAccount')} <Link to="/register" className="text-red-600 hover:text-red-700">{t('register')}</Link></p>
    </div>
  )
}
