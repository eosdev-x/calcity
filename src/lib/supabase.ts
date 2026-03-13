import { createClient } from '@supabase/supabase-js';

// Check for Cloudflare environment variables
const getSupabaseUrl = () => {
  // First try to get from import.meta.env (Vite)
  if (import.meta.env.VITE_SUPABASE_URL) {
    return import.meta.env.VITE_SUPABASE_URL;
  }
  // Then try to get from window.env (Cloudflare Pages)
  if (typeof window !== 'undefined' && window.env && window.env.VITE_SUPABASE_URL) {
    return window.env.VITE_SUPABASE_URL;
  }
  // Fallback to hardcoded value
  return 'https://mbazrezahuojknfgcwou.supabase.co';
};

const getSupabaseAnonKey = () => {
  // First try to get from import.meta.env (Vite)
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  // Then try to get from window.env (Cloudflare Pages)
  if (typeof window !== 'undefined' && window.env && window.env.VITE_SUPABASE_ANON_KEY) {
    return window.env.VITE_SUPABASE_ANON_KEY;
  }
  // Fallback to empty string
  return 'sb_publishable_98WQlIzjiBwD9soSjB9QgA_54OZ72T9';
};

// Initialize Supabase client
const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Validate Supabase credentials
if (!supabaseUrl) {
  console.error('Missing Supabase URL. Authentication features will not work properly.');
}

if (!supabaseAnonKey) {
  console.error('Missing Supabase Anon Key. Authentication features will not work properly.');
}

// Create Supabase client with credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Add TypeScript interface for window.env
declare global {
  interface Window {
    env?: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  }
}
