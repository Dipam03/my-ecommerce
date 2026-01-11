import React, { createContext, useState, useEffect, useCallback } from 'react'

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (k) => k
})

const translations = {
  en: {
    customerDetails: 'Customer Details',
    customerSupport: 'Customer Support',
    callNow: 'Call Now',
    chat: 'Chat',
    logout: 'Logout',
    profilePhoto: 'Profile Photo',
    viewOrders: 'View Orders'
  },
  hi: {
    customerDetails: 'ग्राहक विवरण',
    customerSupport: 'ग्राहक सहायता',
    callNow: 'अब कॉल करें',
    chat: 'चैट',
    logout: 'लॉगआउट',
    profilePhoto: 'प्रोफ़ाइल फ़ोटो',
    viewOrders: 'ऑर्डर देखें'
  },
  bn: {
    customerDetails: 'গ্রাহক বিবরণ',
    customerSupport: 'গ্রাহক সহায়তা',
    callNow: 'এখন কল করুন',
    chat: 'চ্যাট',
    logout: 'লগ আউট',
    profilePhoto: 'প্রোফাইল ফটো',
    viewOrders: 'অর্ডার দেখুন'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en')

  useEffect(() => {
    const stored = localStorage.getItem('app_language')
    if (stored && translations[stored]) {
      setLanguageState(stored)
      document.documentElement.lang = stored
    } else {
      const nav = navigator.language || navigator.userLanguage || 'en'
      const short = nav.startsWith('bn') ? 'bn' : nav.startsWith('hi') ? 'hi' : 'en'
      setLanguageState(short)
      document.documentElement.lang = short
    }
  }, [])

  const setLanguage = useCallback((lng) => {
    if (!translations[lng]) return
    setLanguageState(lng)
    localStorage.setItem('app_language', lng)
    document.documentElement.lang = lng
  }, [])

  const t = useCallback((key) => {
    return translations[language] && translations[language][key]
      ? translations[language][key]
      : translations['en'][key] || key
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider
