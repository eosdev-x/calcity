import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';
import { getStripe } from '../lib/stripe';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import {
  PaymentContextType,
  Subscription,
  PaymentHistoryItem,
  CheckoutOptions,
  SubscriptionStatus,
  SubscriptionTier
} from '../types/payment';

// Create context with default values
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Custom hook to use the payment context
export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}

interface PaymentProviderProps {
  children: ReactNode;
}

export function PaymentProvider({ children }: PaymentProviderProps) {
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<Stripe.StripeElements | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await getStripe();
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        setError('Failed to initialize payment system');
      }
    };

    initializeStripe();
  }, []);

  // Fetch user's subscription when user changes
  useEffect(() => {
    if (user) {
      fetchUserSubscription();
      fetchPaymentHistory();
    } else {
      setCurrentSubscription(null);
      setPaymentHistory([]);
    }
  }, [user]);

  // Fetch user's subscription
  const fetchUserSubscription = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a backend API
      // For now, we'll simulate with a Supabase call
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('current_period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setError('Failed to fetch subscription information');
        return;
      }

      if (data) {
        const tier = (data.tier as SubscriptionTier) || SubscriptionTier.FREE;
        setCurrentSubscription({
          id: data.stripe_subscription_id,
          customerId: data.stripe_customer_id,
          status: data.status as SubscriptionStatus,
          planId: data.stripe_price_id,
          tier,
          currentPeriodStart: data.current_period_start ? new Date(data.current_period_start).getTime() : 0,
          currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end).getTime() : 0,
          cancelAtPeriodEnd: Boolean(data.cancel_at_period_end)
        });
      } else {
        setCurrentSubscription(null);
      }
    } catch (err: any) {
      console.error('Error in fetchUserSubscription:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's payment history from Stripe via backend
  const fetchPaymentHistory = async () => {
    if (!user) return;

    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch('/api/stripe/invoices', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error('Failed to fetch payment history');
        return;
      }

      const data = await response.json();
      if (data.invoices) {
        setPaymentHistory(data.invoices.map((inv: any) => ({
          id: inv.id,
          type: 'subscription',
          amount: inv.amount,
          status: inv.status,
          date: inv.date,
          description: inv.description,
          invoiceUrl: inv.invoiceUrl,
          invoicePdf: inv.invoicePdf,
        })));
      }
    } catch (err) {
      console.error('Error fetching payment history:', err);
    }
  };

  const getAccessToken = async () => {
    if (session?.access_token) return session.access_token;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  // Create a checkout session
  const createCheckoutSession = async (options: CheckoutOptions) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        return { error: 'User not authenticated' };
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: options.priceId,
          businessId: options.businessId,
        }),
      });

      const session = await response.json();

      if (!response.ok || session?.error) {
        const message = session?.error || 'Failed to create checkout session';
        setError(typeof message === 'string' ? message : message.message);
        return { error: session?.error || message };
      }

      if (!session?.url) {
        setError('Failed to create checkout session');
        return { error: 'Failed to create checkout session' };
      }

      return { url: session.url };
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to create checkout session');
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async (subscriptionId: string) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        return { error: 'User not authenticated' };
      }

      const response = await fetch(`/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscriptionId
        }),
      });

      const result = await response.json();

      if (!response.ok || result?.error) {
        const message = result?.error || 'Failed to cancel subscription';
        setError(typeof message === 'string' ? message : message.message);
        return { error: result?.error || message };
      }

      // Update the subscription in state with optimistic UI update
      if (currentSubscription) {
        setCurrentSubscription({
          ...currentSubscription,
          cancelAtPeriodEnd: true
        });
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error canceling subscription:', err);
      setError(err.message || 'Failed to cancel subscription');
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Update subscription (upgrade/downgrade)
  const updateSubscription = async (newPriceId: string, businessId: string) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        return { error: 'User not authenticated' };
      }

      const response = await fetch('/api/stripe/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPriceId,
          businessId,
        }),
      });

      const result = await response.json();

      if (!response.ok || result?.error) {
        const message = result?.error || 'Failed to update subscription';
        setError(typeof message === 'string' ? message : message.message);
        return { error: result?.error || message };
      }

      await fetchUserSubscription();
      return { success: true, tier: result?.tier };
    } catch (err: any) {
      console.error('Error updating subscription:', err);
      setError(err.message || 'Failed to update subscription');
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerPortalUrl = async () => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        return { error: 'User not authenticated' };
      }

      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result?.error) {
        const message = result?.error || 'Failed to open billing portal';
        setError(typeof message === 'string' ? message : message.message);
        return { error: result?.error || message };
      }

      if (!result?.url) {
        setError('Failed to open billing portal');
        return { error: 'Failed to open billing portal' };
      }

      return { url: result.url };
    } catch (err: any) {
      console.error('Error opening billing portal:', err);
      setError(err.message || 'Failed to open billing portal');
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: PaymentContextType = {
    isLoading,
    error,
    currentSubscription,
    paymentHistory,
    createCheckoutSession,
    updateSubscription,
    cancelSubscription,
    getCustomerPortalUrl,
    elements,
    stripe
  };

  return (
    <PaymentContext.Provider value={value}>
      {stripe && (
        <Elements stripe={stripe}>
          {children}
        </Elements>
      )}
      {!stripe && children}
    </PaymentContext.Provider>
  );
}
