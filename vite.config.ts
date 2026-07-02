import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Proxy API calls through the dev server so the browser stays same-origin
  // (the backend doesn't send CORS headers for localhost).
  server: {
    proxy: {
      '/api': {
        target: 'https://task-management-backend-qb4d.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
