import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // barcha tashqi ulanishlarga ruxsat
    allowedHosts: ['.ngrok-free.app'], // ngrok domenlarga ruxsat berish
  },
})
