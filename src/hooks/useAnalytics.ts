import { useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useAnalytics() {
  const trackView = useCallback(async (businessId: string) => {
    try {
      await supabase.from('analytics_events').insert({
        business_id: businessId,
        event_type: 'view',
        created_at: new Date().toISOString(),
      });
    } catch {
      return;
    }
  }, []);

  return { trackView };
}
