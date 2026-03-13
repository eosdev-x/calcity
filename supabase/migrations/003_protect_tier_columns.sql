-- Prevent owners from modifying subscription-controlled columns
-- These should only be changed by the service-role key (webhooks/admin)
CREATE OR REPLACE FUNCTION protect_subscription_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- If the current role is authenticated (not service_role), 
  -- preserve the old values for protected columns
  IF current_setting('request.jwt.claims', true)::json->>'role' = 'authenticated' THEN
    NEW.subscription_tier := OLD.subscription_tier;
    NEW.is_featured := OLD.is_featured;
    NEW.is_spotlight := OLD.is_spotlight;
    NEW.stripe_subscription_id := OLD.stripe_subscription_id;
    NEW.stripe_customer_id := OLD.stripe_customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protect_business_subscription_columns
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION protect_subscription_columns();
