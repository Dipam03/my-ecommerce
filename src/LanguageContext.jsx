import React, { createContext, useState, useEffect, useCallback } from 'react'

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (k) => k
})

const translations = {
  en: {
    // Account & User
    customerDetails: 'Customer Details',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    contact: 'Contact',
    address: 'Address',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    village: 'Village/City',
    po: 'P.O (Post Office)',
    ps: 'P.S (Police Station)',
    district: 'District',
    pin: 'PIN Code',
    landmark: 'Landmark',
    mobile: 'Mobile Number',
    customerSupport: 'Customer Support',
    callNow: 'Call Now',
    chat: 'Chat',
    logout: 'Logout',
    profilePhoto: 'Profile Photo',
    viewOrders: 'View Orders',
    recentlyViewed: 'Recently Viewed',
    clear: 'Clear',
    noRecentItems: 'No recent items',
    change: 'Change',
    savingAddress: 'Saving...',
    saveAddress: 'Save Address',
    language: 'Language',
    // Home & Navigation
    home: 'Home',
    search: 'Search',
    cart: 'Cart',
    account: 'Account',
    wishlist: 'Wishlist',
    orders: 'Orders',
    // Products
    products: 'Products',
    featuredProducts: 'Featured Products',
    price: 'Price',
    rating: 'Rating',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    addToCart: 'Add to Cart',
    add: 'Add',
    buy: 'Buy',
    addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    quantity: 'Quantity',
    description: 'Description',
    reviews: 'Reviews',
    viewAll: 'View all',
    // Checkout
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    placeOrder: 'Place Order',
    orderConfirmed: 'Order Confirmed',
    // Auth
    login: 'Login',
    register: 'Register',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noResults: 'No results found',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close'
  },
  hi: {
    // Account & User
    customerDetails: 'ग्राहक विवरण',
    name: 'नाम',
    email: 'ईमेल',
    phone: 'फोन',
    contact: 'संपर्क',
    address: 'पता',
    edit: 'संपादित करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    village: 'गांव/शहर',
    po: 'डाकघर',
    ps: 'पुलिस स्टेशन',
    district: 'जिला',
    pin: 'पिन कोड',
    landmark: 'स्थान चिन्ह',
    mobile: 'मोबाइल नंबर',
    customerSupport: 'ग्राहक सहायता',
    callNow: 'अभी कॉल करें',
    chat: 'चैट',
    logout: 'लॉगआउट',
    profilePhoto: 'प्रोफ़ाइल फ़ोटो',
    viewOrders: 'ऑर्डर देखें',
    recentlyViewed: 'हाल ही में देखा गया',
    clear: 'स्पष्ट',
    noRecentItems: 'कोई हाल की वस्तु नहीं',
    change: 'बदलें',
    savingAddress: 'सहेज रहे हैं...',
    saveAddress: 'पता सहेजें',
    language: 'भाषा',
    // Home & Navigation
    home: 'होम',
    search: 'खोजें',
    cart: 'कार्ट',
    account: 'खाता',
    wishlist: 'विशलिस्ट',
    orders: 'ऑर्डर',
    // Products
    products: 'उत्पाद',
    featuredProducts: 'विशेष उत्पाद',
    price: 'कीमत',
    rating: 'रेटिंग',
    inStock: 'स्टॉक में',
    outOfStock: 'स्टॉक से बाहर',
    addToCart: 'कार्ट में जोड़ें',
    add: 'जोड़ें',
    buy: 'खरीदें',
    addToWishlist: 'विशलिस्ट में जोड़ें',
    removeFromWishlist: 'विशलिस्ट से हटाएं',
    quantity: 'मात्रा',
    description: 'विवरण',
    reviews: 'समीक्षा',
    viewAll: 'सभी देखें',
    // Checkout
    checkout: 'चेकआउट',
    subtotal: 'उप कुल',
    shipping: 'शिपिंग',
    total: 'कुल',
    placeOrder: 'ऑर्डर देते हैं',
    orderConfirmed: 'ऑर्डर की पुष्टि',
    // Auth
    login: 'लॉगिन',
    register: 'रजिस्टर करें',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    dontHaveAccount: 'खाता नहीं है?',
    alreadyHaveAccount: 'पहले से खाता है?',
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    noResults: 'कोई परिणाम नहीं',
    delete: 'हटाएं',
    confirm: 'पुष्टि करें',
    close: 'बंद करें'
  },
  bn: {
    // Account & User
    customerDetails: 'গ্রাহক বিবরণ',
    name: 'নাম',
    email: 'ইমেইল',
    phone: 'ফোন',
    contact: 'যোগাযোগ',
    address: 'ঠিকানা',
    edit: 'সম্পাদনা করুন',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল করুন',
    village: 'গ্রাম/শহর',
    po: 'পোস্ট অফিস',
    ps: 'পুলিশ স্টেশন',
    district: 'জেলা',
    pin: 'পিন কোড',
    landmark: 'ল্যান্ডমার্ক',
    mobile: 'মোবাইল নম্বর',
    customerSupport: 'গ্রাহক সহায়তা',
    callNow: 'এখনই কল করুন',
    chat: 'চ্যাট',
    logout: 'লগ আউট',
    profilePhoto: 'প্রোফাইল ফটো',
    viewOrders: 'অর্ডার দেখুন',
    recentlyViewed: 'সম্প্রতি দেখা হয়েছে',
    clear: 'মুছে ফেলুন',
    noRecentItems: 'কোন সম্প্রতি আইটেম নেই',
    change: 'পরিবর্তন করুন',
    savingAddress: 'সংরক্ষণ করা হচ্ছে...',
    saveAddress: 'ঠিকানা সংরক্ষণ করুন',
    language: 'ভাষা',
    // Home & Navigation
    home: 'হোম',
    search: 'অনুসন্ধান',
    cart: 'কার্ট',
    account: 'অ্যাকাউন্ট',
    wishlist: 'উইশলিস্ট',
    orders: 'অর্ডার',
    // Products
    products: 'পণ্য',
    featuredProducts: 'বৈশিষ্ট্যযুক্ত পণ্য',
    price: 'মূল্য',
    rating: 'রেটিং',
    inStock: 'স্টকে আছে',
    outOfStock: 'স্টক শেষ',
    addToCart: 'কার্টে যোগ করুন',
    add: 'যোগ করুন',
    buy: 'কিনুন',
    addToWishlist: 'উইশলিস্টে যোগ করুন',
    removeFromWishlist: 'উইশলিস্ট থেকে সরান',
    quantity: 'পরিমাণ',
    description: 'বর্ণনা',
    reviews: 'পর্যালোচনা',
    viewAll: 'সবগুলি দেখুন',
    // Checkout
    checkout: 'চেকআউট',
    subtotal: 'উপ-মোট',
    shipping: 'শিপিং',
    total: 'মোট',
    placeOrder: 'অর্ডার দিন',
    orderConfirmed: 'অর্ডার নিশ্চিত',
    // Auth
    login: 'লগইন',
    register: 'নিবন্ধন করুন',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    dontHaveAccount: 'অ্যাকাউন্ট নেই?',
    alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    // Common
    loading: 'লোড হচ্ছে...',
    error: 'ত্রুটি',
    success: 'সফল',
    noResults: 'কোন ফলাফল নেই',
    delete: 'মুছুন',
    confirm: 'নিশ্চিত করুন',
    close: 'বন্ধ করুন'
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
