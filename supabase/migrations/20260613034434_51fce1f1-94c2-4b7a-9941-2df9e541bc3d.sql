DROP POLICY IF EXISTS "profiles read all signed-in" ON public.profiles;
CREATE POLICY "profiles read own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "listings seller delete own" ON public.listings;
CREATE POLICY "listings seller delete own" ON public.listings FOR DELETE TO authenticated USING (auth.uid() = seller_id AND public.has_role(auth.uid(), 'seller'));

CREATE POLICY "listing-media public read approved" ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'listing-media' AND (
    EXISTS (SELECT 1 FROM public.listings l WHERE l.status = 'approved' AND l.cover_image LIKE '%' || storage.objects.name)
    OR EXISTS (SELECT 1 FROM public.listing_images li JOIN public.listings l ON l.id = li.listing_id WHERE l.status = 'approved' AND li.image_url LIKE '%' || storage.objects.name)
  )
);