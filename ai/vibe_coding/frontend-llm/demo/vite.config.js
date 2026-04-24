import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  envDir: '.',
  envPrefix: 'VITE_'
})