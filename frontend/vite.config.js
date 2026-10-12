import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5005' // Vite forwards the request behind the scenes
    }
  },
  plugins: [svelte()],
})
