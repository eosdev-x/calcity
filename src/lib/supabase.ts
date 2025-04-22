import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// These environment variables should be set in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log warning if credentials are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase credentials. Authentication features will not work properly. Please check your environment variables.');
}

// Create Supabase client with credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
