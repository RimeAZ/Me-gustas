import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base relativo para que funcione bien en Surge.sh y subdirectorios
  base: './',
})
