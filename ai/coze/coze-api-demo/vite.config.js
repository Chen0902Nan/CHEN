const { defineConfig } = require('vite')

module.exports = defineConfig({
  root: '.',
  server: {
    host: true,
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
