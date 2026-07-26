import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, MapPin, Calendar, Building2, Sparkles } from "lucide-react";
import miami from "@/assets/dev-6.png";
import california from "@/assets/dev-7.png";
import vegas from "@/assets/dev-8.png";
import macao from "@/assets/dev-9.png";

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
  zones: { level: string; label: string }[];
};

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
    zones: [
      { level: "Podium", label: "Arrival, Motor Lobby & Gallery" },
      { level: "L1–L8", label: "Wellness, Spa & Aquatics" },
      { level: "L9–L45", label: "Private Residences" },
      { level: "L46–L58", label: "Sky Villas & Penthouses" },
      { level: "Crown", label: "Sky Center & Observatory" },
    ],
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
    zones: [
      { level: "Podium", label: "Motor Court & Arrival" },
      { level: "L1–L12", label: "Members' Club & Spa" },
      { level: "L13–L48", label: "Residences" },
      { level: "L49–L61", label: "Sky Villas & Penthouse" },
    ],
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
    zones: [
      { level: "Podium", label: "Grand Arrival & Salon" },
      { level: "L1–L10", label: "Pool Club & Wellness" },
      { level: "L11–L50", label: "Residences" },
      { level: "L51–L64", label: "Sky Villas & Crown Suite" },
    ],
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
    zones: [
      { level: "Podium", label: "Waterfront Promenade & Arcade" },
      { level: "L1–L9", label: "Hotel & Spa" },
      { level: "L10–L44", label: "Residences" },
      { level: "L45–L58", label: "Sky Lounge & Penthouses" },
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
        <img
          src={dev.image}
          alt={`${dev.name} — ${dev.city}`}
          className="absolute inset-0 h-full w-full object-contain md:object-cover object-center bg-black"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

        <div className="relative w-full mx-auto max-w-7xl px-6 lg:px-10 pb-24 pt-40">
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
        </div>
      </section>

      {/* Description + Zones */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 grid gap-16 lg:grid-cols-[1.3fr_1fr]">
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
          <div className="mt-10 flex gap-4">
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
          <ul className="divide-y divide-gold/15 border-y border-gold/15">
            {dev.zones.map((z: { level: string; label: string }) => (
              <li key={z.level} className="flex items-center justify-between py-4">
                <span className="text-[11px] tracking-luxury uppercase text-gold-soft">{z.level}</span>
                <span className="text-sm text-foreground text-right">{z.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3 text-[11px] tracking-luxury uppercase text-muted-foreground">
            <Sparkles size={14} className="text-gold" strokeWidth={1.5} />
            Concept illustration — subject to final design
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
