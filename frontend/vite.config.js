// vite.config.js
// Vite is our build tool — like a fast compiler for React
// We add Tailwind as a plugin here

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Enables Tailwind CSS in our project
  ],
})