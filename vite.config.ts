import path from "path";
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: './client',
  server: {
    port: 5173,
  },
  plugins: [
      react(),
      tailwindcss(),
  ],
  resolve: {
      alias: {
          "@": path.resolve(__dirname, "./client/src"),
          "@shared": path.resolve(__dirname, "./shared"),
      },
  },
})
