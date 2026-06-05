import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, Box, FileImage, Home, LogOut, Tag, Users } from "lucide-react";
import logo from "@/assets/fcg-logo.png";
import { assets, categories, formatUsd } from "@/data/mock";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — FCG" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Section = "overview" | "listings" | "categories" | "featured" | "users" | "homepage" | "analytics";

function Admin() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("fcg-admin") !== "1") {
        navigate({ to: "/admin-login" });
      } else setAuthed(true);
    }
  }, [navigate]);

  if (!authed) return null;

  const nav: { key: Section; label: string; icon: typeof Home }[] = [
    { key: "overview", label: "Overview", icon: Home },
    { key: "listings", label: "Listings", icon: Box },
    { key: "categories", label: "Categories", icon: Tag },
    { key: "featured", label: "Featured", icon: FileImage },
    { key: "users", label: "Users", icon: Users },
    { key: "homepage", label: "Homepage", icon: FileImage },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-border/40 bg-charcoal/40 p-6 lg:min-h-screen">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <img src={logo} alt="" className="h-10 w-10" />
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold">FCG</div>
            <div className="font-serif text-sm text-foreground">Admin Console</div>
          </div>
        </Link>
        <nav className="space-y-1">
          {nav.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-luxury uppercase transition-colors ${section === key ? "bg-gold/10 text-gold border-l-2 border-gold" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => { sessionStorage.removeItem("fcg-admin"); navigate({ to: "/" }); }}
          className="mt-10 flex items-center gap-3 px-3 py-2.5 text-xs tracking-luxury uppercase text-muted-foreground hover:text-destructive"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </aside>

      <main className="p-8 lg:p-12">
        {section === "overview" && <Overview />}
        {section === "listings" && <Listings />}
        {section === "categories" && <Categories />}
        {section === "featured" && <Featured />}
        {section === "users" && <UsersPanel />}
        {section === "homepage" && <Homepage />}
        {section === "analytics" && <Analytics />}
      </main>
    </div>
  );
}

function PageHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10">
      <div className="text-[10px] tracking-luxury uppercase text-gold">{eyebrow}</div>
      <h1 className="mt-2 font-serif text-4xl text-foreground">{title}</h1>
    </div>
  );
}

function Overview() {
  const stats = [
    ["Total Listings", String(assets.length)],
    ["Pending Approvals", "3"],
    ["Active Users", "1,284"],
    ["GMV (YTD)", "$4.2B"],
  ];
  return (
    <>
      <PageHead eyebrow="Dashboard" title="Marketplace Overview" />
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="border border-border/40 p-6">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{l}</div>
            <div className="mt-2 font-serif text-3xl gradient-gold-text">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 border border-border/40 p-8">
        <h2 className="font-serif text-2xl text-foreground mb-6">Recent Activity</h2>
        <ul className="space-y-3 text-sm">
          {["New listing submitted: Cliffside Villa, Bali", "Buyer inquiry on Gulfstream G700", "Seller verified: Cavallino Heritage", "BTC settlement completed: Lamborghini Revuelto"].map((a, i) => (
            <li key={i} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0">
              <span className="text-foreground">{a}</span>
              <span className="text-xs text-muted-foreground">{i + 2}h ago</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Listings() {
  const [items, setItems] = useState(assets);
  return (
    <>
      <PageHead eyebrow="Manage" title="Listings" />
      <div className="border border-border/40">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-luxury uppercase text-muted-foreground">
            <tr className="border-b border-border/40">
              <th className="text-left p-4">Asset</th><th className="text-left p-4">Category</th><th className="text-left p-4">Price</th><th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-b border-border/40 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={a.image} alt="" className="h-12 w-16 object-cover" />
                    <span className="text-foreground">{a.title}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{a.category}</td>
                <td className="p-4 text-gold">{formatUsd(a.priceUsd)}</td>
                <td className="p-4 space-x-3">
                  <button className="text-xs tracking-luxury uppercase text-gold hover:underline">Edit</button>
                  <button onClick={() => setItems(items.filter((x) => x.id !== a.id))} className="text-xs tracking-luxury uppercase text-destructive hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Categories() {
  return (
    <>
      <PageHead eyebrow="Manage" title="Categories" />
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div key={c.name} className="border border-border/40 p-5 flex items-center justify-between">
            <div>
              <div className="font-serif text-lg text-foreground">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.count} listings</div>
            </div>
            <button className="text-xs tracking-luxury uppercase text-gold">Edit</button>
          </div>
        ))}
      </div>
    </>
  );
}

function Featured() {
  return (
    <>
      <PageHead eyebrow="Manage" title="Featured Assets" />
      <div className="grid gap-4 md:grid-cols-2">
        {assets.map((a) => (
          <label key={a.id} className="border border-border/40 p-4 flex items-center gap-4 cursor-pointer hover:border-gold/50">
            <input type="checkbox" defaultChecked={a.featured} className="accent-[var(--gold)]" />
            <img src={a.image} alt="" className="h-14 w-20 object-cover" />
            <div className="flex-1">
              <div className="text-foreground">{a.title}</div>
              <div className="text-xs text-muted-foreground">{a.category}</div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
}

function UsersPanel() {
  const users = [
    { name: "Alexander Sterling", email: "alex@private.com", tier: "Sovereign" },
    { name: "Isabella Moreau", email: "i.moreau@maison.fr", tier: "Patron" },
    { name: "Hiroshi Tanaka", email: "ht@tokyofo.jp", tier: "Sovereign" },
    { name: "Sofía Vega", email: "sofia@vegaholdings.com", tier: "Member" },
  ];
  return (
    <>
      <PageHead eyebrow="Manage" title="Users" />
      <div className="border border-border/40">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-luxury uppercase text-muted-foreground">
            <tr className="border-b border-border/40"><th className="text-left p-4">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">Tier</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-border/40 last:border-0">
                <td className="p-4 text-foreground">{u.name}</td>
                <td className="p-4 text-muted-foreground">{u.email}</td>
                <td className="p-4 text-gold">{u.tier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Homepage() {
  return (
    <>
      <PageHead eyebrow="Manage" title="Homepage Content" />
      <div className="border border-border/40 p-6 space-y-5 max-w-2xl">
        <Input label="Hero Headline" def="The Future of Luxury Asset Ownership" />
        <Input label="Hero Subheadline" def="Buy and sell luxury real estate, vehicles, yachts, jets, and exclusive experiences using USD or Bitcoin." />
        <Input label="Primary CTA" def="Explore Marketplace" />
        <Input label="Secondary CTA" def="Become a Seller" />
        <button className="bg-gold text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">Save Changes</button>
      </div>
    </>
  );
}

function Analytics() {
  const data = [40, 65, 55, 80, 72, 95, 88, 110, 102, 130, 124, 145];
  const max = Math.max(...data);
  return (
    <>
      <PageHead eyebrow="Insights" title="Marketplace Analytics" />
      <div className="border border-border/40 p-8">
        <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">GMV (Last 12 Months, $M)</div>
        <div className="mt-6 flex items-end gap-3 h-64">
          {data.map((d, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-gold/30 to-gold/80" style={{ height: `${(d / max) * 100}%` }} title={`$${d}M`} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-12 gap-3 text-[10px] tracking-luxury uppercase text-muted-foreground">
          {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => <div key={i} className="text-center">{m}</div>)}
        </div>
      </div>
    </>
  );
}

function Input({ label, def }: { label: string; def: string }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      <input defaultValue={def} className="w-full bg-background border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
    </label>
  );
}
