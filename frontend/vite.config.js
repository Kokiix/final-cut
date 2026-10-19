import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5005", // Vite forwards the request behind the scenes
    },
  },
  plugins: [tailwindcss(), svelte()],
});
