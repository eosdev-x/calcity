import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { SubscriptionTier, SUBSCRIPTION_PRICES, SubscriptionFeatures } from '../types/payment';

export function Pricing() {
  const { user } = useAuth();
  const { createCheckoutSession, currentSubscription, isLoading, error } = usePayment();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Define subscription plans with features and Stripe price IDs
  const plans = [
    {
      id: "free-plan",
      name: "Basic Listing",
      tier: SubscriptionTier.FREE,
      price: SUBSCRIPTION_PRICES[SubscriptionTier.FREE],
      priceDisplay: "Free",
      features: [
        "Basic business profile",
        "Contact information",
        "Business hours",
        "Map location"
      ],
      featureDetails: {
        photoLimit: 1,
        featuredListing: false,
        analytics: false,
        prioritySupport: false,
        customBranding: false,
        promotedEvents: 0
      } as SubscriptionFeatures
    },
    {
      id: "premium-plan",
      name: "Premium",
      tier: SubscriptionTier.PREMIUM,
      price: SUBSCRIPTION_PRICES[SubscriptionTier.PREMIUM],
      priceDisplay: `$${SUBSCRIPTION_PRICES[SubscriptionTier.PREMIUM]}/month`,
      stripePriceId: 'price_premium_monthly',
      features: [
        "Everything in Basic",
        "Featured in search results",
        "Photo gallery (10 photos)",
        "Special offers section",
        "Customer reviews",
        "Social media links"
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
      id: "enterprise-plan",
      name: "Enterprise",
      tier: SubscriptionTier.ENTERPRISE,
      price: SUBSCRIPTION_PRICES[SubscriptionTier.ENTERPRISE],
      priceDisplay: `$${SUBSCRIPTION_PRICES[SubscriptionTier.ENTERPRISE]}/month`,
      stripePriceId: 'price_enterprise_monthly',
      features: [
        "Everything in Premium",
        "Priority support",
        "Custom branding",
        "Analytics dashboard",
        "Email marketing integration",
        "Multiple locations (up to 3)"
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

  // Get current plan
  const currentPlanId = currentSubscription?.planId || 'free-plan';

  // Handle subscription checkout
  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate(`/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (plan.tier === SubscriptionTier.FREE) {
      // For free plan, redirect to payment page to manage subscription
      navigate('/payment');
      return;
    }

    if (!plan.stripePriceId) {
      console.error('No Stripe price ID for plan:', plan.name);
      return;
    }

    setProcessingPlanId(plan.id);

    try {
      const result = await createCheckoutSession({
        priceId: plan.stripePriceId,
        successUrl: `${window.location.origin}/payment/success?plan=${plan.tier}`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });

      if ('error' in result) {
        throw new Error(result.error.message || 'Failed to create checkout session');
      }

      // For now, redirect to payment page since we don't have actual backend
      // In a real implementation with a backend, we would redirect to Stripe Checkout URL
      // window.location.href = result.url
      navigate('/payment');
    } catch (err: any) {
      console.error('Subscription error:', err);
    } finally {
      setProcessingPlanId(null);
    }
  };

  // Check if a plan is the current active plan
  const isCurrentPlan = (planId: string) => {
    return currentPlanId === planId;
  };

  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-desert-800 dark:text-desert-100 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-desert-700 dark:text-desert-300 max-w-2xl mx-auto">
            Select the perfect plan for your business and start reaching more customers in California City
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`card overflow-hidden ${
                isCurrentPlan(plan.id) 
                  ? 'border-desert-500 dark:border-desert-400 shadow-desert' 
                  : ''
              }`}
            >
              {/* Plan header */}
              <div className={`p-6 ${
                isCurrentPlan(plan.id)
                  ? 'bg-desert-500 dark:bg-desert-600 text-white'
                  : 'bg-white dark:bg-night-desert-800'
              }`}>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-3xl font-bold ${
                  isCurrentPlan(plan.id)
                    ? 'text-white'
                    : 'text-desert-800 dark:text-desert-100'
                } mb-2`}>
                  {plan.priceDisplay}
                </p>
                {isCurrentPlan(plan.id) && (
                  <div className="mt-1 text-sm font-medium text-white">
                    Current Plan
                  </div>
                )}
              </div>

              {/* Plan features */}
              <div className="p-6 bg-white dark:bg-night-desert-900">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-desert-400" />
                      <span className="text-desert-700 dark:text-desert-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isLoading || processingPlanId === plan.id || isCurrentPlan(plan.id)}
                  className={`btn-primary w-full ${
                    isCurrentPlan(plan.id) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {processingPlanId === plan.id ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </div>
                  ) : isCurrentPlan(plan.id) ? (
                    'Current Plan'
                  ) : plan.tier === SubscriptionTier.FREE ? (
                    'Get Started'
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-desert-600 dark:text-desert-400 max-w-2xl mx-auto">
          <p>All plans include access to our community events calendar and local business directory.</p>
          <p className="mt-2">Need help choosing? <a href="/contact" className="text-desert-500 hover:text-desert-600 dark:text-desert-400 dark:hover:text-desert-300 underline">Contact our team</a> for personalized assistance.</p>
        </div>
      </div>
    </div>
  );
}