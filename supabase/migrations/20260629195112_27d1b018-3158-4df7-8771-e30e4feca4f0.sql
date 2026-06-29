
-- 1. Fix seller_applications privilege escalation
DROP POLICY IF EXISTS "sa update own pending" ON public.seller_applications;

CREATE POLICY "sa update own pending"
ON public.seller_applications
FOR UPDATE
USING (
  ((auth.uid() = user_id) AND (status = 'pending'::seller_application_status))
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  (
    (auth.uid() = user_id)
    AND (status = 'pending'::seller_application_status)
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 2. Add UPDATE policy on listing-media so only the owning seller can overwrite their files
CREATE POLICY "listing-media seller update own"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listing-media'
  AND (storage.foldername(name))[1] = (auth.uid())::text
)
WITH CHECK (
  bucket_id = 'listing-media'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 3. Restrict EXECUTE on SECURITY DEFINER functions
-- handle_new_user is an auth trigger function; no app role should call it
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies; keep accessible to authenticated only,
-- revoke from anon/public so unauthenticated callers cannot probe roles
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
