import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  ArrowLeft, BadgeCheck, Bitcoin, MapPin, ChevronLeft, ChevronRight,
  Maximize2, X, ZoomIn, ZoomOut, RotateCcw,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { getPublicListing, submitInquiry } from "@/lib/listings.functions";
import { formatBtc, formatUsd } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { useBtcPrice } from "@/hooks/use-btc-price";

/** Upgrade JamesEdition thumbnails to their 2x rendition for crisp full-screen viewing. */
function hiRes(url: string) {
  return url.replace("/556x342xcxm.", "/1112x684xcxm.");
}

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
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const btc = useBtcPrice();

  const q = useQuery({ queryKey: ["public-listing", id], queryFn: () => get({ data: { id } }) });

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewerOpen]);

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
  const gallery = Array.from(
    new Set(
      [a.cover_image, ...images.map((i: any) => i.image_url)].filter(Boolean) as string[],
    ),
  );
  const index = Math.min(active, Math.max(0, gallery.length - 1));
  const step = (dir: number) =>
    setActive((i) => (gallery.length ? (i + dir + gallery.length) % gallery.length : 0));
  const scrollThumbs = (dir: number) =>
    thumbsRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  const usd = Number(a.price_usd);
  const btcAmount = a.price_btc != null ? Number(a.price_btc) : btc ? usd / btc.price : null;

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
      <div className="mx-auto max-w-[1700px] px-4 lg:px-8 pt-10">
        <div className="flex flex-wrap items-center gap-5">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-muted-foreground hover:text-gold">
            <ArrowLeft size={14} /> Back to Marketplace
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-[1700px] px-4 lg:px-8 mt-8 grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="max-w-[900px]">
          <div className="group relative aspect-[16/10] overflow-hidden bg-charcoal">
            {gallery[index] && (
              <img
                src={hiRes(gallery[index])}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = gallery[index]; }}
                alt={a.title}
                className="h-full w-full object-cover cursor-zoom-in"
                onClick={() => { setZoom(1); setViewerOpen(true); }}
              />
            )}
            {a.verified && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/70 backdrop-blur-md border border-gold/30 px-2.5 py-1 text-[10px] tracking-luxury uppercase text-gold">
                <BadgeCheck size={12} /> Verified
              </div>
            )}
            <button
              type="button"
              onClick={() => { setZoom(1); setViewerOpen(true); }}
              className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/70 backdrop-blur-md px-4 py-2 text-[10px] tracking-luxury uppercase text-gold hover:bg-gold hover:text-primary-foreground transition-colors"
            >
              <Maximize2 size={13} /> Full Screen
            </button>
            {gallery.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-background/60 backdrop-blur-md text-gold hover:bg-gold hover:text-primary-foreground transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-background/60 backdrop-blur-md text-gold hover:bg-gold hover:text-primary-foreground transition-colors">
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-4 right-4 rounded-full bg-background/70 backdrop-blur-md border border-gold/25 px-3 py-1 text-[10px] tracking-luxury text-gold tabular-nums">
                  {index + 1} / {gallery.length}
                </div>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="relative mt-4">
              <button type="button" onClick={() => scrollThumbs(-1)} aria-label="Scroll thumbnails left"
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-background/80 backdrop-blur-md text-gold hover:bg-gold hover:text-primary-foreground transition-colors">
                <ChevronLeft size={16} />
              </button>
              <div ref={thumbsRef} className="flex gap-3 overflow-x-auto scroll-smooth px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {gallery.map((g, i) => (
                  <button
                    key={g}
                    onClick={() => setActive(i)}
                    className={`shrink-0 w-36 aspect-[4/3] overflow-hidden border transition-colors ${i === index ? "border-gold" : "border-border/40 hover:border-gold/50"}`}
                  >
                    <img src={g} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
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
              <div className="font-serif text-4xl text-foreground">{formatUsd(usd)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Bitcoin</div>
              <div className="text-lg text-gold font-medium tabular-nums">
                {btcAmount != null
                  ? `₿ ${btcAmount.toLocaleString("en-US", { maximumFractionDigits: btcAmount < 10 ? 4 : 2 })}`
                  : formatBtc(null)}
              </div>
              {btc && (
                <div className="mt-1 text-[10px] tracking-luxury uppercase text-muted-foreground tabular-nums">
                  Live BTC ${btc.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  <span className={btc.change24h >= 0 ? " text-emerald-400" : " text-destructive"}>
                    {" "}{btc.change24h >= 0 ? "+" : ""}{btc.change24h.toFixed(2)}%
                  </span>
                </div>
              )}
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

      {viewerOpen && gallery[index] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={`${a.title} full screen gallery`}
          onClick={() => setViewerOpen(false)}
        >
          <div className="absolute top-6 left-6 z-10 text-[11px] tracking-[0.35em] uppercase text-gold-soft">
            {a.title} — {index + 1} / {gallery.length}
          </div>

          <div className="absolute top-6 right-6 z-10 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1 border border-gold/30 rounded-full bg-black/60 backdrop-blur-sm px-1.5 py-1">
              <button type="button" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))} className="p-2 text-gold hover:text-gold-soft" aria-label="Zoom out"><ZoomOut size={16} /></button>
              <div className="text-[10px] tracking-luxury uppercase text-gold-soft w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</div>
              <button type="button" onClick={() => setZoom((z) => Math.min(z + 0.25, 5))} className="p-2 text-gold hover:text-gold-soft" aria-label="Zoom in"><ZoomIn size={16} /></button>
              <button type="button" onClick={() => setZoom(1)} className="p-2 text-gold hover:text-gold-soft" aria-label="Reset zoom"><RotateCcw size={14} /></button>
            </div>
            <button type="button" onClick={() => setViewerOpen(false)} className="inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-gold hover:text-gold-soft border border-gold/30 rounded-full px-4 py-2 bg-black/60 backdrop-blur-sm" aria-label="Close viewer">
              <X size={16} /> Close
            </button>
          </div>

          {gallery.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); setZoom(1); step(-1); }} aria-label="Previous image"
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-black/60 backdrop-blur-sm text-gold hover:text-gold-soft">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setZoom(1); step(1); }} aria-label="Next image"
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-black/60 backdrop-blur-sm text-gold hover:text-gold-soft">
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div
            className="w-full h-full flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
              setZoom((z) => Math.min(5, Math.max(0.5, z * Math.exp(-dy * 0.0015))));
            }}
          >
            <img
              src={hiRes(gallery[index])}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = gallery[index]; }}
              alt={a.title}
              draggable={false}
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 200ms ease-out" }}
              className="max-h-[55vh] max-w-[60vw] object-contain select-none"
            />
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
