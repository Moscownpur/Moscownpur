// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { visualizer } from "file:///home/project/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          // Split UI libraries for better tree shaking
          "vendor-framer": ["framer-motion"],
          "vendor-lucide": ["lucide-react"],
          // Form libraries
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "yup"],
          // Backend libraries
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-ai": ["@google/genai"],
          // Utility libraries
          "vendor-utils": ["uuid", "bcryptjs"],
          "vendor-toast": ["react-hot-toast"]
        }
      }
    },
    chunkSizeWarningLimit: 500,
    // Reduced warning limit
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"]
      }
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js"
    ],
    exclude: [
      "@google/genai",
      "framer-motion",
      "lucide-react",
      "react-hook-form",
      "@hookform/resolvers",
      "yup",
      "uuid",
      "bcryptjs",
      "react-hot-toast"
    ],
    esbuildOptions: {
      target: "es2020"
    }
  },
  esbuild: {
    drop: ["console", "debugger"]
    // Remove console and debugger in production
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgZmlsZW5hbWU6ICdkaXN0L3N0YXRzLmh0bWwnLFxuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgLy8gQ29yZSBSZWFjdCBsaWJyYXJpZXNcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAndmVuZG9yLXJvdXRlcic6IFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIFxuICAgICAgICAgIC8vIFNwbGl0IFVJIGxpYnJhcmllcyBmb3IgYmV0dGVyIHRyZWUgc2hha2luZ1xuICAgICAgICAgICd2ZW5kb3ItZnJhbWVyJzogWydmcmFtZXItbW90aW9uJ10sXG4gICAgICAgICAgJ3ZlbmRvci1sdWNpZGUnOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICAgICAgICAgIFxuICAgICAgICAgIC8vIEZvcm0gbGlicmFyaWVzXG4gICAgICAgICAgJ3ZlbmRvci1mb3Jtcyc6IFsncmVhY3QtaG9vay1mb3JtJywgJ0Bob29rZm9ybS9yZXNvbHZlcnMnLCAneXVwJ10sXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQmFja2VuZCBsaWJyYXJpZXNcbiAgICAgICAgICAndmVuZG9yLXN1cGFiYXNlJzogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgICAndmVuZG9yLWFpJzogWydAZ29vZ2xlL2dlbmFpJ10sXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gVXRpbGl0eSBsaWJyYXJpZXNcbiAgICAgICAgICAndmVuZG9yLXV0aWxzJzogWyd1dWlkJywgJ2JjcnlwdGpzJ10sXG4gICAgICAgICAgJ3ZlbmRvci10b2FzdCc6IFsncmVhY3QtaG90LXRvYXN0J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAsIC8vIFJlZHVjZWQgd2FybmluZyBsaW1pdFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLmRlYnVnJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdyZWFjdCcsXG4gICAgICAncmVhY3QtZG9tJyxcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnLFxuICAgIF0sXG4gICAgZXhjbHVkZTogW1xuICAgICAgJ0Bnb29nbGUvZ2VuYWknLFxuICAgICAgJ2ZyYW1lci1tb3Rpb24nLFxuICAgICAgJ2x1Y2lkZS1yZWFjdCcsXG4gICAgICAncmVhY3QtaG9vay1mb3JtJyxcbiAgICAgICdAaG9va2Zvcm0vcmVzb2x2ZXJzJyxcbiAgICAgICd5dXAnLFxuICAgICAgJ3V1aWQnLFxuICAgICAgJ2JjcnlwdGpzJyxcbiAgICAgICdyZWFjdC1ob3QtdG9hc3QnLFxuICAgIF0sXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgfSxcbiAgfSxcbiAgZXNidWlsZDoge1xuICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLCAvLyBSZW1vdmUgY29uc29sZSBhbmQgZGVidWdnZXIgaW4gcHJvZHVjdGlvblxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixTQUFTLGtCQUFrQjtBQUczQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsTUFDVCxVQUFVO0FBQUEsTUFDVixNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsSUFDZCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBO0FBQUEsVUFFWixnQkFBZ0IsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUNyQyxpQkFBaUIsQ0FBQyxrQkFBa0I7QUFBQTtBQUFBLFVBR3BDLGlCQUFpQixDQUFDLGVBQWU7QUFBQSxVQUNqQyxpQkFBaUIsQ0FBQyxjQUFjO0FBQUE7QUFBQSxVQUdoQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsdUJBQXVCLEtBQUs7QUFBQTtBQUFBLFVBR2hFLG1CQUFtQixDQUFDLHVCQUF1QjtBQUFBLFVBQzNDLGFBQWEsQ0FBQyxlQUFlO0FBQUE7QUFBQSxVQUc3QixnQkFBZ0IsQ0FBQyxRQUFRLFVBQVU7QUFBQSxVQUNuQyxnQkFBZ0IsQ0FBQyxpQkFBaUI7QUFBQSxRQUNwQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQTtBQUFBLElBQ3ZCLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxRQUNmLFlBQVksQ0FBQyxlQUFlLGdCQUFnQixlQUFlO0FBQUEsTUFDN0Q7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQTtBQUFBLEVBQzlCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
