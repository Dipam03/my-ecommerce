import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.url)
  return {
    plugins: [react()],
    // Allow overriding base path via VITE_BASE so builds can target repo pages
    // or a custom domain. Default to '/' for local development, '/my-ecommerce/' for production.
    base: env.VITE_BASE || (mode === 'production' ? '/my-ecommerce/' : '/'),
  }
})
