import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { Star, Gem, Waves, Sparkles } from "lucide-react";
import banner from "@/assets/dev-10.png.asset.json";
import miami from "@/assets/dev-6.png.asset.json";
import california from "@/assets/dev-7.png.asset.json";
import vegas from "@/assets/dev-8.png.asset.json";
import macao from "@/assets/dev-9.png.asset.json";
import p2 from "@/assets/partner-2.jpg.asset.json";
import p3 from "@/assets/partner-3.jpg.asset.json";
import p4 from "@/assets/partner-4.jpg.asset.json";
import p5 from "@/assets/partner-5.jpg.asset.json";
import p6 from "@/assets/partner-6.jpg.asset.json";
import p7 from "@/assets/partner-7.jpg.asset.json";
import p8 from "@/assets/partner-8.jpg.asset.json";
import p9 from "@/assets/partner-9.jpg.asset.json";
import p10 from "@/assets/partner-10.jpg.asset.json";
import p11 from "@/assets/partner-11.jpg.asset.json";

export const Route = createFileRoute("/developments")({
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
  { slug: "miami", name: "Fortune Coastal Tower", city: "Miami", region: "Florida, USA", status: "Pre-Development", completion: "2030", image: miami.url },
  { slug: "california", name: "Fortune Coastal Tower", city: "California", region: "California, USA", status: "Pre-Development", completion: "2031", image: california.url },
  { slug: "vegas", name: "Fortune Coastal Tower", city: "Las Vegas", region: "Nevada, USA", status: "Pre-Development", completion: "2032", image: vegas.url },
  { slug: "macao", name: "Fortune Coastal Tower", city: "Macao", region: "Macao, China", status: "Pre-Development", completion: "2033", image: macao.url },
];

const partnerLogos = [
  { src: p2.url, alt: "Arya" },
  { src: p3.url, alt: "Ardie Tavangarian" },
  { src: p4.url, alt: "Ark Architects" },
  { src: p5.url, alt: "Ark" },
  { src: p6.url, alt: "McClean Design" },
  { src: p7.url, alt: "Blue Heron Design Build" },
  { src: p8.url, alt: "Apel Design Studio" },
  { src: p9.url, alt: "FGR Architects" },
  { src: p10.url, alt: "Nobel" },
  { src: p11.url, alt: "Think Wilder Architecture" },
];

function Developments() {
  return (
    <SiteLayout>
      {/* Banner */}
      <section className="relative -mt-24 h-[52vh] min-h-[380px] w-full overflow-hidden">
        <img src={banner.url} alt="Fortune Coastal Developments" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <h1 className="font-serif text-5xl md:text-7xl tracking-[0.15em] text-foreground">DEVELOPMENTS</h1>
          </Reveal>
          <Reveal delay={1}>
            <div className="mt-6 text-xs md:text-sm tracking-luxury uppercase text-gold-soft">
              Iconic Architecture. Global Destinations.
            </div>
            <div className="mt-2 text-xs md:text-sm tracking-luxury uppercase text-gold-soft">
              Exclusive Investment Opportunities.
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {developments.map((d, i) => (
            <Reveal key={d.city} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
              <article className="group relative overflow-hidden border border-gold/15 bg-charcoal/40 backdrop-blur-sm hover:border-gold/50 transition-all duration-500">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={d.image} alt={`${d.name} — ${d.city}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <div className="text-[10px] tracking-luxury uppercase text-gold">{d.name}</div>
                    <div className="mt-1 font-serif text-xl text-foreground">{d.city}</div>
                    <div className="text-[11px] tracking-wide uppercase text-muted-foreground mt-0.5">{d.region}</div>
                  </div>
                  <div className="absolute bottom-24 left-5 right-5 flex justify-between text-[10px] tracking-luxury uppercase">
                    <div>
                      <div className="text-muted-foreground">Status</div>
                      <div className="text-foreground mt-1">{d.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">Est. Completion</div>
                      <div className="text-foreground mt-1">{d.completion}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 border-t border-gold/15">
                  <button className="text-[10px] tracking-luxury uppercase text-foreground py-4 border-r border-gold/15 hover:bg-gold/5 transition-colors">View Development</button>
                  <button className="text-[10px] tracking-luxury uppercase text-primary-foreground bg-gradient-to-r from-gold to-gold-soft py-4 hover:opacity-90 transition-opacity">Invest</button>
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

      {/* Partners */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="h-px w-16 bg-gold/40" />
          <h2 className="text-xs tracking-[0.4em] uppercase text-gold">Development Partners</h2>
          <div className="h-px w-16 bg-gold/40" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((p) => (
            <div key={p} className="text-center text-sm tracking-luxury uppercase text-muted-foreground/70 hover:text-gold transition-colors">
              {p}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[10px] tracking-luxury uppercase text-muted-foreground/60">
          Client logos will be provided
        </p>
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
