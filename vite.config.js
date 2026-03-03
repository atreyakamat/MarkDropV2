import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        dashboard: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background/service_worker.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background' ? '[name].js' : 'assets/[name]-[hash].js';
        },
      },
    },
  },
});
