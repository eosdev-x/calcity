-- Add free tier support
ALTER TABLE public.businesses DROP CONSTRAINT businesses_subscription_tier_check;
ALTER TABLE public.businesses ADD CONSTRAINT businesses_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'basic', 'premium', 'spotlight'));
ALTER TABLE public.businesses ALTER COLUMN subscription_tier SET DEFAULT 'free';
