import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 1200,
    proxy: {
      '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
      }
    },
    watch: {
      usePolling: true
    }
  }
})
