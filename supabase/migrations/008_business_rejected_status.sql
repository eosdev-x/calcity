-- Allow 'rejected' status on businesses table
ALTER TABLE public.businesses DROP CONSTRAINT IF EXISTS businesses_status_check;
ALTER TABLE public.businesses ADD CONSTRAINT businesses_status_check
  CHECK (status IN ('pending', 'active', 'suspended', 'archived', 'rejected'));
