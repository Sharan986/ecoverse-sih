import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Three.js into its own chunk
          'three': ['three'],
          // Separate React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separate UI libraries
          'ui-vendor': ['lucide-react', '@radix-ui/react-tabs', '@radix-ui/react-dialog'],
          // Separate Firebase
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        }
      }
    },
    // Increase chunk size warning limit to 1000kb since we know about Three.js
    chunkSizeWarningLimit: 1000,
  },
  // Handle SPA routing for production
  preview: {
    port: 5173,
  },
  // Ensure proper base path
  base: './',
}));
