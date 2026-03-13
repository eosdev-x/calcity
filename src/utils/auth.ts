import { supabase } from '../lib/supabase';

export async function getAccessToken(sessionToken?: string | null): Promise<string | null> {
  if (sessionToken) return sessionToken;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}
