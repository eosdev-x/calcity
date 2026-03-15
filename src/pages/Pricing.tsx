import { useEffect, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { SubscriptionTier, SUBSCRIPTION_PRICES, SubscriptionFeatures } from '../types/payment';
import { getPrimaryBusinessIdForOwner } from '../utils/business';
import { siteConfig } from '../config/site';
import { SEO } from '../components/SEO';

export function Pricing() {
  const { user } = useAuth();
  const { createCheckoutSession, updateSubscription, currentSubscription, isLoading, error } = usePayment();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  // Define subscription plans with features and Stripe price IDs
  const plans = [
    {
      id: "free-plan",
      name: "Free Listing",
      tier: SubscriptionTier.FREE,
      price: SUBSCRIPTION_PRICES[SubscriptionTier.FREE],
      priceDisplay: "Free",
      stripePriceId: siteConfig.stripe.freePriceId,
      features: [
        "Business name, address & phone",
        "Business hours display",
        "Business description",
        "Category listing",
        "Generic placeholder photo"
      ],
      featureDetails: {
        photoLimit: 0,
        featuredListing: false,
        analytics: false,
        prioritySupport: false,
        customBranding: false,
        promotedEvents: 0
      } as SubscriptionFeatures
    },
    {
      id: "basic-plan",
      name: "Basic Listing",
      tier: SubscriptionTier.BASIC,
      price: SUBSCRIPTION_PRICES[SubscriptionTier.BASIC],
      priceDisplay: "$4.99/month",
      stripePriceId: siteConfig.stripe.basicPriceId,
      features: [
        "Everything in Free",
        "Upload up to 3 photos",
        "Website link",
        "Services list",
        "Higher search priority"
      ],
      featureDetails: {
        photoLimit: 3,
        featuredListing: false,
        analytics: false,
        prioritySupport: false,
        customBranding: false,
        promotedEvents: 0
      } as SubscriptionFeatures
    },
    {
      id: "premium-plan",
      name: "Premium Listing",
      tier: SubscriptionTier.PREMIUM,
      price: SUBSCRIPTION_PRICES[SubscriptionTier.PREMIUM],
      priceDisplay: "$14.99/month",
      stripePriceId: siteConfig.stripe.premiumPriceId,
      features: [
        "Everything in Basic",
        "Photo gallery (up to 10)",
        "Featured in search results",
        "Business description & services",
        "Direct website link",
        "Premium badge"
      ],
      featureDetails: {
        photoLimit: 10,
        featuredListing: true,
        analytics: true,
        prioritySupport: false,
        customBranding: false,
        promotedEvents: 1
      } as SubscriptionFeatures
    },
    {
      id: "spotlight-plan",
      name: "Spotlight Listing",
      tier: SubscriptionTier.SPOTLIGHT,
      price: SUBSCRIPTION_PRICES[SubscriptionTier.SPOTLIGHT],
      priceDisplay: "$29.99/month",
      stripePriceId: siteConfig.stripe.spotlightPriceId,
      features: [
        "Everything in Premium",
        "Top of search results",
        "Homepage spotlight rotation",
        "Monthly event promotion",
        "Social media cross-promotion",
        "Analytics dashboard"
      ],
      featureDetails: {
        photoLimit: 30,
        featuredListing: true,
        analytics: true,
        prioritySupport: true,
        customBranding: true,
        promotedEvents: 3
      } as SubscriptionFeatures
    }
  ];

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Get current plan
  const currentTier = currentSubscription?.tier ?? (user ? SubscriptionTier.FREE : null);
  const tierOrder: Record<SubscriptionTier, number> = {
    [SubscriptionTier.FREE]: 0,
    [SubscriptionTier.BASIC]: 1,
    [SubscriptionTier.PREMIUM]: 2,
    [SubscriptionTier.SPOTLIGHT]: 3,
  };

  const getPlanRelation = (tier: SubscriptionTier) => {
    if (!currentTier || !currentSubscription) return null;
    if (tier === currentTier) return 'current';
    return tierOrder[tier] > tierOrder[currentTier] ? 'upgrade' : 'downgrade';
  };

  // Handle subscription checkout or update
  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.tier === SubscriptionTier.FREE) {
      const returnTo = encodeURIComponent('/businesses/new');
      if (!user) {
        navigate(`/auth/login?returnTo=${returnTo}`);
        return;
      }
      navigate('/businesses/new');
      return;
    }

    if (!user) {
      // Redirect to login if not authenticated
      navigate(`/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!plan.stripePriceId) {
      console.error('No Stripe price ID for plan:', plan.name);
      return;
    }

    setProcessingPlanId(plan.id);
    setLocalError(null);

    try {
      const businessId = await getPrimaryBusinessIdForOwner(user.id);

      if (!businessId) {
        setLocalError('Create a business profile before subscribing to a plan.');
        return;
      }

      if (currentSubscription && plan.tier !== currentSubscription.tier) {
        const result = await updateSubscription(plan.stripePriceId, businessId);

        if ('error' in result) {
          const message = typeof result.error === 'string' ? result.error : result.error.message;
          throw new Error(message || 'Failed to update subscription');
        }

        setToast({ type: 'success', message: `Plan updated to ${plan.name}.` });
      } else {
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
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setLocalError(err.message || 'Failed to start checkout');
    } finally {
      setProcessingPlanId(null);
    }
  };

  // Check if a plan is the current active plan
  const isCurrentPlan = (tier: SubscriptionTier) => {
    return currentTier === tier;
  };

  return (
    <div className="min-h-screen bg-surface  py-12">
      <SEO
        title={siteConfig.seo.pages.pricingTitle}
        description={siteConfig.seo.pages.pricingDescription}
        path="/pricing"
        type="product"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-on-surface mb-4">
            Choose Your Plan
          </h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Select the perfect plan for your business and start reaching more customers in {siteConfig.city}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8 rounded-xl border border-outline px-4 py-3 text-sm" style={{ backgroundColor: '#fef3cd', color: '#664d03', borderColor: '#ffecb5' }}>
          <p className="font-semibold">⚠️ Testing Mode</p>
          <p>Payments are currently in test mode. Please do not enter real credit card information. Subscriptions will be available soon!</p>
        </div>

        {(localError || error) && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-error-container border border-error rounded-xl">
            <p className="text-on-error-container">{localError || error}</p>
          </div>
        )}
        {toast && (
          <div
            className={`max-w-2xl mx-auto mb-8 rounded-xl border px-4 py-3 text-sm shadow-lg transition-all ${
              toast.type === 'success'
                ? 'bg-tertiary-container text-on-tertiary-container border-tertiary/30'
                : 'bg-error-container text-on-error-container border-error/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`card overflow-hidden ${
                isCurrentPlan(plan.tier) 
                  ? 'border-outline  shadow-sm' 
                  : ''
              }`}
            >
              {/* Plan header */}
              <div className={`p-6 ${
                isCurrentPlan(plan.tier)
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container'
              }`}>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-3xl font-bold ${
                  isCurrentPlan(plan.tier)
                    ? 'text-on-primary'
                    : 'text-on-surface'
                } mb-2`}>
                  {plan.priceDisplay}
                </p>
                {isCurrentPlan(plan.tier) && (
                  <div className="mt-1 text-sm font-medium text-on-primary">
                    Current Plan
                  </div>
                )}
              </div>

              {/* Plan features */}
              <div className="p-6 bg-surface-container-low">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-on-surface-variant" />
                      <span className="text-on-surface-variant">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isLoading || processingPlanId === plan.id || isCurrentPlan(plan.tier)}
                  className={`btn-primary w-full ${
                    isCurrentPlan(plan.tier) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {processingPlanId === plan.id ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </div>
                  ) : isCurrentPlan(plan.tier) ? (
                    'Current Plan'
                  ) : plan.tier === SubscriptionTier.FREE ? (
                    'Get Started'
                  ) : currentSubscription && getPlanRelation(plan.tier) === 'upgrade' ? (
                    `Upgrade to ${plan.name}`
                  ) : currentSubscription && getPlanRelation(plan.tier) === 'downgrade' ? (
                    `Downgrade to ${plan.name}`
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
                {currentSubscription && getPlanRelation(plan.tier) === 'upgrade' && (
                  <p className="mt-3 text-xs text-on-surface-variant">
                    You will be charged the prorated difference.
                  </p>
                )}
                {currentSubscription && getPlanRelation(plan.tier) === 'downgrade' && (
                  <p className="mt-3 text-xs text-on-surface-variant">
                    Credit will be applied to your next billing cycle.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-on-surface-variant max-w-2xl mx-auto">
          <p>All plans include access to our community events calendar and local business directory.</p>
          <p className="mt-2">Need help choosing? <a href="/contact" className="text-on-surface-variant hover:text-primary underline transition-colors duration-[var(--md-sys-motion-duration-short3)]">Contact our team</a> for personalized assistance.</p>
        </div>
      </div>
    </div>
  );
}
