import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // For Cloudflare Pages: Create a _headers file to ensure CORS is properly handled
  if (mode === 'production') {
    try {
      writeFileSync('./public/_headers', `/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
`);
      console.log('Created _headers file for Cloudflare Pages');
    } catch (error) {
      console.error('Error creating _headers file:', error);
    }
  }
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    // Base path for assets - use '/' for Cloudflare Pages
    base: '/',
    // Define env variables to be exposed to the client
    define: {
      // Expose specific environment variables to the client
      // This ensures Cloudflare environment variables are properly handled
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || 'https://qbuhadgmvrwquufqhmrz.supabase.co'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
    },
    build: {
      // Output directory - Cloudflare Pages looks for this
      outDir: 'dist',
      // Generate sourcemaps for better debugging
      sourcemap: true,
      // Rollup options
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code into separate chunks
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'supabase': ['@supabase/supabase-js']
          }
        }
      }
    },
  };
});
