import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, MapPin, Calendar, Building2, Sparkles, Maximize2, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import miami from "@/assets/dev-6.png";
import california from "@/assets/dev-7.png";
import vegas from "@/assets/dev-8.png";
import macao from "@/assets/dev-9.png";
import miamiDetail from "@/assets/dev-6-detail.jpg";
import californiaDetail from "@/assets/dev-7-detail.jpg";
import vegasDetail from "@/assets/dev-8-detail.jpg";
import macaoDetail from "@/assets/dev-9-detail.jpg";

type Zone = { zone: string; level: string; title: string; lines: string[] };
type Dev = {
  slug: string;
  name: string;
  city: string;
  region: string;
  status: string;
  completion: string;
  image: string;
  detailImage: string;
  tagline: string;
  description: string[];
  zones: Zone[];
  highlights: string[];
};

const towerZones = (views: string, dining: string): Zone[] => [
  {
    zone: "Zone 5",
    level: "Level 60 – 61",
    title: "Meozzi Zorah Sky Center",
    lines: ["Private Sky Club", "Celestial Lounge", "Observatory", "Sky Gardens"],
  },
  {
    zone: "Zone 4",
    level: "Level 58 – 59",
    title: "Elice Penthouse",
    lines: ["Ultra Luxury Penthouses", "Private Terraces", "Infinite Views"],
  },
  {
    zone: "Zone 4",
    level: "Levels 50 – 57",
    title: "Star Penthouses",
    lines: ["Signature Penthouses", "Panoramic Terraces", "Private Elevators"],
  },
  {
    zone: "Zone 3",
    level: "Levels 34 – 49",
    title: "Half Floor Residences",
    lines: ["Spacious Residences", "Floor to Ceiling Views"],
  },
  {
    zone: "Zone 2",
    level: "Levels 26 – 33",
    title: "Half Floor Residences",
    lines: ["Premium Residences", views],
  },
  {
    zone: "Zone 2",
    level: "Levels 15 – 25",
    title: "Half Floor Residences",
    lines: ["Modern Living", "Resort Style Amenities"],
  },
  {
    zone: "Zone 1",
    level: "Levels 10 – 14",
    title: "Star Townhouse",
    lines: ["Townhouse Residences", "Private Entrances", "Garden Terraces"],
  },
  {
    zone: "Zone 1",
    level: "Levels 8 – 9",
    title: "Wellness & Spa",
    lines: ["Indoor Outdoor Wellness & Spa", "Fitness", "Recovery", "Meditation"],
  },
  {
    zone: "Ground",
    level: "Levels 1 – 7",
    title: "Podium",
    lines: ["Arrival Lobby", dining, "Retail", "Event Spaces", "Art Galleries", "Parking & Services"],
  },
];

const developments: Record<string, Dev> = {
  miami: {
    slug: "miami",
    name: "Meozzi Star Tower",
    city: "Miami",
    region: "Florida, USA",
    status: "Pre-Development",
    completion: "2030",
    image: miami,
    detailImage: miamiDetail,
    tagline: "Architecture that moves. Living that inspires.",
    description: [
      "Meozzi Star Tower Miami is a sculpted, spiraling landmark designed for a new era of waterfront living. Envisioned as a vertical resort, the tower fuses full-floor private residences with a curated program of hospitality, wellness, and sky-level social clubs.",
      "Every residence is oriented to capture panoramic views of the Atlantic, downtown Miami, and Biscayne Bay, with private outdoor terraces, plunge pools, and sunrise-to-sunset light.",
    ],
    zones: towerZones("Ocean & City Views", "Restaurants"),
    highlights: [
      "Iconic Design by Vision",
      "Timeless Luxury Curated",
      "Miami Waterfront Living",
      "Wellness & Elevated Life",
    ],
  },
  california: {
    slug: "california",
    name: "Meozzi Star Tower",
    city: "Los Angeles",
    region: "California, USA",
    status: "Pre-Development",
    completion: "2031",
    image: california,
    detailImage: californiaDetail,
    tagline: "Vision born in California. Excellence reaches the stars.",
    description: [
      "Rising along the California coast, Meozzi Star Tower California pairs cinematic ocean views with the disciplined elegance of West Coast modernism. The pointed crown is designed as a signature marker on the Pacific horizon.",
      "Interiors are curated by an award-winning studio, with a private members' club, screening rooms, and a full wellness deck reserved for residents and their guests.",
    ],
    zones: towerZones("Ocean & City Views", "Restaurants"),
    highlights: [
      "California Lifestyle",
      "Ocean View Living",
      "Iconic Design by Vision",
      "Sustainable Future",
      "Wellness Focused",
      "Exclusive Luxury",
      "Made for California",
    ],
  },
  vegas: {
    slug: "vegas",
    name: "Meozzi Star Tower",
    city: "Las Vegas",
    region: "Nevada, USA",
    status: "Pre-Development",
    completion: "2032",
    image: vegas,
    detailImage: vegasDetail,
    tagline: "Above the city. Beyond extraordinary.",
    description: [
      "A visionary icon in the entertainment capital of the world. Meozzi Star Tower Las Vegas is designed as a private counterpoint to the city — a residential sanctuary elevated far above the entertainment core.",
      "The property includes private members' salons, a rooftop pool club, and dedicated concierge programming for owners and their guests.",
    ],
    zones: towerZones("Strip & City Views", "Fine Dining"),
    highlights: [
      "Iconic Design by Vision",
      "Timeless Luxury Curated",
      "Las Vegas Lifestyle",
      "Strip & City Views",
      "Exclusive Amenities",
      "World Class Hospitality",
      "Security & Privacy",
    ],
  },
  macao: {
    slug: "macao",
    name: "Meozzi Star Tower",
    city: "Macao",
    region: "Macao, China",
    status: "Pre-Development",
    completion: "2033",
    image: macao,
    detailImage: macaoDetail,
    tagline: "Where vision meets legacy. A new star rises over Macao.",
    description: [
      "Set on the Macao waterfront, Meozzi Star Tower Macao anchors a new luxury district that honors the city's heritage while projecting a distinctly modern silhouette across the harbor.",
      "Ground-floor arcades open onto public promenades, while upper floors offer private residences, hospitality suites, and members-only sky lounges with sweeping views of the Pearl River Delta.",
    ],
    zones: towerZones("City & Waterfront Views", "Fine Dining"),
    highlights: [
      "Iconic Design by Vision",
      "Timeless Luxury Curated",
      "Macao Heritage Inspired",
      "Waterfront Living",
      "World Class Amenities",
      "Exclusive Lifestyle",
      "Security & Privacy",
    ],
  },
};

export const Route = createFileRoute("/developments/$slug")({
  loader: ({ params }): { dev: Dev } => {
    const dev = developments[params.slug];
    if (!dev) throw notFound();
    return { dev };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.dev.name} — ${loaderData.dev.city} | Fortune Coastal Group` },
          { name: "description", content: loaderData.dev.tagline },
          { property: "og:title", content: `${loaderData.dev.name} — ${loaderData.dev.city}` },
          { property: "og:description", content: loaderData.dev.tagline },
          { property: "og:image", content: loaderData.dev.image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:image", content: loaderData.dev.image },
        ]
      : [{ title: "Development — Fortune Coastal Group" }],
  }),
  component: DevelopmentDetail,
});


function DevelopmentDetail() {
  const { dev } = Route.useLoaderData();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewerOpen(false);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 5));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 0.5));
      if (e.key === "0") setZoom(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) setZoom(1);
  }, [viewerOpen]);

  return (
    <SiteLayout>
      {/* Back nav */}
      <div className="sticky top-24 z-30 pointer-events-none">
        <div className="mx-auto max-w-[1700px] px-4 lg:px-8">
          <Link
            to="/developments"
            className="pointer-events-auto inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-gold hover:text-gold-soft transition-colors backdrop-blur-sm bg-background/40 px-4 py-2 rounded-full border border-gold/20"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Developments
          </Link>
        </div>
      </div>

      {/* Hero — reduced height */}
      <section className="relative -mt-24 h-[70vh] min-h-[520px] w-full overflow-hidden flex items-end">
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          className="absolute inset-0 h-full w-full group cursor-zoom-in"
          aria-label={`View full image of ${dev.name} ${dev.city}`}
        >
          <img
            src={dev.image}
            alt={`${dev.name} — ${dev.city}`}
            className="absolute inset-0 h-full w-full object-contain md:object-cover object-center bg-black transition-transform duration-[1.6s] group-hover:scale-[1.02]"
          />
        </button>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

        <div className="relative w-full mx-auto max-w-[1700px] px-4 lg:px-8 pb-16 pt-32 pointer-events-none">
          <Reveal>
            <div className="text-[11px] tracking-[0.4em] uppercase text-gold">{dev.name}</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-3 font-serif text-5xl md:text-7xl tracking-[0.08em] text-foreground">
              {dev.city.toUpperCase()}
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">{dev.tagline}</p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[11px] tracking-luxury uppercase">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} className="text-gold" strokeWidth={1.5} />
                {dev.region}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 size={14} className="text-gold" strokeWidth={1.5} />
                {dev.status}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={14} className="text-gold" strokeWidth={1.5} />
                Est. Completion {dev.completion}
              </div>
            </div>
          </Reveal>
          <Reveal delay={3}>
            <button
              type="button"
              onClick={() => setViewerOpen(true)}
              className="pointer-events-auto mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-gold to-gold-soft text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity"
            >
              <Maximize2 size={14} strokeWidth={1.75} />
              View Full Rendering
            </button>
          </Reveal>
        </div>
      </section>

      {/* Description + Zones — compact */}
      <section className="mx-auto max-w-[1700px] px-4 lg:px-8 py-20 grid gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-gold/40" />
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold">The Vision</h2>
          </div>
          <div className="space-y-4">
            {dev.description.map((p: string, i: number) => (
              <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-gold to-gold-soft text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity"
            >
              Request Investment Deck
            </Link>
            <Link
              to="/developments"
              className="inline-block border border-gold/40 text-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-gold/10 transition-colors"
            >
              All Developments
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-gold/40" />
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold">Tower Program</h2>
          </div>
          <ul className="space-y-4">
            {dev.zones.map((z: Zone) => (
              <li key={z.level} className="border-l-2 border-gold/40 pl-4 py-0.5">
                <div className="flex items-baseline gap-3">
                  <div className="text-[9px] tracking-[0.35em] uppercase text-gold-soft">{z.level}</div>
                  <div className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground/70">{z.zone}</div>
                </div>
                <div className="mt-1 font-serif text-lg md:text-xl tracking-[0.05em] text-foreground">
                  {z.title.toUpperCase()}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                  {z.lines.map((line: string) => (
                    <span
                      key={line}
                      className="text-[10px] tracking-luxury uppercase text-muted-foreground"
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3 text-[10px] tracking-luxury uppercase text-muted-foreground">
            <Sparkles size={12} className="text-gold" strokeWidth={1.5} />
            Concept illustration — subject to final design
          </div>
        </div>
      </section>

      {/* Signature highlights */}
      <section className="mx-auto max-w-[1700px] px-4 lg:px-8 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-12 bg-gold/40" />
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold">Signature Highlights</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-y-8 gap-x-6">
          {dev.highlights.map((h: string, i: number) => (
            <Reveal key={h} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-12 w-12 rounded-full border border-gold/30 flex items-center justify-center">
                  <Sparkles size={16} className="text-gold" strokeWidth={1.5} />
                </div>
                <div className="text-[10px] tracking-luxury uppercase text-muted-foreground leading-relaxed">
                  {h}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* Fullscreen image viewer with zoom */}
      {viewerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-hidden"
          onClick={() => setViewerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${dev.name} ${dev.city} full rendering`}
        >
          <div className="absolute top-6 left-6 z-10 text-[11px] tracking-[0.35em] uppercase text-gold-soft">
            {dev.name} — {dev.city}
          </div>

          {/* Zoom controls */}
          <div
            className="absolute top-6 right-6 z-10 flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 border border-gold/30 rounded-full bg-black/60 backdrop-blur-sm px-1.5 py-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                className="p-2 text-gold hover:text-gold-soft transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={16} strokeWidth={1.75} />
              </button>
              <div className="text-[10px] tracking-luxury uppercase text-gold-soft w-12 text-center tabular-nums">
                {Math.round(zoom * 100)}%
              </div>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.25, 5))}
                className="p-2 text-gold hover:text-gold-soft transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn size={16} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="p-2 text-gold hover:text-gold-soft transition-colors"
                aria-label="Reset zoom"
              >
                <RotateCcw size={14} strokeWidth={1.75} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setViewerOpen(false)}
              className="inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-gold hover:text-gold-soft border border-gold/30 rounded-full px-4 py-2 bg-black/60 backdrop-blur-sm"
              aria-label="Close viewer"
            >
              <X size={16} strokeWidth={1.75} />
              Close
            </button>
          </div>

          <div
            className="w-full h-full flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              if (e.deltaY < 0) setZoom((z) => Math.min(z + 0.1, 5));
              else setZoom((z) => Math.max(z - 0.1, 0.5));
            }}
          >
            <img
              src={dev.image}
              alt={`${dev.name} — ${dev.city} full rendering`}
              draggable={false}
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 200ms ease-out" }}
              className="max-h-[92vh] max-w-[96vw] object-contain select-none"
            />
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
