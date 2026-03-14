import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Initialize Stripe
export let stripePromise = loadStripe(stripePublishableKey);

export const getStripe = () => {
  return stripePromise;
};

// Validate Stripe publishable key
if (!stripePublishableKey) {
  console.warn('Missing Stripe publishable key. Payment features will not work properly.');
}
