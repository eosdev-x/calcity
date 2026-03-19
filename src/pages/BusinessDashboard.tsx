import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BarChart3, Briefcase, Building2, CreditCard, Edit3, Image, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useBusinessPermissions } from '../hooks/useBusinessPermissions';
import { usePayment } from '../context/PaymentContext';
import { Business } from '../types/business';
import { BusinessEditForm } from '../components/dashboard/BusinessEditForm';
import { PhotoManager } from '../components/dashboard/PhotoManager';
import { AnalyticsDashboard } from '../components/dashboard/AnalyticsDashboard';
import { JobManager } from '../components/dashboard/JobManager';
import { siteConfig } from '../config/site';
import { SEO } from '../components/SEO';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'edit', label: 'Edit Profile', icon: Edit3 },
  { id: 'photos', label: 'Photos', icon: Image },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
];

type TabId = (typeof tabs)[number]['id'];

export function BusinessDashboard() {
  const { user } = useAuth();
  const { currentSubscription, getCustomerPortalUrl, isLoading: billingLoading, error: billingError } = usePayment();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewCount, setViewCount] = useState(0);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const tabParam = searchParams.get('tab');
  const activeTab: TabId = tabs.some(tab => tab.id === tabParam) ? (tabParam as TabId) : 'overview';
  const setActiveTab = (tab: TabId) => setSearchParams({ tab });

  const permissions = useBusinessPermissions(business?.subscription_tier ?? 'free');

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const fetchBusiness = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setBusiness(null);
      } else {
        setBusiness((data as Business) || null);
        setError(null);
      }
      setLoading(false);
    };

    void fetchBusiness();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!business) return;
    let isMounted = true;

    const fetchViews = async () => {
      const { count } = await supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('event_type', 'view');

      if (isMounted) {
        setViewCount(count ?? 0);
      }
    };

    void fetchViews();

    return () => {
      isMounted = false;
    };
  }, [business]);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    setPortalError(null);

    try {
      const result = await getCustomerPortalUrl();
      if ('error' in result) {
        const message = typeof result.error === 'string' ? result.error : result.error.message;
        throw new Error(message || 'Unable to open billing portal');
      }
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to open billing portal';
      setPortalError(message);
    } finally {
      setPortalLoading(false);
    }
  };

  const currentTierLabel = useMemo(() => {
    if (!business?.subscription_tier) return 'Free';
    return business.subscription_tier.charAt(0).toUpperCase() + business.subscription_tier.slice(1);
  }, [business?.subscription_tier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-surface-container-high rounded-xl" />
            <div className="h-4 w-48 bg-surface-container-high rounded-lg" />
            <div className="flex gap-2 border-b border-outline-variant pb-2">
              {Array.from({ length: tabs.length }).map((_, i) => (
                <div key={i} className="h-8 w-24 bg-surface-container-high rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-48 bg-surface-container-high rounded-xl" />
              <div className="h-48 bg-surface-container-high rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <SEO
          title={siteConfig.seo.pages.dashboardTitle}
          path="/dashboard"
          noindex
        />
        <div className="container mx-auto px-4">
          {error && (
            <div className="mb-6 rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
              {error}
            </div>
          )}
          <div className="card text-center">
            <h1 className="text-2xl font-semibold text-on-surface mb-2">Create your business profile</h1>
            <p className="text-on-surface-variant mb-6">
              You don&apos;t have a business listing yet. Create one to unlock your dashboard.
            </p>
            <Link to="/businesses/new" className="btn-primary inline-flex">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.dashboardTitle}
        path="/dashboard"
        noindex
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-on-surface">Business Dashboard</h1>
            <p className="text-on-surface-variant">Manage your listing and subscription.</p>
          </div>
          {permissions.hasBadge && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${permissions.badgeClass}`}
            >
              {permissions.badgeText}
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-error bg-error-container p-4 text-on-error-container text-sm">
            {error}
          </div>
        )}
        {currentSubscription?.cancelAtPeriodEnd && (
          <div className="mb-6 rounded-xl border border-tertiary bg-tertiary-container p-4 text-on-tertiary-container text-sm">
            Your plan is active until the end of your current billing period.
          </div>
        )}

        {business.status === 'rejected' && (
          <div className="mb-6 rounded-xl border border-error bg-error-container p-4">
            <h3 className="text-sm font-semibold text-on-error-container mb-1">Listing Rejected</h3>
            <p className="text-sm text-on-error-container">
              {business.rejection_reason || 'Your listing was not approved. Please update and resubmit.'}
            </p>
          </div>
        )}

        {business.status === 'pending' && (
          <div className="mb-6 rounded-xl border border-outline bg-surface-container p-4">
            <p className="text-sm text-on-surface-variant">
              Your listing is pending admin approval. You'll see it go live once approved.
            </p>
          </div>
        )}

        <div className="flex gap-2 border-b border-outline-variant mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {business.image && business.image.length > 0 ? (
                    <img
                      src={business.image}
                      alt={business.name}
                      className="h-32 w-32 flex-shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-32 w-32 flex-shrink-0 rounded-xl bg-surface-container-high flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-on-surface-variant/40" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-2xl font-semibold text-on-surface mb-1 truncate">{business.name}</h2>
                    <p className="text-on-surface-variant truncate">{business.category}</p>
                    <p className="text-sm text-on-surface-variant mt-2 truncate">{business.address}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-on-surface mb-4">Quick Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                    <p className="text-sm text-on-surface-variant">Total Views</p>
                    <p className="text-2xl font-semibold text-on-surface mt-2">{viewCount}</p>
                  </div>
                  <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                    <p className="text-sm text-on-surface-variant">Subscription</p>
                    <p className="text-2xl font-semibold text-on-surface mt-2">{currentTierLabel}</p>
                  </div>
                  <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                    <p className="text-sm text-on-surface-variant">Status</p>
                    <p className="text-2xl font-semibold text-on-surface mt-2">
                      {currentSubscription?.status ?? 'none'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-on-surface mb-2">Next Steps</h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  Keep your listing fresh to attract more visitors.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('photos')}
                    className="btn-outline"
                  >
                    Manage Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <BusinessEditForm business={business} onUpdated={setBusiness} />
        )}

        {activeTab === 'photos' && (
          <PhotoManager business={business} onUpdated={setBusiness} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard business={business} totalViewCount={viewCount} />
        )}

        {activeTab === 'jobs' && (
          <JobManager business={business} onUpdated={setBusiness} />
        )}

        {activeTab === 'subscription' && (
          <div className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-on-surface-variant">Current Plan</p>
                <p className="text-2xl font-semibold text-on-surface">{currentTierLabel}</p>
                <div className="mt-2 text-sm text-on-surface-variant">
                  Status: {currentSubscription?.status ?? 'none'}
                </div>
                {currentSubscription?.cancelAtPeriodEnd && (
                  <div className="mt-1 text-sm text-on-surface-variant">
                    Active until period end
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Link to="/pricing" className="btn-outline text-center">
                  View Plans
                </Link>
                <button
                  type="button"
                  onClick={handleManageBilling}
                  disabled={!currentSubscription || portalLoading || billingLoading}
                  className="btn-primary"
                >
                  {portalLoading ? 'Opening Billing...' : 'Manage Billing'}
                </button>
                {!currentSubscription && (
                  <p className="text-sm text-on-surface-variant">
                    You are on the free plan. Upgrade to manage billing.
                  </p>
                )}
                {(portalError || billingError) && (
                  <p className="text-sm text-error">{portalError || billingError}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
