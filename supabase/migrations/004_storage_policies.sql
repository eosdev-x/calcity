-- Add DELETE policy for business-photos (owners can delete their own photos)
CREATE POLICY "Owners can delete business photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business-photos' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

-- Replace INSERT policy with scoped version (owners can only upload to their own business folder)
DROP POLICY IF EXISTS "Authenticated can upload business photos" ON storage.objects;
CREATE POLICY "Owners can upload business photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-photos' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

-- NOTE: Configure bucket-level limits in Supabase Dashboard:
-- business-photos bucket: max file size = 2MB, allowed MIME types = image/jpeg, image/png, image/webp
