import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Mail, User } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { assets, formatUsd } from "@/data/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My Portal — FCG" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const saved = assets.slice(0, 3);
  const inquiries = assets.slice(2, 5);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-12 pb-24">
        <div className="text-[10px] tracking-luxury uppercase text-gold">Client Portal</div>
        <h1 className="mt-3 font-serif text-5xl text-foreground">Welcome, Alexander.</h1>
        <p className="mt-2 text-muted-foreground">Your curated dashboard.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { label: "Saved Assets", value: saved.length, icon: Heart },
            { label: "Active Inquiries", value: inquiries.length, icon: Mail },
            { label: "Member Tier", value: "Sovereign", icon: User },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border border-border/40 p-6 flex items-center justify-between">
              <div>
                <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{label}</div>
                <div className="mt-1 font-serif text-3xl text-foreground">{value}</div>
              </div>
              <Icon size={22} className="text-gold" />
            </div>
          ))}
        </div>

        <Block title="Saved Assets">
          <div className="grid gap-px bg-border/40">
            {saved.map((a) => (
              <Link key={a.id} to="/asset/$id" params={{ id: a.id }} className="bg-background flex items-center gap-5 p-4 hover:bg-charcoal/60">
                <img src={a.image} alt="" className="h-16 w-24 object-cover" />
                <div className="flex-1">
                  <div className="font-serif text-lg text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.location} · {a.category}</div>
                </div>
                <div className="text-gold font-serif">{formatUsd(a.priceUsd)}</div>
              </Link>
            ))}
          </div>
        </Block>

        <Block title="Recent Inquiries">
          <div className="border border-border/40">
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-luxury uppercase text-muted-foreground">
                <tr className="border-b border-border/40">
                  <th className="text-left p-4">Asset</th><th className="text-left p-4">Date</th><th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((a, i) => (
                  <tr key={a.id} className="border-b border-border/40 last:border-0">
                    <td className="p-4 text-foreground">{a.title}</td>
                    <td className="p-4 text-muted-foreground">June {10 + i}, 2026</td>
                    <td className="p-4"><span className="text-xs text-gold tracking-luxury uppercase">In Review</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block title="Profile Information">
          <div className="border border-border/40 p-6 grid sm:grid-cols-2 gap-6 text-sm">
            <Info label="Full Name" value="Alexander Sterling" />
            <Info label="Email" value="alexander@privatemail.com" />
            <Info label="Country" value="United Kingdom" />
            <Info label="Member Since" value="January 2025" />
          </div>
        </Block>
      </section>
    </SiteLayout>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-2xl text-foreground mb-5">{title}</h2>
      {children}
    </section>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 text-foreground">{value}</div>
    </div>
  );
}
