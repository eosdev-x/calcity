import { useEffect, useMemo, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Event } from '../../types/event';
import { getAccessToken } from '../../utils/auth';
import { SEO } from '../../components/SEO';
import { siteConfig } from '../../config/site';

interface EventOrganizer {
  email: string | null;
  full_name: string | null;
}

type PendingEvent = Event & { profiles?: EventOrganizer | null };

export function EventApprovals() {
  const { session } = useAuth();
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*, profiles!organizer_id(email, full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message || 'Failed to load pending events');
        setEvents([]);
      } else {
        setEvents((data as PendingEvent[]) || []);
      }
      setLoading(false);
    };

    void fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = async (eventId: string, action: 'approve' | 'reject') => {
    const reason = rejectionReasons[eventId]?.trim();

    if (action === 'reject' && !reason) {
      setActionErrors(prev => ({
        ...prev,
        [eventId]: 'Please provide a rejection reason.',
      }));
      return;
    }

    setActionLoading(prev => ({ ...prev, [eventId]: true }));
    setActionErrors(prev => ({ ...prev, [eventId]: '' }));

    const previous = events;
    setEvents(prev => prev.filter(event => event.id !== eventId));

    try {
      const token = await getAccessToken(session?.access_token);
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/admin/approve-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          action,
          reason: action === 'reject' ? reason : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload?.error) {
        const message = payload?.error || 'Failed to update event';
        throw new Error(typeof message === 'string' ? message : 'Failed to update event');
      }

      setRejectionReasons(prev => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
    } catch (err) {
      setEvents(previous);
      const message = err instanceof Error ? err.message : 'Failed to update event';
      setActionErrors(prev => ({ ...prev, [eventId]: message }));
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const formattedEvents = useMemo(
    () =>
      events.map(event => ({
        ...event,
        eventDate: new Date(event.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        organizerName: event.profiles?.full_name || event.organizer_name || 'Unknown organizer',
        organizerEmail: event.profiles?.email || event.organizer_email || 'No email provided',
      })),
    [events]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <SEO
          title={siteConfig.seo.pages.adminTitle}
          path="/admin/events"
          noindex
        />
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-on-surface-variant animate-spin mx-auto mb-4" />
            <p className="text-on-surface-variant">Loading pending events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.adminTitle}
        path="/admin/events"
        noindex
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-on-surface">Event Approvals</h1>
            <p className="text-on-surface-variant">Review and approve pending event submissions.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
            {error}
          </div>
        )}

        {formattedEvents.length === 0 ? (
          <div className="card text-center text-on-surface-variant">
            No pending events 🎉
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {formattedEvents.map(event => (
              <div key={event.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-on-surface mb-1">{event.title}</h2>
                    <p className="text-sm text-on-surface-variant mb-4">
                      Event date {event.eventDate}
                    </p>
                    <div className="space-y-1 text-sm text-on-surface-variant">
                      <p>
                        <span className="text-on-surface">Organizer:</span> {event.organizerName} ({event.organizerEmail})
                      </p>
                      <p>
                        <span className="text-on-surface">Location:</span> {event.location}
                      </p>
                      <p>
                        <span className="text-on-surface">Category:</span> {event.category}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-80 space-y-3">
                    <input
                      type="text"
                      placeholder="Rejection reason"
                      value={rejectionReasons[event.id] || ''}
                      onChange={(eventInput) =>
                        setRejectionReasons(prev => ({
                          ...prev,
                          [event.id]: eventInput.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-outline bg-surface px-4 py-3 text-sm text-on-surface"
                    />

                    {actionErrors[event.id] && (
                      <div className="rounded-xl border border-error bg-error-container p-3 text-on-error-container text-xs">
                        {actionErrors[event.id]}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => handleAction(event.id, 'approve')}
                        className="btn-primary flex items-center justify-center gap-2"
                        disabled={actionLoading[event.id]}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(event.id, 'reject')}
                        className="rounded-full px-4 py-2 font-medium border border-error text-error hover:bg-error-container transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                        disabled={actionLoading[event.id]}
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
