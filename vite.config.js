import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow overriding base path via VITE_BASE so builds can target repo pages
  // or a custom domain. Default to root to avoid hardcoded repo names.
  base: process.env.VITE_BASE || '/',
})
