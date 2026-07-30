-- Market intelligence metrics (public read)
CREATE TABLE IF NOT EXISTS public.market_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  delta text,
  trend text NOT NULL DEFAULT 'flat',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.market_metrics TO anon, authenticated;
GRANT ALL ON public.market_metrics TO service_role;
ALTER TABLE public.market_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "market_metrics public read" ON public.market_metrics;
CREATE POLICY "market_metrics public read" ON public.market_metrics FOR SELECT TO anon, authenticated USING (true);

-- Recently sold ticker (public read)
CREATE TABLE IF NOT EXISTS public.recent_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  price_usd numeric NOT NULL,
  settlement text NOT NULL DEFAULT 'USD',
  sold_at date NOT NULL DEFAULT current_date,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.recent_sales TO anon, authenticated;
GRANT ALL ON public.recent_sales TO service_role;
ALTER TABLE public.recent_sales ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recent_sales public read" ON public.recent_sales;
CREATE POLICY "recent_sales public read" ON public.recent_sales FOR SELECT TO anon, authenticated USING (true);

-- Global luxury map markers (public read)
CREATE TABLE IF NOT EXISTS public.map_markers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  region text,
  headline text NOT NULL,
  x numeric NOT NULL,
  y numeric NOT NULL,
  btc_accepted boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.map_markers TO anon, authenticated;
GRANT ALL ON public.map_markers TO service_role;
ALTER TABLE public.map_markers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "map_markers public read" ON public.map_markers;
CREATE POLICY "map_markers public read" ON public.map_markers FOR SELECT TO anon, authenticated USING (true);

-- Membership requests (anyone may apply; only service role reads)
CREATE TABLE IF NOT EXISTS public.membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  interest text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.membership_requests TO anon, authenticated;
GRANT ALL ON public.membership_requests TO service_role;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "membership anyone apply" ON public.membership_requests;
CREATE POLICY "membership anyone apply" ON public.membership_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Seed content
INSERT INTO public.market_metrics (label, value, delta, trend, sort_order)
SELECT * FROM (VALUES
  ('Luxury Home Index', '412.8', '+4.2%', 'up', 1),
  ('Luxury Market Volume', '$18.4B', '+2.6%', 'up', 2),
  ('Tokenized Assets', '$6.1B', '+11.3%', 'up', 3),
  ('Countries Active', '58', '+3', 'up', 4),
  ('Properties Listed', '5,431', '+128', 'up', 5),
  ('Avg. Days to Settle', '9', '-2', 'down', 6)
) v(label, value, delta, trend, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.market_metrics);

INSERT INTO public.recent_sales (title, location, price_usd, settlement, sort_order)
SELECT * FROM (VALUES
  ('Malibu Oceanfront Estate', 'Malibu, California', 38000000::numeric, 'Purchased with BTC', 1),
  ('Manhattan Skyline Penthouse', 'New York, New York', 27500000::numeric, 'Private Sale', 2),
  ('Palm Beach Waterfront Villa', 'Palm Beach, Florida', 61000000::numeric, 'Closed', 3),
  ('Aspen Mountain Chalet', 'Aspen, Colorado', 19400000::numeric, 'Purchased with BTC', 4),
  ('Hamptons Dune Compound', 'East Hampton, New York', 44250000::numeric, 'Closed', 5),
  ('Beverly Hills Modern Estate', 'Beverly Hills, California', 52000000::numeric, 'Private Sale', 6)
) v(title, location, price_usd, settlement, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.recent_sales);

INSERT INTO public.map_markers (city, region, headline, x, y, btc_accepted, sort_order)
SELECT * FROM (VALUES
  ('Los Angeles', 'California', '$84M Cliffside Villa', 14.5::numeric, 40::numeric, true, 1),
  ('Miami', 'Florida', '$61M Waterfront Estate', 23::numeric, 47::numeric, true, 2),
  ('New York', 'New York', '$27M Skyline Penthouse', 27::numeric, 36::numeric, true, 3),
  ('Bahamas', 'Caribbean', 'Private Island', 26::numeric, 50::numeric, true, 4),
  ('London', 'United Kingdom', '$40M Mayfair Residence', 47::numeric, 30::numeric, false, 5),
  ('Monaco', 'French Riviera', '$52M Sea-View Penthouse', 50::numeric, 35::numeric, true, 6),
  ('Dubai', 'United Arab Emirates', '$70M Palm Mansion', 61::numeric, 45::numeric, true, 7),
  ('Singapore', 'Singapore', '$33M Marina Residence', 74::numeric, 56::numeric, false, 8),
  ('Tokyo', 'Japan', '$29M Azabu Tower Home', 83::numeric, 38::numeric, true, 9)
) v(city, region, headline, x, y, btc_accepted, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.map_markers);