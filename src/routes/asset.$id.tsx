import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft, BadgeCheck, Bitcoin, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BackToSiteLink } from "@/components/BackToSiteLink";
import { getPublicListing, submitInquiry } from "@/lib/listings.functions";
import { formatBtc, formatUsd } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/asset/$id")({
  component: AssetDetail,
});

function AssetDetail() {
  const { id } = Route.useParams();
  const get = useServerFn(getPublicListing);
  const inquire = useServerFn(submitInquiry);
  const navigate = useNavigate();
  const { session } = useAuth();
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const q = useQuery({ queryKey: ["public-listing", id], queryFn: () => get({ data: { id } }) });

  if (q.isLoading) return <SiteLayout><div className="py-32 text-center text-muted-foreground">Loading…</div></SiteLayout>;
  if (!q.data) return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl text-foreground">Asset not found</h1>
        <Link to="/marketplace" className="mt-6 inline-block text-gold text-xs tracking-luxury uppercase">Return to Marketplace</Link>
      </div>
    </SiteLayout>
  );

  const { listing: a, images, sellerName } = q.data;
  const gallery = [a.cover_image, ...images.map((i: any) => i.image_url)].filter(Boolean) as string[];
  if (!gallery.length && a.cover_image) gallery.push(a.cover_image);

  async function send() {
    if (!session) { navigate({ to: "/auth" }); return; }
    if (msg.trim().length < 5) { toast.error("Please write a longer message."); return; }
    setSending(true);
    try {
      await inquire({ data: { listing_id: a.id, message: msg.trim() } });
      toast.success("Inquiry sent privately.");
      setMsg("");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not send inquiry.");
    } finally { setSending(false); }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-10">
        <div className="flex flex-wrap items-center gap-5">
          <BackToSiteLink />
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-muted-foreground hover:text-gold">
            <ArrowLeft size={14} /> Back to Marketplace
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-12">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
            {gallery[active] && <img src={gallery[active]} alt={a.title} className="h-full w-full object-cover" />}
            {a.verified && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/70 backdrop-blur-md border border-gold/30 px-2.5 py-1 text-[10px] tracking-luxury uppercase text-gold">
                <BadgeCheck size={12} /> Verified
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-[4/3] overflow-hidden border ${i === active ? "border-gold" : "border-border/40"}`}>
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold">{a.category_slug.replace(/-/g, " ")}</div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl text-foreground leading-tight">{a.title}</h1>
          {a.subtitle && <div className="mt-2 text-muted-foreground">{a.subtitle}</div>}
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} /> {a.location}{a.country ? `, ${a.country}` : ""}
          </div>

          <div className="hairline my-8" />

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Price (USD)</div>
              <div className="font-serif text-4xl text-foreground">{formatUsd(Number(a.price_usd))}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Bitcoin</div>
              <div className="text-lg text-gold font-medium">{formatBtc(a.price_btc)}</div>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{a.description}</p>

          <div className="mt-8 border border-border/40 p-6">
            <div className="text-[10px] tracking-luxury uppercase text-gold">Verified Seller</div>
            <div className="mt-2 font-serif text-xl text-foreground">{sellerName}</div>
          </div>

          <div className="mt-8 border border-border/40 p-6">
            <div className="text-[10px] tracking-luxury uppercase text-gold">Private Inquiry</div>
            {!session ? (
              <div className="mt-3 text-sm text-muted-foreground">
                <Link to="/auth" className="text-gold underline">Sign in</Link> to send a private inquiry to the seller.
              </div>
            ) : (
              <>
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder="Send a private message to the seller…" className="mt-3 w-full bg-charcoal border border-border/40 px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none" />
                <button onClick={send} disabled={sending} className="mt-3 w-full bg-gold text-primary-foreground px-6 py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft disabled:opacity-60">{sending ? "…" : "Inquire Privately"}</button>
              </>
            )}
            {a.accepts_btc && (
              <button className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-gold/60 text-gold px-6 py-4 text-xs tracking-luxury uppercase hover:bg-gold hover:text-primary-foreground transition-colors">
                <Bitcoin size={14} /> Buy with Bitcoin
              </button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
