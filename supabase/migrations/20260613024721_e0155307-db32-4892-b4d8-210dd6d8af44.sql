
CREATE POLICY "listing-media seller upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'listing-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "listing-media seller read own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'listing-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "listing-media seller delete own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'listing-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "listing-media admin all"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'listing-media' AND public.has_role(auth.uid(),'admin'))
WITH CHECK (bucket_id = 'listing-media' AND public.has_role(auth.uid(),'admin'));
