import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { Star, Gem, Waves, Sparkles, ArrowRight, MapPin, Calendar } from "lucide-react";
import banner from "@/assets/dev-banner.jpg";
import miami from "@/assets/dev-6.png";
import california from "@/assets/dev-7.png";
import vegas from "@/assets/dev-8.png";
import macao from "@/assets/dev-9.png";
import p2 from "@/assets/partner-2.jpg";
import p3 from "@/assets/partner-3.jpg";
import p4 from "@/assets/partner-4.jpg";
import p5 from "@/assets/partner-5.jpg";
import p6 from "@/assets/partner-6.jpg";
import p7 from "@/assets/partner-7.jpg";
import p8 from "@/assets/partner-8.jpg";
import p9 from "@/assets/partner-9.jpg";
import p10 from "@/assets/partner-10.jpg";
import p11 from "@/assets/partner-11.jpg";
import pOrca from "@/assets/partner-orca.jpg";
import pAlpago from "@/assets/partner-alpago.jpg";
import pEnes from "@/assets/partner-enes.jpg";
import pProsper from "@/assets/partner-prosper.jpg";
import pPinin from "@/assets/partner-pininfarina.jpg";
import pSaota from "@/assets/partner-saota.jpg";
import pZaha from "@/assets/partner-zaha.jpg";
import pEqui from "@/assets/partner-equidistant.jpg";
import pSpectre from "@/assets/partner-spectre.jpg";

export const Route = createFileRoute("/developments/")({
  head: () => ({
    meta: [
      { title: "Developments — Fortune Coastal Group" },
      { name: "description", content: "Iconic architecture. Global destinations. Exclusive investment opportunities from Fortune Coastal Group." },
      { property: "og:title", content: "Developments — Fortune Coastal Group" },
      { property: "og:description", content: "Iconic architecture. Global destinations. Exclusive investment opportunities." },
    ],
  }),
  component: Developments,
});

type Dev = {
  slug: string;
  name: string;
  city: string;
  region: string;
  status: string;
  completion: string;
  image: string;
};

const developments: Dev[] = [
  { slug: "miami", name: "Fortune Coastal Tower", city: "Miami", region: "Florida, USA", status: "Pre-Development", completion: "2030", image: miami },
  { slug: "california", name: "Fortune Coastal Tower", city: "Los Angeles", region: "California, USA", status: "Pre-Development", completion: "2031", image: california },
  { slug: "vegas", name: "Fortune Coastal Tower", city: "Las Vegas", region: "Nevada, USA", status: "Pre-Development", completion: "2032", image: vegas },
  { slug: "macao", name: "Fortune Coastal Tower", city: "Macao", region: "Macao, China", status: "Pre-Development", completion: "2033", image: macao },
];

const partnerLogos = [
  { src: p2, alt: "Arya" },
  { src: p3, alt: "Ardie Tavangarian" },
  { src: p4, alt: "Ark Architects" },
  { src: p5, alt: "Ark" },
  { src: p6, alt: "McClean Design" },
  { src: p7, alt: "Blue Heron Design Build" },
  { src: p8, alt: "Apel Design Studio" },
  { src: p9, alt: "FGR Architects" },
  { src: p10, alt: "Nobel" },
  { src: p11, alt: "Think Wilder Architecture" },
  { src: pOrca, alt: "Orca Design" },
  { src: pAlpago, alt: "Alpago Properties" },
  { src: pEnes, alt: "Enes Yilmazer" },
  { src: pProsper, alt: "Prosper Group" },
  { src: pPinin, alt: "Pininfarina" },
  { src: pSaota, alt: "SAOTA" },
  { src: pZaha, alt: "Zaha Hadid Architects" },
  { src: pEqui, alt: "Equidistant Architect" },
  { src: pSpectre, alt: "Spectre 27" },
];

function Developments() {
  return (
    <SiteLayout>
      {/* Banner */}
      <section className="relative -mt-24 h-[70vh] min-h-[520px] w-full overflow-hidden">
        <img src={banner} alt="Fortune Coastal Developments" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <div className="text-[11px] tracking-[0.5em] uppercase text-gold mb-6">Fortune Coastal Group</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="font-serif text-5xl md:text-8xl tracking-[0.15em] text-foreground">DEVELOPMENTS</h1>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-8 max-w-3xl space-y-2">
              <div className="text-xs md:text-sm tracking-luxury uppercase text-gold-soft">
                Iconic Architecture. Global Destinations.
              </div>
              <div className="text-xs md:text-sm tracking-luxury uppercase text-gold-soft">
                Exclusive Investment Opportunities.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Current Developments */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <div className="flex items-center justify-center gap-6 mb-16">
          <div className="h-px w-16 bg-gold/40" />
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold">Current Developments</h2>
          <div className="h-px w-16 bg-gold/40" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {developments.map((d, i) => (
            <Reveal key={d.city} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
              <article className="group relative overflow-hidden bg-charcoal/30 backdrop-blur-sm border border-gold/10 hover:border-gold/40 transition-all duration-500 h-full flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={d.image}
                    alt={`${d.name} — ${d.city}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-gold/30 text-[9px] tracking-luxury uppercase text-gold">
                    {d.status}
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div>
                    <div className="text-[9px] tracking-[0.35em] uppercase text-gold mb-1.5">{d.name}</div>
                    <h3 className="font-serif text-2xl tracking-[0.06em] text-foreground">
                      {d.city.toUpperCase()}
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-[10px] tracking-luxury uppercase">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={11} className="text-gold" strokeWidth={1.5} />
                      {d.region}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={11} className="text-gold" strokeWidth={1.5} />
                      Est. {d.completion}
                    </div>
                  </div>

                  <div className="h-px w-full bg-gold/15" />

                  <div className="mt-auto flex flex-col gap-2">
                    <Link
                      to="/developments/$slug"
                      params={{ slug: d.slug }}
                      className="group/btn inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-soft text-primary-foreground py-2.5 text-[10px] tracking-luxury uppercase hover:opacity-90 transition-opacity"
                    >
                      View Details
                      <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center border border-gold/40 text-foreground py-2.5 text-[10px] tracking-luxury uppercase hover:bg-gold/10 transition-colors"
                    >
                      Invest
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="border-t border-gold/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {[
            { Icon: Sparkles, label: "Iconic Design by Vision" },
            { Icon: Gem, label: "Timeless Luxury Curated" },
            { Icon: Waves, label: "Waterfront Living" },
            { Icon: Star, label: "Exclusive Lifestyle" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-4">
              <Icon size={32} className="text-gold" strokeWidth={1.2} />
              <div className="text-[11px] tracking-luxury uppercase text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners — marquee */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="h-px w-16 bg-gold/40" />
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold">Development Partners</h2>
          <div className="h-px w-16 bg-gold/40" />
        </div>

        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="marquee-track flex w-max items-center gap-16 py-6">
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div
                key={i}
                className="shrink-0 h-20 w-40 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className="max-h-16 max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gold/10 bg-charcoal/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid gap-10 lg:grid-cols-3">
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-foreground">Let's Build<br/>Something Iconic</h3>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Partner with Fortune Coastal Group to create the next generation of landmarks.
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <div className="text-muted-foreground">(206) 333.7469</div>
            <div className="text-muted-foreground">InvestFortuneCoastalGroup@outlook.com</div>
            <div className="text-muted-foreground">Los Angeles, California, USA</div>
          </div>
          <a href="/contact" className="self-start inline-block bg-gradient-to-r from-gold to-gold-soft text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:opacity-90 transition-opacity">
            Send Message
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
