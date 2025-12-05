import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow overriding base path via VITE_BASE so the build can target
  // a project page (`/crody-react/`) or a custom domain (`/`).
  base: process.env.VITE_BASE || '/crody-react/',
})
