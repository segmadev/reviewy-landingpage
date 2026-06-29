import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': {
        target: 'https://reviewyme-marketplace-yalzf.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/product': {
        target: 'https://reviewyme-marketplace-yalzf.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/resume': {
        target: 'https://reviewyme-marketplace-yalzf.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/payment': {
        target: 'https://reviewyme-marketplace-yalzf.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
      '/notification': {
        target: 'https://reviewyme-marketplace-yalzf.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
})
