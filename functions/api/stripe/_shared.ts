import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export type StripeTier = 'basic' | 'premium' | 'spotlight';

export type StripeEnv = {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_BASIC_PRICE_ID: string;
  STRIPE_PREMIUM_PRICE_ID: string;
  STRIPE_SPOTLIGHT_PRICE_ID: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

export const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const getStripeClient = (env: StripeEnv) =>
  new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

export const getSupabaseAdmin = (env: StripeEnv) =>
  createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

export const getTierFromPriceId = (env: StripeEnv, priceId: string): StripeTier => {
  if (priceId === env.STRIPE_PREMIUM_PRICE_ID) {
    return 'premium';
  }
  if (priceId === env.STRIPE_SPOTLIGHT_PRICE_ID) {
    return 'spotlight';
  }
  return 'basic';
};

export const getBearerToken = (request: Request) => {
  const header = request.headers.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
};
