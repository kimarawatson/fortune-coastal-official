import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Linkedin, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import contactHero from "@/assets/asset-miami.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Fortune Coastal Group" },
      { name: "description", content: "Speak privately with the Fortune Coastal Group concierge desk." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <div className="relative -mt-20">
        <img src={contactHero} alt="" className="absolute inset-0 h-[70vh] w-full object-cover" />
        <div className="absolute inset-0 h-[70vh] bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <section className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-32 pb-24 grid lg:grid-cols-2 gap-16">
        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold">Private Concierge</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl text-foreground leading-tight">Speak with us, <span className="italic gradient-gold-text">privately</span>.</h1>
          <p className="mt-6 text-muted-foreground max-w-md">
            Our concierge team responds within four hours. All communications are encrypted and handled with absolute discretion.
          </p>

          <div className="mt-12 space-y-6">
            {[
              { icon: MapPin, label: "Headquarters", value: "Miami, Florida, United States" },
              { icon: Phone, label: "Concierge Desk", value: "+1 (305) 555-0148" },
              { icon: Mail, label: "Private Inquiries", value: "concierge@fortunecoastal.com" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="border border-gold/40 p-3 text-gold"><Icon size={16} /></div>
                <div>
                  <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{label}</div>
                  <div className="mt-1 text-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-4">Follow Fortune Coastal</div>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram", href: "#" },
                { Icon: Linkedin, label: "LinkedIn", href: "#" },
                { Icon: Twitter, label: "X", href: "#" },
                { Icon: Facebook, label: "Facebook", href: "#" },
                { Icon: Youtube, label: "YouTube", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a key={label} href={href} aria-label={label} className="h-11 w-11 grid place-items-center border border-border/40 bg-charcoal/40 text-muted-foreground hover:border-gold hover:text-gold hover:bg-gold/5 transition-all">
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="border border-border/40 bg-charcoal/50 p-8 lg:p-10"
        >
          {sent ? (
            <div className="text-center py-16">
              <div className="text-[10px] tracking-luxury uppercase text-gold">Received</div>
              <div className="mt-4 font-serif text-3xl text-foreground">Thank you.</div>
              <p className="mt-3 text-sm text-muted-foreground">A member of our concierge team will be in touch shortly.</p>
            </div>
          ) : (
            <>
              <div className="text-[10px] tracking-luxury uppercase text-gold">Inquiry Form</div>
              <h2 className="mt-2 font-serif text-3xl text-foreground">Begin a conversation</h2>
              <div className="mt-8 grid gap-5">
                <Field label="Full Name" />
                <Field label="Email Address" type="email" />
                <Field label="Phone (optional)" />
                <Field label="Subject" />
                <label className="block">
                  <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">Message</div>
                  <textarea rows={5} className="w-full bg-background border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
                </label>
                <button className="bg-gold text-primary-foreground px-8 py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
                  Send Privately
                </button>
              </div>
            </>
          )}
        </form>
        </section>
      </div>
    </SiteLayout>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      <input type={type} className="w-full bg-background border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
    </label>
  );
}
