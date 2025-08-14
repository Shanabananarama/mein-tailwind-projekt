// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // wichtig für GitHub Project Pages unter /mein-tailwind-projekt/
  base: '/mein-tailwind-projekt/',
  plugins: [react()],
  build: {
    // Vite-Standard, hier explizit gesetzt für GitHub Actions
    outDir: 'dist',
    sourcemap: true
  }
})
