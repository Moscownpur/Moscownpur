import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    sourcemap: true, // Enable source maps for better debugging
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          
          // Split UI libraries for better tree shaking
          'vendor-framer': ['framer-motion'],
          'vendor-lucide': ['lucide-react'],
          
          // Form libraries
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          
          // Backend libraries
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-ai': ['@google/genai'],
          
          // Utility libraries
          'vendor-utils': ['uuid', 'bcryptjs'],
          'vendor-toast': ['react-hot-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 500, // Reduced warning limit
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
    ],
    exclude: [
      '@google/genai',
      'framer-motion',
      'lucide-react',
      'react-hook-form',
      '@hookform/resolvers',
      'yup',
      'uuid',
      'bcryptjs',
      'react-hot-toast',
    ],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  esbuild: {
    drop: ['console', 'debugger'], // Remove console and debugger in production
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
