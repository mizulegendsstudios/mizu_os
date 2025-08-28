import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/mizu_os/',  // 🔥 Requerido para GitHub Pages
  publicDir: 'public', // ✅ Estándar: assets estáticos (favicon, etc)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    host: true
  },
  preview: {
    port: 8080,
    open: true
  },
  optimizeDeps: {
    include: []
  }
});
