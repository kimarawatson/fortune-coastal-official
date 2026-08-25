INSERT INTO public.categories (slug, name, sort_order) VALUES
  ('motorcycles', 'Motorcycles', 5),
  ('jewelry', 'Jewelry', 6)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

DELETE FROM public.categories WHERE slug = 'experiences'
  AND NOT EXISTS (SELECT 1 FROM public.listings WHERE category_slug = 'experiences');

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS external_id text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE public.listings ALTER COLUMN seller_id DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS listings_external_id_key ON public.listings (external_id) WHERE external_id IS NOT NULL;