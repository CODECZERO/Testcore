import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['react-redux', '@reduxjs/toolkit'],
          'vendor-query': ['react-query', 'axios'],
          'vendor-ui': ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    // Increase warning limit slightly since we're code-splitting
    chunkSizeWarningLimit: 600,
  },
})
