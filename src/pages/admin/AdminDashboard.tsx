import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CalendarDays, Clock, Users, ClipboardCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminStats {
  totalBusinesses: number;
  totalEvents: number;
  pendingBusinesses: number;
  pendingEvents: number;
  totalUsers: number;
}

const initialStats: AdminStats = {
  totalBusinesses: 0,
  totalEvents: 0,
  pendingBusinesses: 0,
  pendingEvents: 0,
  totalUsers: 0,
};

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      const [
        totalBusinesses,
        totalEvents,
        pendingBusinesses,
        pendingEvents,
        totalUsers,
      ] = await Promise.all([
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase
          .from('businesses')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('events')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

      if (!isMounted) return;

      const firstError =
        totalBusinesses.error ||
        totalEvents.error ||
        pendingBusinesses.error ||
        pendingEvents.error ||
        totalUsers.error;

      if (firstError) {
        setError(firstError.message || 'Failed to load admin stats');
        setLoading(false);
        return;
      }

      setStats({
        totalBusinesses: totalBusinesses.count ?? 0,
        totalEvents: totalEvents.count ?? 0,
        pendingBusinesses: pendingBusinesses.count ?? 0,
        pendingEvents: pendingEvents.count ?? 0,
        totalUsers: totalUsers.count ?? 0,
      });
      setLoading(false);
    };

    void fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: 'Total Businesses',
        value: stats.totalBusinesses,
        icon: Building2,
      },
      {
        label: 'Total Events',
        value: stats.totalEvents,
        icon: CalendarDays,
      },
      {
        label: 'Pending Businesses',
        value: stats.pendingBusinesses,
        icon: Clock,
      },
      {
        label: 'Pending Events',
        value: stats.pendingEvents,
        icon: ClipboardCheck,
      },
      {
        label: 'Total Users',
        value: stats.totalUsers,
        icon: Users,
      },
    ],
    [stats]
  );

  const quickActions = [
    {
      title: 'Approve Businesses',
      description: 'Review and approve pending business listings.',
      to: '/admin/businesses',
      icon: Building2,
    },
    {
      title: 'Approve Events',
      description: 'Review and approve pending events submissions.',
      to: '/admin/events',
      icon: CalendarDays,
    },
    {
      title: 'User Management',
      description: 'View and audit all platform users.',
      to: '/admin/users',
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 bg-surface-container-high rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="card h-24" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card h-28" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-on-surface">Admin Dashboard</h1>
            <p className="text-on-surface-variant">Monitor CalCity approvals and activity.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">{card.label}</p>
                  <p className="text-2xl font-semibold text-on-surface">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.to}
                className="card hover:shadow-md transition-shadow duration-[var(--md-sys-motion-duration-medium2)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-on-surface">{action.title}</h2>
                    <p className="text-sm text-on-surface-variant">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
