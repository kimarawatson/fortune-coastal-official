INSERT INTO public.categories (slug, name, sort_order) VALUES
  ('real-estate','Real Estate',1),
  ('cars','Cars',2),
  ('yachts','Yachts',3),
  ('jets','Jets',4),
  ('experiences','Experiences',5)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.listings ALTER COLUMN seller_id DROP NOT NULL;

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS external_id text;
CREATE UNIQUE INDEX IF NOT EXISTS listings_external_id_key ON public.listings (external_id) WHERE external_id IS NOT NULL;