import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import banner from "@/assets/dev-banner.jpg";
import starLogo from "@/assets/meozzi-star.png";
import miami from "@/assets/dev-6.png";
import california from "@/assets/dev-7.png";
import vegas from "@/assets/dev-8.png";
import macao from "@/assets/dev-9.png";
import p2 from "@/assets/partner-2.png";
import p3 from "@/assets/partner-3.png";
import p4 from "@/assets/partner-4.png";
import p5 from "@/assets/partner-5.png";
import p6 from "@/assets/partner-6.png";
import p7 from "@/assets/partner-7.png";
import p8 from "@/assets/partner-8.png";
import p9 from "@/assets/partner-9.png";
import p10 from "@/assets/partner-10.png";
import p11 from "@/assets/partner-11.png";
import pOrca from "@/assets/partner-orca.png";
import pAlpago from "@/assets/partner-alpago.png";
import pEnes from "@/assets/partner-enes.png";
import pProsper from "@/assets/partner-prosper.png";
import pPinin from "@/assets/partner-pininfarina.png";
import pSaota from "@/assets/partner-saota.png";
import pZaha from "@/assets/partner-zaha.png";
import pEqui from "@/assets/partner-equidistant.png";
import pSpectre from "@/assets/partner-spectre.png";

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

      {/* Brand mark */}
      <section className="mx-auto max-w-[1700px] px-4 lg:px-8 pt-14">
        <div className="flex items-center gap-4">
          <img src={starLogo} alt="Meozzi Star Developments emblem" className="h-12 w-auto md:h-16" />
          <div className="leading-none">
            <div className="font-serif text-xl md:text-2xl tracking-[0.14em] text-gold">MEOZZI STAR</div>
            <div className="mt-1.5 text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-gold-soft">Developments</div>
          </div>
        </div>
      </section>

      {/* Current Developments */}
      <section className="mx-auto max-w-[1700px] px-4 lg:px-8 py-20">
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="h-px w-16 bg-gold/40" />
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold">Current Developments</h2>
          <div className="h-px w-16 bg-gold/40" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {developments.map((d, i) => (
            <Reveal key={d.city} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
              <article className="group relative overflow-hidden bg-charcoal/25 backdrop-blur-sm h-full flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={d.image}
                    alt={`${d.name} — ${d.city}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
                  <div className="absolute top-5 left-5">
                    <img src={starLogo} alt="" aria-hidden className="h-7 w-auto mb-2 opacity-90" />
                    <div className="font-serif text-sm tracking-[0.18em] text-gold">{d.name.toUpperCase()}</div>
                    <div className="mt-2 text-sm tracking-[0.12em] uppercase text-foreground">{d.city}</div>
                    <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{d.region}</div>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3 text-[9px] tracking-luxury uppercase">
                    <div>
                      <div className="text-muted-foreground/70">Status</div>
                      <div className="mt-1 text-foreground">{d.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground/70">Est. Completion</div>
                      <div className="mt-1 text-gold">{d.completion}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/developments/$slug"
                      params={{ slug: d.slug }}
                      className="inline-flex items-center justify-center border border-gold/35 text-foreground py-2.5 text-[9px] tracking-luxury uppercase hover:bg-gold/10 transition-colors"
                    >
                      View Development
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold to-gold-soft text-primary-foreground py-2.5 text-[9px] tracking-luxury uppercase hover:opacity-90 transition-opacity"
                    >
                      Invest
                      <ArrowRight size={11} strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Stats strip */}
        <Reveal>
          <div className="mt-4 bg-charcoal/30 backdrop-blur-sm grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y divide-gold/10 sm:divide-y-0 lg:divide-x lg:divide-gold/10">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-5 py-6">
                <s.icon size={26} strokeWidth={1} className="text-gold shrink-0" />
                <div className="min-w-0">
                  <div className="font-serif text-xl text-foreground leading-none">{s.value}</div>
                  <div className="mt-1.5 text-[9px] tracking-luxury uppercase text-muted-foreground truncate">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="h-px w-20 bg-gold/25" />
          <div className="text-[10px] tracking-[0.4em] uppercase text-gold-soft text-center">
            Building Legacies. Creating Landmarks. Delivering Excellence.
          </div>
          <div className="h-px w-20 bg-gold/25" />
        </div>
      </section>

      {/* Partners — marquee */}
      <section className="mx-auto max-w-[1700px] px-4 lg:px-8 py-24">
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
          <div className="marquee-track flex w-max items-center gap-16 py-6" style={{ animationDuration: "110s" }}>
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
