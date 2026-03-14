import { Stripe } from '@stripe/stripe-js';

// Subscription tiers
export enum SubscriptionTier {
  BASIC = 'basic',
  PREMIUM = 'premium',
  SPOTLIGHT = 'spotlight'
}

// Subscription prices (monthly)
export const SUBSCRIPTION_PRICES = {
  [SubscriptionTier.BASIC]: 9.99,
  [SubscriptionTier.PREMIUM]: 24.99,
  [SubscriptionTier.SPOTLIGHT]: 49.99
};

// Subscription features
export interface SubscriptionFeatures {
  photoLimit: number;
  featuredListing: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  promotedEvents: number;
}

// Subscription plan details
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  features: SubscriptionFeatures;
  stripePriceId?: string; // Stripe price ID for this plan
}

// Payment method
export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded'
}

// Payment intent
export interface PaymentIntent {
  id: string;
  amount: number;
  status: PaymentStatus;
  created: number;
  paymentMethod?: string;
  clientSecret?: string;
}

// Subscription status
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing'
}

// Subscription
export interface Subscription {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  planId: string;
  tier: SubscriptionTier;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

// Invoice
export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created: number;
  dueDate: number;
  pdfUrl?: string;
}

// Payment history item
export interface PaymentHistoryItem {
  id: string;
  type: 'subscription' | 'one-time';
  amount: number;
  status: PaymentStatus;
  date: number;
  description: string;
}

// Checkout session options
export interface CheckoutOptions {
  priceId: string;
  businessId: string;
}

// Payment context type
export interface PaymentContextType {
  isLoading: boolean;
  error: string | null;
  currentSubscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  paymentHistory: PaymentHistoryItem[];
  createCheckoutSession: (options: CheckoutOptions) => Promise<{ url: string } | { error: any }>;
  createPaymentIntent: (amount: number, metadata?: Record<string, string>) => Promise<{ clientSecret: string } | { error: any }>;
  cancelSubscription: (subscriptionId: string) => Promise<{ success: boolean } | { error: any }>;
  getCustomerPortalUrl: () => Promise<{ url: string } | { error: any }>;
  addPaymentMethod: (paymentMethodId: string) => Promise<{ success: boolean } | { error: any }>;
  removePaymentMethod: (paymentMethodId: string) => Promise<{ success: boolean } | { error: any }>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<{ success: boolean } | { error: any }>;
  getInvoices: () => Promise<{ invoices: Invoice[] } | { error: any }>;
  elements: Stripe.StripeElements | null;
  stripe: Stripe | null;
}
