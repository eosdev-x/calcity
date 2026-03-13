import { supabase } from '../lib/supabase';

export const getPrimaryBusinessIdForOwner = async (ownerId: string) => {
  const { data, error } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) {
    throw error;
  }

  return data?.[0]?.id || null;
};
