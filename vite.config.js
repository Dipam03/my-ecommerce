import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  // Allow overriding base path via VITE_BASE so builds can target repo pages
  // or a custom domain. Default to root to avoid hardcoded repo names.
  base: process.env.VITE_BASE || '/',
=======
  base: process.env.VITE_BASE || '/my-ecommerce/', // Allow override via env; default to repo path
>>>>>>> 88f6fb90929876ee7dd6252c7c66dfddd57adfd7
})
