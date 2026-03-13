import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SubscriptionPlans } from '../components/payment/SubscriptionPlans';
import { PaymentMethods } from '../components/payment/PaymentMethods';
import { PaymentHistory } from '../components/payment/PaymentHistory';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { stripePromise } from '../lib/stripe';
import { SubscriptionTier } from '../types/payment';
import { siteConfig } from '../config/site';
import { SEO } from '../components/SEO';

export function Payment() {
  const { user } = useAuth();
  const { currentSubscription, getCustomerPortalUrl, isLoading, error } = usePayment();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate(`/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, navigate]);

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
    } catch (err: any) {
      console.error('Billing portal error:', err);
      setPortalError(err.message || 'Unable to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const currentTierLabel = currentSubscription?.tier
    ? currentSubscription.tier.charAt(0).toUpperCase() + currentSubscription.tier.slice(1)
    : SubscriptionTier.BASIC.charAt(0).toUpperCase() + SubscriptionTier.BASIC.slice(1);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={siteConfig.seo.pages.paymentTitle}
        path="/payment"
        noindex
      />
      <h1 className="text-3xl font-bold text-on-surface mb-8">
        Payment Management
      </h1>

      <div className="mb-8 rounded-xl border border-outline-variant bg-surface-container-low p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-on-surface-variant">Current Tier</p>
            <p className="text-xl font-semibold text-on-surface">{currentTierLabel}</p>
            <div className="mt-2 text-sm text-on-surface-variant">
              Status: {currentSubscription?.status ?? 'none'}
            </div>
            <div className="text-sm text-on-surface-variant">
              Current Period: {formatDate(currentSubscription?.currentPeriodStart)} - {formatDate(currentSubscription?.currentPeriodEnd)}
            </div>
            {currentSubscription?.cancelAtPeriodEnd && (
              <div className="mt-1 text-sm text-error">
                Canceling at period end
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleManageBilling}
              disabled={portalLoading || isLoading}
              className="btn-primary w-full md:w-auto"
            >
              {portalLoading ? 'Opening Billing...' : 'Manage Billing'}
            </button>
            {(portalError || error) && (
              <p className="text-sm text-error">{portalError || error}</p>
            )}
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="subscriptions"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="subscriptions">Subscription Plans</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="payment-methods">
          <Elements stripe={stripePromise}>
            <PaymentMethods />
          </Elements>
        </TabsContent>

        <TabsContent value="payment-history">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Payment;
