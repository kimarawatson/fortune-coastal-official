GRANT SELECT ON public.listings TO anon, authenticated;
GRANT SELECT ON public.listing_images TO anon, authenticated;
GRANT SELECT ON public.homepage_content TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_images TO authenticated;
GRANT SELECT, UPDATE ON public.homepage_content TO authenticated;