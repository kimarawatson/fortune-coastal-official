import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/SiteLayout";
import { listPublicListings } from "@/lib/listings.functions";
import { supabase } from "@/integrations/supabase/client";
import { formatBtc, formatUsd } from "@/lib/format";
import { BadgeCheck, Bitcoin, MapPin } from "lucide-react";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Fortune Coastal Group" },
      { name: "description", content: "Browse verified luxury real estate, supercars, yachts, jets, and concierge experiences." },
    ],
  }),
  component: Marketplace,
});

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: undefined },
  { label: "Under $1M", min: 0, max: 1_000_000 },
  { label: "$1M – $10M", min: 1_000_000, max: 10_000_000 },
  { label: "$10M – $50M", min: 10_000_000, max: 50_000_000 },
  { label: "$50M+", min: 50_000_000, max: undefined },
];

function Marketplace() {
  const list = useServerFn(listPublicListings);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [priceIdx, setPriceIdx] = useState(0);
  const [btcOnly, setBtcOnly] = useState(false);

  const catsQ = useQuery({ queryKey: ["categories"], queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data ?? [] });
  const range = PRICE_RANGES[priceIdx];
  const q = useQuery({
    queryKey: ["public-listings", category, country, priceIdx, btcOnly],
    queryFn: () => list({ data: { category: category || null, country: country || null, btcOnly, minPrice: range.min ?? null, maxPrice: range.max ?? null } }),
  });

  const countries = useMemo(() => Array.from(new Set((q.data ?? []).map((l: any) => l.country))).sort(), [q.data]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-12">
        <div className="text-[10px] tracking-luxury uppercase text-gold">The Marketplace</div>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl text-foreground">A Curated <span className="italic gradient-gold-text">World</span> of Assets</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">Every listing is verified by our in-house specialists. Filter to begin.</p>
      </section>

      <section className="border-y border-border/40 bg-charcoal/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 grid gap-4 md:grid-cols-4">
          <Sel label="Category" value={category} onChange={setCategory} options={[{ value: "", label: "All Categories" }, ...((catsQ.data ?? []) as any[]).map((c: any) => ({ value: c.slug, label: c.name }))]} />
          <Sel label="Country" value={country} onChange={setCountry} options={[{ value: "", label: "All Countries" }, ...countries.map((c) => ({ value: c as string, label: c as string }))]} />
          <Sel label="Price Range" value={String(priceIdx)} onChange={(v) => setPriceIdx(Number(v))} options={PRICE_RANGES.map((p, i) => ({ value: String(i), label: p.label }))} />
          <label className="flex items-center justify-between border border-border/40 bg-background/60 px-4">
            <span className="text-[10px] tracking-luxury uppercase text-muted-foreground">Bitcoin Accepted</span>
            <button type="button" onClick={() => setBtcOnly(!btcOnly)} className={`relative h-6 w-11 transition-colors ${btcOnly ? "bg-gold" : "bg-border"}`}>
              <span className={`absolute top-0.5 h-5 w-5 bg-background transition-transform ${btcOnly ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="mb-8 text-xs tracking-luxury uppercase text-muted-foreground">
          {q.isLoading ? "Loading…" : `${(q.data ?? []).length} ${(q.data ?? []).length === 1 ? "Asset" : "Assets"}`}
        </div>
        {!q.isLoading && !(q.data ?? []).length ? (
          <div className="text-center py-32 border border-border/40">
            <div className="font-serif text-2xl text-foreground">No assets match your criteria</div>
            <p className="mt-2 text-sm text-muted-foreground">Adjust the filters to broaden your search.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(q.data ?? []).map((l: any) => <ListingCard key={l.id} l={l} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function ListingCard({ l }: { l: any }) {
  return (
    <Link to="/asset/$id" params={{ id: l.id }} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
        {l.cover_image && <img src={l.cover_image} alt={l.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
        {l.verified && <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/70 backdrop-blur-md border border-gold/30 px-2 py-1 text-[10px] tracking-luxury uppercase text-gold"><BadgeCheck size={11} />Verified</div>}
        {l.accepts_btc && <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-md border border-gold/30 px-2 py-1 text-gold"><Bitcoin size={11} /></div>}
      </div>
      <div className="mt-4">
        <div className="text-[10px] tracking-luxury uppercase text-gold">{l.category_slug.replace(/-/g, " ")}</div>
        <div className="mt-1 font-serif text-xl text-foreground group-hover:text-gold transition-colors">{l.title}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={11} /> {l.location}</div>
        <div className="mt-3 flex items-end justify-between">
          <div className="font-serif text-lg text-foreground">{formatUsd(Number(l.price_usd))}</div>
          <div className="text-xs text-gold">{formatBtc(l.price_btc)}</div>
        </div>
      </div>
    </Link>
  );
}

function Sel({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block border border-border/40 bg-background/60 px-4 py-2">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm text-foreground py-1 focus:outline-none cursor-pointer">
        {options.map((o) => <option key={o.value} value={o.value} className="bg-background">{o.label}</option>)}
      </select>
    </label>
  );
}
