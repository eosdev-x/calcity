import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Business } from '../../types/business';
import { useBusinessPermissions } from '../../hooks/useBusinessPermissions';
import { Link } from 'react-router-dom';

type AnalyticsDashboardProps = {
  business: Business;
};

type RangeOption = '7d' | '30d' | '90d';

type AnalyticsEvent = {
  id: string;
  created_at: string;
};

const rangeOptions: { id: RangeOption; label: string; days: number }[] = [
  { id: '7d', label: '7d', days: 7 },
  { id: '30d', label: '30d', days: 30 },
  { id: '90d', label: '90d', days: 90 },
];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function AnalyticsDashboard({ business }: AnalyticsDashboardProps) {
  const permissions = useBusinessPermissions(business.subscription_tier);
  const [activeRange, setActiveRange] = useState<RangeOption>('30d');
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const rangeDays = useMemo(() => {
    return rangeOptions.find(option => option.id === activeRange)?.days ?? 30;
  }, [activeRange]);

  useEffect(() => {
    if (!permissions.isSpotlight) return;
    let isMounted = true;

    const fetchTotals = async () => {
      const { count } = await supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('event_type', 'view');

      if (isMounted) {
        setTotalViews(count ?? 0);
      }
    };

    void fetchTotals();

    return () => {
      isMounted = false;
    };
  }, [business.id, permissions.isSpotlight]);

  useEffect(() => {
    if (!permissions.isSpotlight) return;

    let isMounted = true;
    const fetchEvents = async () => {
      setIsLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (rangeDays - 1));

      const { data, error } = await supabase
        .from('analytics_events')
        .select('id, created_at')
        .eq('business_id', business.id)
        .eq('event_type', 'view')
        .gte('created_at', startDate.toISOString());

      if (!isMounted) return;

      if (error) {
        setEvents([]);
      } else {
        setEvents((data as AnalyticsEvent[]) || []);
      }
      setIsLoading(false);
    };

    void fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [business.id, permissions.isSpotlight, rangeDays]);

  const chartData = useMemo(() => {
    const today = new Date();
    const dates = Array.from({ length: rangeDays }, (_, index) => {
      const date = new Date();
      date.setDate(today.getDate() - (rangeDays - 1 - index));
      return date;
    });

    const counts = new Map<string, number>();
    events.forEach(event => {
      const eventDate = new Date(event.created_at);
      const key = dateKey(eventDate);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return dates.map(date => {
      const key = dateKey(date);
      return {
        label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        count: counts.get(key) || 0,
      };
    });
  }, [events, rangeDays]);

  const maxCount = Math.max(...chartData.map(item => item.count), 1);
  const labelStride = rangeDays <= 10 ? 1 : rangeDays <= 30 ? 5 : 10;

  if (!permissions.isSpotlight) {
    return (
      <div className="card text-center">
        <Sparkles className="w-8 h-8 text-tertiary mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-on-surface mb-2">Unlock Spotlight Analytics</h3>
        <p className="text-sm text-on-surface-variant mb-4">
          Upgrade to Spotlight to view insights about your business performance.
        </p>
        <Link to="/pricing" className="btn-primary inline-flex">
          Upgrade to Spotlight
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-on-surface">Analytics</h3>
          <p className="text-sm text-on-surface-variant">
            Monitor your listing traffic over time.
          </p>
        </div>
        <div className="flex gap-2">
          {rangeOptions.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveRange(option.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeRange === option.id
                  ? 'bg-primary text-on-primary border-primary'
                  : 'border-outline-variant text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm text-on-surface-variant">Total Views</p>
          <p className="text-3xl font-semibold text-on-surface mt-2">{totalViews}</p>
        </div>
        <div className="card">
          <p className="text-sm text-on-surface-variant">This Period Views</p>
          <p className="text-3xl font-semibold text-on-surface mt-2">{events.length}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-on-surface">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Views by Day</span>
          </div>
          {isLoading && <span className="text-sm text-on-surface-variant">Loading...</span>}
        </div>
        <div className="h-48 flex items-end gap-2">
          {chartData.map((item, index) => {
            const height = `${(item.count / maxCount) * 100}%`;
            const showLabel = index % labelStride === 0 || index === chartData.length - 1;
            return (
              <div key={`${item.label}-${index}`} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t-md bg-primary-container"
                  style={{ height }}
                />
                <span className="mt-2 text-[10px] text-on-surface-variant">
                  {showLabel ? item.label : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full bg-tertiary-container px-3 py-1 text-xs font-semibold text-on-tertiary-container">
        Powered by your Spotlight plan
      </div>
    </div>
  );
}
