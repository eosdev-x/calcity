import { getBearerToken, getSupabaseAdmin, jsonResponse, StripeEnv } from '../stripe/_shared';

export async function verifyAdmin(request: Request, env: StripeEnv) {
  const supabase = getSupabaseAdmin(env);
  const token = getBearerToken(request);
  if (!token) return { error: jsonResponse({ error: 'Unauthorized' }, 401) };

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return { error: jsonResponse({ error: 'Unauthorized' }, 401) };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') return { error: jsonResponse({ error: 'Forbidden' }, 403) };

  return { user, supabase };
}

export { jsonResponse, StripeEnv } from '../stripe/_shared';
