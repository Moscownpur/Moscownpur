import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-ai': ['@google/genai'],
          'vendor-utils': ['uuid', 'bcryptjs'],
          'vendor-toast': ['react-hot-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'react-hook-form',
      '@hookform/resolvers',
      'yup',
      '@supabase/supabase-js',
      'react-hot-toast',
    ],
    exclude: ['@google/genai'], // Exclude AI library from pre-bundling
  },
});
