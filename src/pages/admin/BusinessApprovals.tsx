import { useEffect, useMemo, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Business } from '../../types/business';
import { getAccessToken } from '../../utils/auth';

interface BusinessOwner {
  email: string | null;
  full_name: string | null;
}

type PendingBusiness = Business & { profiles?: BusinessOwner | null };

export function BusinessApprovals() {
  const { session } = useAuth();
  const [businesses, setBusinesses] = useState<PendingBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*, profiles!owner_id(email, full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message || 'Failed to load pending businesses');
        setBusinesses([]);
      } else {
        setBusinesses((data as PendingBusiness[]) || []);
      }
      setLoading(false);
    };

    void fetchBusinesses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = async (businessId: string, action: 'approve' | 'reject') => {
    const reason = rejectionReasons[businessId]?.trim();

    if (action === 'reject' && !reason) {
      setActionErrors(prev => ({
        ...prev,
        [businessId]: 'Please provide a rejection reason.',
      }));
      return;
    }

    setActionLoading(prev => ({ ...prev, [businessId]: true }));
    setActionErrors(prev => ({ ...prev, [businessId]: '' }));

    const previous = businesses;
    setBusinesses(prev => prev.filter(business => business.id !== businessId));

    try {
      const token = await getAccessToken(session?.access_token);
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/admin/approve-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId,
          action,
          reason: action === 'reject' ? reason : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.error) {
        const message = payload?.error || 'Failed to update business';
        throw new Error(typeof message === 'string' ? message : 'Failed to update business');
      }

      setRejectionReasons(prev => {
        const next = { ...prev };
        delete next[businessId];
        return next;
      });
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
        submittedDate: new Date(business.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        ownerName: business.profiles?.full_name || 'Unknown owner',
        ownerEmail: business.profiles?.email || 'No email provided',
      })),
    [businesses]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-on-surface-variant animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant">Loading pending businesses...</p>
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
            <h1 className="text-3xl font-semibold text-on-surface">Business Approvals</h1>
            <p className="text-on-surface-variant">Review and approve pending business listings.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
            {error}
          </div>
        )}

        {formattedBusinesses.length === 0 ? (
          <div className="card text-center text-on-surface-variant">
            No pending businesses 🎉
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {formattedBusinesses.map(business => (
              <div key={business.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-on-surface mb-1">{business.name}</h2>
                    <p className="text-sm text-on-surface-variant mb-4">
                      Submitted {business.submittedDate}
                    </p>
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

                  <div className="w-full md:w-80 space-y-3">
                    <input
                      type="text"
                      placeholder="Rejection reason"
                      value={rejectionReasons[business.id] || ''}
                      onChange={(event) =>
                        setRejectionReasons(prev => ({
                          ...prev,
                          [business.id]: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-outline bg-surface px-4 py-3 text-sm text-on-surface"
                    />

                    {actionErrors[business.id] && (
                      <div className="rounded-xl border border-error bg-error-container p-3 text-on-error-container text-xs">
                        {actionErrors[business.id]}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => handleAction(business.id, 'approve')}
                        className="btn-primary flex items-center justify-center gap-2"
                        disabled={actionLoading[business.id]}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(business.id, 'reject')}
                        className="rounded-full px-4 py-2 font-medium border border-error text-error hover:bg-error-container transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                        disabled={actionLoading[business.id]}
                      >
                        <span className="inline-flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </span>
                      </button>
                    </div>
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
