import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, PauseCircle, PlayCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Business } from '../../types/business';
import { getAccessToken } from '../../utils/auth';
import { SEO } from '../../components/SEO';
import { siteConfig } from '../../config/site';

interface BusinessOwner {
  email: string | null;
  full_name: string | null;
}

type AdminBusiness = Business & { profiles?: BusinessOwner | null };

type StatusFilter = 'all' | 'active' | 'suspended' | 'pending' | 'archived';

type ManageAction = 'suspend' | 'unsuspend' | 'delete';

const statusBadgeStyles: Record<Business['status'], string> = {
  active: 'bg-tertiary text-on-tertiary',
  suspended: 'bg-tertiary-container text-on-tertiary-container',
  pending: 'border border-outline text-on-surface-variant bg-surface',
  archived: 'bg-surface-container-high text-on-surface-variant',
  rejected: 'bg-error-container text-on-error-container',
};

const statusLabels: Record<Business['status'], string> = {
  active: 'Active',
  suspended: 'Suspended',
  pending: 'Pending',
  archived: 'Archived',
  rejected: 'Rejected',
};

const filters: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Pending', value: 'pending' },
  { label: 'Archived', value: 'archived' },
];

export function ManageBusinesses() {
  const { session } = useAuth();
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    let isMounted = true;

    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*, profiles!owner_id(email, full_name)')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message || 'Failed to load businesses');
        setBusinesses([]);
      } else {
        setBusinesses((data as AdminBusiness[]) || []);
      }
      setLoading(false);
    };

    void fetchBusinesses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = async (businessId: string, action: ManageAction) => {
    if (action === 'delete') {
      const confirmed = window.confirm('Remove this business permanently?');
      if (!confirmed) return;
    }

    setActionLoading(prev => ({ ...prev, [businessId]: true }));
    setActionErrors(prev => ({ ...prev, [businessId]: '' }));

    const previous = businesses;
    setBusinesses(prev => {
      if (action === 'delete') {
        return prev.filter(business => business.id !== businessId);
      }
      return prev.map(business =>
        business.id === businessId
          ? { ...business, status: action === 'suspend' ? 'suspended' : 'active' }
          : business
      );
    });

    try {
      const token = await getAccessToken(session?.access_token);
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/admin/manage-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ businessId, action }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.error) {
        const message = payload?.error || 'Failed to update business';
        throw new Error(typeof message === 'string' ? message : 'Failed to update business');
      }
    } catch (err) {
      setBusinesses(previous);
      const message = err instanceof Error ? err.message : 'Failed to update business';
      setActionErrors(prev => ({ ...prev, [businessId]: message }));
    } finally {
      setActionLoading(prev => ({ ...prev, [businessId]: false }));
    }
  };

  const formattedBusinesses = useMemo(
    () =>
      businesses.map(business => ({
        ...business,
        ownerName: business.profiles?.full_name || 'Unknown owner',
        ownerEmail: business.profiles?.email || 'No email provided',
        tierLabel: business.subscription_tier
          ? business.subscription_tier.charAt(0).toUpperCase() + business.subscription_tier.slice(1)
          : 'Unknown',
      })),
    [businesses]
  );

  const filteredBusinesses = useMemo(() => {
    if (filter === 'all') return formattedBusinesses;
    return formattedBusinesses.filter(business => business.status === filter);
  }, [filter, formattedBusinesses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <SEO
          title={siteConfig.seo.pages.adminTitle}
          path="/admin/manage-businesses"
          noindex
        />
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-on-surface-variant animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant">Loading businesses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.adminTitle}
        path="/admin/manage-businesses"
        noindex
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-on-surface">Manage Businesses</h1>
            <p className="text-on-surface-variant">Pause, resume, or remove business listings.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          {filters.map(filterOption => {
            const isActive = filterOption.value === filter;
            return (
              <button
                key={filterOption.value}
                type="button"
                onClick={() => setFilter(filterOption.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-[var(--md-sys-motion-duration-short3)] ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {filterOption.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
            {error}
          </div>
        )}

        {filteredBusinesses.length === 0 ? (
          <div className="card text-center text-on-surface-variant">
            No businesses match this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredBusinesses.map(business => (
              <div key={business.id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h2 className="text-xl font-semibold text-on-surface">{business.name}</h2>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusBadgeStyles[business.status]
                        }`}
                      >
                        {statusLabels[business.status]}
                      </span>
                      <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-secondary-container text-on-secondary-container">
                        {business.tierLabel}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-on-surface-variant">
                      <p>
                        <span className="text-on-surface">Owner:</span> {business.ownerName} ({business.ownerEmail})
                      </p>
                      <p>
                        <span className="text-on-surface">Category:</span> {business.category}
                      </p>
                      <p>
                        <span className="text-on-surface">Address:</span> {business.address}
                      </p>
                    </div>
                  </div>

                  <div className="w-full lg:w-72 space-y-3">
                    {actionErrors[business.id] && (
                      <div className="rounded-xl border border-error bg-error-container p-3 text-on-error-container text-xs">
                        {actionErrors[business.id]}
                      </div>
                    )}

                    {business.status === 'active' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => handleAction(business.id, 'suspend')}
                          className="btn-outline flex items-center justify-center gap-2"
                          disabled={actionLoading[business.id]}
                        >
                          <PauseCircle className="w-4 h-4" />
                          Pause
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(business.id, 'delete')}
                          className="rounded-full px-4 py-2 font-medium border border-error text-error hover:bg-error-container transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                          disabled={actionLoading[business.id]}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </span>
                        </button>
                      </div>
                    )}

                    {business.status === 'suspended' && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => handleAction(business.id, 'unsuspend')}
                          className="btn-primary flex items-center justify-center gap-2"
                          disabled={actionLoading[business.id]}
                        >
                          <PlayCircle className="w-4 h-4" />
                          Unpause
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(business.id, 'delete')}
                          className="rounded-full px-4 py-2 font-medium border border-error text-error hover:bg-error-container transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                          disabled={actionLoading[business.id]}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </span>
                        </button>
                      </div>
                    )}

                    {business.status === 'pending' && (
                      <Link
                        to="/admin/businesses"
                        className="btn-secondary flex items-center justify-center gap-2"
                      >
                        Review pending
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
