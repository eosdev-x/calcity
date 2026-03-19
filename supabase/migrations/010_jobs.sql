-- Add is_hiring flag to businesses
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS is_hiring BOOLEAN DEFAULT false;

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  job_type TEXT NOT NULL DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'seasonal', 'contract')),
  apply_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '60 days')
);

-- RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can view jobs for active businesses
CREATE POLICY "Public can view jobs" ON public.jobs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND status = 'active' AND is_hiring = true)
  );

-- Owners can manage their own jobs
CREATE POLICY "Owners can insert jobs" ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update jobs" ON public.jobs FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete jobs" ON public.jobs FOR DELETE
  USING (auth.uid() = owner_id);

-- Admins can manage all jobs
CREATE POLICY "Admins can manage jobs" ON public.jobs FOR ALL
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_jobs_business_id ON public.jobs(business_id);
CREATE INDEX IF NOT EXISTS idx_jobs_expires_at ON public.jobs(expires_at);
