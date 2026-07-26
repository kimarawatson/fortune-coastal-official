import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, MapPin, Calendar, Building2, Sparkles, Maximize2, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import miami from "@/assets/dev-6.png";
import california from "@/assets/dev-7.png";
import vegas from "@/assets/dev-8.png";
import macao from "@/assets/dev-9.png";

type Zone = { level: string; title: string; lines: string[] };
type Dev = {
  slug: string;
  name: string;
  city: string;
  region: string;
  status: string;
  completion: string;
  image: string;
  tagline: string;
  description: string[];
  zones: Zone[];
};

const commonZones = (): Zone[] => [
  {
    level: "Crown",
    title: "Sky Center & Observatory",
    lines: ["Private Observatory Lounge", "Champagne Bar", "360° Skyline Views"],
  },
  {
    level: "Levels 46 – 58",
    title: "Sky Villas & Penthouses",
    lines: ["Full-Floor Penthouses", "Private Elevators", "Wraparound Terraces"],
  },
  {
    level: "Levels 26 – 45",
    title: "Signature Residences",
    lines: ["Full-Floor Residences", "Private Plunge Pools", "Sunrise to Sunset Light"],
  },
  {
    level: "Levels 15 – 25",
    title: "Half Floor Residences",
    lines: ["Modern Living", "Resort Style Amenities"],
  },
  {
    level: "Levels 10 – 14",
    title: "Star Townhouse",
    lines: ["Townhouse Residences", "Private Entrances", "Garden Terraces"],
  },
  {
    level: "Levels 1 – 9",
    title: "Wellness & Spa",
    lines: ["Aquatics Center", "Spa Suites", "Fitness & Pilates Studios"],
  },
  {
    level: "Podium",
    title: "Arrival & Motor Lobby",
    lines: ["Grand Motor Court", "Concierge Gallery", "Members' Salon"],
  },
];

const developments: Record<string, Dev> = {
  miami: {
    slug: "miami",
    name: "Fortune Coastal Tower",
    city: "Miami",
    region: "Florida, USA",
    status: "Pre-Development",
    completion: "2030",
    image: miami,
    tagline: "A vertical resort rising above Biscayne Bay.",
    description: [
      "Fortune Coastal Tower Miami is a sculpted, spiraling landmark designed for a new era of oceanfront living. Envisioned as a vertical resort, the tower fuses full-floor private residences with a curated program of hospitality, wellness, and sky-level social clubs.",
      "Every residence is oriented to capture panoramic views of the Atlantic, downtown Miami, and Biscayne Bay, with private outdoor terraces, plunge pools, and sunrise-to-sunset light.",
    ],
    zones: commonZones(),
  },
  california: {
    slug: "california",
    name: "Fortune Coastal Tower",
    city: "Los Angeles",
    region: "California, USA",
    status: "Pre-Development",
    completion: "2031",
    image: california,
    tagline: "A pointed silhouette on the Pacific skyline.",
    description: [
      "Rising along the California coast, Fortune Coastal Tower Los Angeles pairs cinematic ocean views with the disciplined elegance of West Coast modernism. The pointed crown is designed as a signature marker on the Pacific horizon.",
      "Interiors are curated by an award-winning studio, with a private members' club, screening rooms, and a full wellness deck reserved for residents and their guests.",
    ],
    zones: commonZones(),
  },
  vegas: {
    slug: "vegas",
    name: "Fortune Coastal Tower",
    city: "Las Vegas",
    region: "Nevada, USA",
    status: "Pre-Development",
    completion: "2032",
    image: vegas,
    tagline: "Iconic architecture on the world's most watched street.",
    description: [
      "A luminous, sculpted tower rising over the Las Vegas Strip. Fortune Coastal Tower Las Vegas is designed as a private counterpoint to the city — a residential sanctuary elevated far above the entertainment core.",
      "The property includes a private grand casino salon, a rooftop pool club, and dedicated concierge programming for owners and their guests.",
    ],
    zones: commonZones(),
  },
  macao: {
    slug: "macao",
    name: "Fortune Coastal Tower",
    city: "Macao",
    region: "Macao, China",
    status: "Pre-Development",
    completion: "2033",
    image: macao,
    tagline: "A harbor landmark bridging heritage and horizon.",
    description: [
      "Set on the Macao waterfront, Fortune Coastal Tower Macao anchors a new luxury district that honors the city's Portuguese heritage while projecting a distinctly modern silhouette across the harbor.",
      "Ground-floor arcades open onto public promenades, while upper floors offer private residences, hospitality suites, and members-only sky lounges with sweeping views of the Pearl River Delta.",
    ],
    zones: commonZones(),
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

  return (
    <SiteLayout>
      {/* Back nav */}
      <div className="sticky top-24 z-30 pointer-events-none">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link
            to="/developments"
            className="pointer-events-auto inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-gold hover:text-gold-soft transition-colors backdrop-blur-sm bg-background/40 px-4 py-2 rounded-full border border-gold/20"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Developments
          </Link>
        </div>
      </div>

      {/* Big hero */}
      <section className="relative -mt-24 min-h-screen w-full overflow-hidden flex items-end">
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

        <div className="relative w-full mx-auto max-w-7xl px-6 lg:px-10 pb-24 pt-40 pointer-events-none">
          <Reveal>
            <div className="text-[11px] tracking-[0.4em] uppercase text-gold">{dev.name}</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-4 font-serif text-6xl md:text-8xl tracking-[0.08em] text-foreground">
              {dev.city.toUpperCase()}
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{dev.tagline}</p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-[11px] tracking-luxury uppercase">
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
              className="pointer-events-auto mt-10 inline-flex items-center gap-3 bg-gradient-to-r from-gold to-gold-soft text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity"
            >
              <Maximize2 size={14} strokeWidth={1.75} />
              View Full Rendering
            </button>
          </Reveal>
        </div>
      </section>

      {/* Description + Zones */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 grid gap-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-gold/40" />
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold">The Vision</h2>
          </div>
          <div className="space-y-6">
            {dev.description.map((p: string, i: number) => (
              <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-gold to-gold-soft text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity"
            >
              Request Investment Deck
            </Link>
            <Link
              to="/developments"
              className="inline-block border border-gold/40 text-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:bg-gold/10 transition-colors"
            >
              All Developments
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-gold/40" />
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold">Tower Program</h2>
          </div>
          <ul className="space-y-6">
            {dev.zones.map((z: Zone) => (
              <li key={z.level} className="border-l-2 border-gold/40 pl-6 py-1">
                <div className="text-[10px] tracking-[0.35em] uppercase text-gold-soft">{z.level}</div>
                <div className="mt-2 font-serif text-2xl md:text-3xl tracking-[0.05em] text-foreground">
                  {z.title.toUpperCase()}
                </div>
                <div className="mt-3 space-y-1">
                  {z.lines.map((line: string) => (
                    <div
                      key={line}
                      className="text-[11px] tracking-luxury uppercase text-muted-foreground"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3 text-[11px] tracking-luxury uppercase text-muted-foreground">
            <Sparkles size={14} className="text-gold" strokeWidth={1.5} />
            Concept illustration — subject to final design
          </div>
        </div>
      </section>

      {/* Fullscreen image viewer */}
      {viewerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setViewerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${dev.name} ${dev.city} full rendering`}
        >
          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            className="absolute top-6 right-6 z-10 inline-flex items-center gap-2 text-[11px] tracking-luxury uppercase text-gold hover:text-gold-soft border border-gold/30 rounded-full px-4 py-2 bg-black/60 backdrop-blur-sm"
            aria-label="Close viewer"
          >
            <X size={16} strokeWidth={1.75} />
            Close
          </button>
          <div className="absolute top-6 left-6 z-10 text-[11px] tracking-[0.35em] uppercase text-gold-soft">
            {dev.name} — {dev.city}
          </div>
          <img
            src={dev.image}
            alt={`${dev.name} — ${dev.city} full rendering`}
            className="max-h-[92vh] max-w-[96vw] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </SiteLayout>
  );
}
