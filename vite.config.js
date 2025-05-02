import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait()
  ],
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
    include: [
      '@electric-sql/pglite > pglite/dist/pglite.wasm'
    ]
  },
  server: {
    fs: {
      allow: ['..'] // Allow accessing parent directories
    }
  },
  build: {
    target: 'esnext'
  }
});