import { defineConfig } from 'vite'

export default defineConfig({
  base: '/mein-tailwind-projekt/', // wichtig für GitHub Pages
  build: {
    outDir: 'dist'
  }
})
