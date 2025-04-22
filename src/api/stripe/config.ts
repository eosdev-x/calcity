import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

// Validate Stripe secret key
if (!stripeSecretKey) {
  console.error('Missing Stripe secret key. Payment features will not work properly.');
}

// Create Stripe instance
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use the latest API version
});

// Subscription price IDs (these would be created in your Stripe dashboard)
export const STRIPE_PRICE_IDS = {
  PREMIUM_MONTHLY: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
  ENTERPRISE_MONTHLY: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly',
};

// Webhook secret for verifying webhook events
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
