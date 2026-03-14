-- Admin SELECT policies
-- Allow admins to view ALL profiles (for UserManagement)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Allow admins to view ALL businesses regardless of status (for BusinessApprovals)
CREATE POLICY "Admins can view all businesses"
  ON public.businesses FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Allow admins to view ALL events regardless of status (for EventApprovals)
CREATE POLICY "Admins can view all events"
  ON public.events FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Replace permissive update policy with role-restricted version
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    CASE
      WHEN (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' THEN true
      ELSE role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
    END
  );
