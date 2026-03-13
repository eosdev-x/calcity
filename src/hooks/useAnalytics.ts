import { useCallback } from 'react';
import { supabase } from '../lib/supabase';

const VIEWED_KEY = 'calcity_viewed_businesses';

function getViewedIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(VIEWED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markViewed(id: string) {
  const viewed = getViewedIds();
  viewed.add(id);
  try {
    sessionStorage.setItem(VIEWED_KEY, JSON.stringify([...viewed]));
  } catch {
    // sessionStorage full or unavailable — ignore
  }
}

export function useAnalytics() {
  const trackView = useCallback(async (businessId: string) => {
    if (getViewedIds().has(businessId)) return;
    markViewed(businessId);

    const { error } = await supabase.from('analytics_events').insert({
      business_id: businessId,
      event_type: 'view',
    });
    if (error) {
      // Fire-and-forget: log but don't throw
    }
  }, []);

  return { trackView };
}
