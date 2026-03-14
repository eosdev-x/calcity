import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';
import { getStripe } from '../lib/stripe';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import {
  PaymentContextType,
  PaymentMethod,
  Subscription,
  PaymentHistoryItem,
  CheckoutOptions,
  Invoice,
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
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
      fetchPaymentMethods();
      fetchPaymentHistory();
    } else {
      setCurrentSubscription(null);
      setPaymentMethods([]);
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
        const tier = (data.tier as SubscriptionTier) || SubscriptionTier.BASIC;
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

  // Fetch user's payment methods
  const fetchPaymentMethods = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a backend API
      // For now, we'll simulate with a Supabase call
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching payment methods:', error);
        setError('Failed to fetch payment methods');
        return;
      }

      if (data) {
        const formattedPaymentMethods: PaymentMethod[] = data.map((method: any) => ({
          id: method.stripe_payment_method_id,
          type: method.type,
          card: method.card_details ? {
            brand: method.card_details.brand,
            last4: method.card_details.last4,
            expMonth: method.card_details.exp_month,
            expYear: method.card_details.exp_year
          } : undefined
        }));
        setPaymentMethods(formattedPaymentMethods);
      }
    } catch (err: any) {
      console.error('Error in fetchPaymentMethods:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's payment history
  const fetchPaymentHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a backend API
      // For now, we'll simulate with a Supabase call
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment history:', error);
        setError('Failed to fetch payment history');
        return;
      }

      if (data) {
        const formattedPaymentHistory: PaymentHistoryItem[] = data.map((payment: any) => ({
          id: payment.id,
          type: payment.type,
          amount: payment.amount,
          status: payment.status,
          date: new Date(payment.created_at).getTime(),
          description: payment.description
        }));
        setPaymentHistory(formattedPaymentHistory);
      }
    } catch (err: any) {
      console.error('Error in fetchPaymentHistory:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
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

  // Create a payment intent
  const createPaymentIntent = async (amount: number, metadata?: Record<string, string>) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a backend API
      // For now, we'll simulate a response
      // This would be replaced with an actual API call to your server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          metadata: {
            userId: user.id,
            ...metadata
          }
        }),
      });

      const paymentIntent = await response.json();

      if (paymentIntent.error) {
        setError(paymentIntent.error.message);
        return { error: paymentIntent.error };
      }

      return { clientSecret: paymentIntent.clientSecret };
    } catch (err: any) {
      console.error('Error creating payment intent:', err);
      setError(err.message || 'Failed to create payment intent');
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

  // Add payment method
  const addPaymentMethod = async (paymentMethodId: string) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a backend API
      // For now, we'll simulate a response
      // This would be replaced with an actual API call to your server
      const response = await fetch(`/api/add-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
        return { error: result.error };
      }

      // Refresh payment methods
      await fetchPaymentMethods();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error adding payment method:', err);
      setError(err.message || 'Failed to add payment method');
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Remove payment method
  const removePaymentMethod = async (paymentMethodId: string) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a backend API
      // For now, we'll simulate a response
      // This would be replaced with an actual API call to your server
      const response = await fetch(`/api/remove-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
        return { error: result.error };
      }

      // Update payment methods in state with optimistic UI update
      setPaymentMethods(paymentMethods.filter(method => method.id !== paymentMethodId));
      
      return { success: true };
    } catch (err: any) {
      console.error('Error removing payment method:', err);
      setError(err.message || 'Failed to remove payment method');
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Set default payment method
  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a backend API
      // For now, we'll simulate a response
      // This would be replaced with an actual API call to your server
      const response = await fetch(`/api/set-default-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
        return { error: result.error };
      }

      // Refresh payment methods
      await fetchPaymentMethods();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error setting default payment method:', err);
      setError(err.message || 'Failed to set default payment method');
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Get invoices
  const getInvoices = async () => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a backend API
      // For now, we'll simulate a response
      // This would be replaced with an actual API call to your server
      const response = await fetch(`/api/get-invoices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
        return { error: result.error };
      }

      return { invoices: result.invoices as Invoice[] };
    } catch (err: any) {
      console.error('Error getting invoices:', err);
      setError(err.message || 'Failed to get invoices');
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
    paymentMethods,
    paymentHistory,
    createCheckoutSession,
    createPaymentIntent,
    cancelSubscription,
    getCustomerPortalUrl,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    getInvoices,
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
