import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  SubscriptionTier, 
  SubscriptionPlan, 
  SUBSCRIPTION_PRICES,
  SubscriptionStatus
} from '../../types/payment';
import { getPrimaryBusinessIdForOwner } from '../../utils/business';

// Define subscription plans with features
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic-plan',
    name: 'Basic',
    tier: SubscriptionTier.BASIC,
    price: SUBSCRIPTION_PRICES[SubscriptionTier.BASIC],
    stripePriceId: 'price_1TASQfRpRbHjjRj8mXv5x9rB',
    features: {
      photoLimit: 1,
      featuredListing: false,
      analytics: false,
      prioritySupport: false,
      customBranding: false,
      promotedEvents: 0
    }
  },
  {
    id: 'premium-plan',
    name: 'Premium',
    tier: SubscriptionTier.PREMIUM,
    price: SUBSCRIPTION_PRICES[SubscriptionTier.PREMIUM],
    stripePriceId: 'price_1TASRPRpRbHjjRj8rZMNIJ4i',
    features: {
      photoLimit: 10,
      featuredListing: true,
      analytics: true,
      prioritySupport: false,
      customBranding: false,
      promotedEvents: 1
    }
  },
  {
    id: 'spotlight-plan',
    name: 'Spotlight',
    tier: SubscriptionTier.SPOTLIGHT,
    price: SUBSCRIPTION_PRICES[SubscriptionTier.SPOTLIGHT],
    stripePriceId: 'price_1TASSRRpRbHjjRj8nfJz5gSc',
    features: {
      photoLimit: 30,
      featuredListing: true,
      analytics: true,
      prioritySupport: true,
      customBranding: true,
      promotedEvents: 3
    }
  }
];

export function SubscriptionPlans() {
  const { user } = useAuth();
  const { 
    currentSubscription, 
    createCheckoutSession, 
    cancelSubscription,
    getCustomerPortalUrl,
    isLoading,
    error
  } = usePayment();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Get current plan
  const currentTier = currentSubscription?.tier || SubscriptionTier.BASIC;
  const hasActiveSubscription = Boolean(
    currentSubscription &&
    currentSubscription.status !== SubscriptionStatus.CANCELED &&
    currentSubscription.status !== SubscriptionStatus.INCOMPLETE_EXPIRED
  );
  
  // Handle subscription checkout
  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setProcessingPlanId(plan.id);
    setSuccessMessage(null);
    setLocalError(null);

    try {
      if (!plan.stripePriceId) {
        throw new Error('Invalid plan selected');
      }

      const businessId = await getPrimaryBusinessIdForOwner(user.id);

      if (!businessId) {
        setLocalError('Create a business profile before selecting a subscription plan.');
        return;
      }

      const result = await createCheckoutSession({
        priceId: plan.stripePriceId,
        businessId,
      });

      if ('error' in result) {
        const message = typeof result.error === 'string' ? result.error : result.error.message;
        throw new Error(message || 'Failed to create checkout session');
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setLocalError(err.message || 'Failed to start checkout');
    } finally {
      setProcessingPlanId(null);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    setProcessingPlanId('cancel');
    setSuccessMessage(null);

    try {
      const result = await cancelSubscription(currentSubscription.id);

      if ('error' in result) {
        const message = typeof result.error === 'string' ? result.error : result.error?.message;
        throw new Error(message || 'Failed to cancel subscription');
      }

      setSuccessMessage('Subscription canceled. You will have access until the end of your billing period.');
    } catch (err: any) {
      console.error('Cancellation error:', err);
      setLocalError(err.message || 'Failed to cancel subscription');
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleManageSubscription = async () => {
    setProcessingPlanId('portal');
    setSuccessMessage(null);
    setLocalError(null);

    try {
      const result = await getCustomerPortalUrl();

      if ('error' in result) {
        const message = typeof result.error === 'string' ? result.error : result.error?.message;
        throw new Error(message || 'Failed to open billing portal');
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error('Billing portal error:', err);
      setLocalError(err.message || 'Failed to open billing portal');
    } finally {
      setProcessingPlanId(null);
    }
  };

  // Check if a plan is the current active plan
  const isCurrentPlan = (tier: SubscriptionTier) => {
    return currentSubscription !== null && currentTier === tier;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Error message */}
      {(localError || error) && (
        <div className="mb-6 p-4 bg-error-container border border-error rounded-xl">
          <p className="text-on-error-container">{localError || error}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-tertiary-container border border-tertiary rounded-xl">
          <p className="text-on-tertiary-container">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id}
            className={`rounded-xl overflow-hidden border ${
              isCurrentPlan(plan.tier)
                ? 'border-outline shadow-sm'
                : 'border-outline-variant'
            }`}
          >
            {/* Plan header */}
            <div className={`p-6 ${
              isCurrentPlan(plan.tier)
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface'
            }`}>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-sm">/month</span>}
              </div>
              {isCurrentPlan(plan.tier) && (
                <div className="mt-2 text-sm font-medium">
                  Current Plan
                </div>
              )}
            </div>

            {/* Plan features */}
            <div className="p-6 bg-surface-container-low">
              <ul className="space-y-3">
                <li className="flex items-start">
                  {plan.features.photoLimit > 0 ? (
                    <Check className="w-5 h-5 text-tertiary mr-2 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-error mr-2 flex-shrink-0" />
                  )}
                  <span>{plan.features.photoLimit} Photo{plan.features.photoLimit !== 1 ? 's' : ''}</span>
                </li>
                <li className="flex items-start">
                  {plan.features.featuredListing ? (
                    <Check className="w-5 h-5 text-tertiary mr-2 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-error mr-2 flex-shrink-0" />
                  )}
                  <span>Featured Listing</span>
                </li>
                <li className="flex items-start">
                  {plan.features.analytics ? (
                    <Check className="w-5 h-5 text-tertiary mr-2 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-error mr-2 flex-shrink-0" />
                  )}
                  <span>Business Analytics</span>
                </li>
                <li className="flex items-start">
                  {plan.features.prioritySupport ? (
                    <Check className="w-5 h-5 text-tertiary mr-2 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-error mr-2 flex-shrink-0" />
                  )}
                  <span>Priority Support</span>
                </li>
                <li className="flex items-start">
                  {plan.features.customBranding ? (
                    <Check className="w-5 h-5 text-tertiary mr-2 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-error mr-2 flex-shrink-0" />
                  )}
                  <span>Custom Branding</span>
                </li>
                <li className="flex items-start">
                  {plan.features.promotedEvents > 0 ? (
                    <Check className="w-5 h-5 text-tertiary mr-2 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-error mr-2 flex-shrink-0" />
                  )}
                  <span>{plan.features.promotedEvents} Promoted Event{plan.features.promotedEvents !== 1 ? 's' : ''}</span>
                </li>
              </ul>

              {/* Action button */}
              <div className="mt-6">
                {isCurrentPlan(plan.tier) ? (
                  currentSubscription && !currentSubscription.cancelAtPeriodEnd && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isLoading || processingPlanId === 'cancel'}
                      className="w-full py-2 px-4 rounded-full bg-error-container text-on-error-container hover:opacity-90 transition-colors duration-[var(--md-sys-motion-duration-short3)] disabled:opacity-50"
                    >
                      {processingPlanId === 'cancel' ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </button>
                  )
                ) : (
                  hasActiveSubscription ? (
                    <button
                      onClick={handleManageSubscription}
                      disabled={isLoading || processingPlanId === 'portal'}
                      className="w-full py-2 px-4 rounded-full bg-secondary-container text-on-secondary-container hover:opacity-90 transition-colors duration-[var(--md-sys-motion-duration-short3)] disabled:opacity-50"
                    >
                      {processingPlanId === 'portal' ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        'Manage via Portal'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={isLoading || processingPlanId === plan.id}
                      className={`w-full py-2 px-4 rounded-full ${
                        plan.tier === SubscriptionTier.BASIC
                          ? 'bg-secondary-container text-on-secondary-container hover:opacity-90'
                          : 'bg-primary text-on-primary hover:bg-primary/90'
                      } transition-colors duration-[var(--md-sys-motion-duration-short3)] disabled:opacity-50`}
                    >
                      {processingPlanId === plan.id ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        `Subscribe to ${plan.name}`
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
