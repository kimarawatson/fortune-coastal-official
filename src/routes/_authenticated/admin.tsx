import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { BarChart3, Box, FileImage, Home, LogOut, Tag, Users, UserPlus, Sparkles } from "lucide-react";
import logo from "@/assets/fcg-logo.png";
import { BackToSiteLink } from "@/components/BackToSiteLink";
import { useAuth } from "@/hooks/use-auth";
import {
  adminDecideSellerApplication,
  adminDeleteListing,
  adminGetStats,
  adminListAllListings,
  adminListSellerApplications,
  adminListUsers,
  adminSeedDemoData,
  adminSetListingStatus,
  adminSetUserRole,
  adminToggleFeatured,
  adminToggleVerified,
  adminUpdateHomepage,
  getHomepage,
} from "@/lib/listings.functions";
import { formatUsd } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — FCG" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Section = "overview" | "listings" | "applications" | "users" | "homepage" | "seed";

function Admin() {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");

  if (loading) return <Full>Loading…</Full>;
  if (!isAdmin) return <Full>Admin access required. <Link to="/dashboard" className="text-gold ml-2">Go back</Link></Full>;

  const nav: { key: Section; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: Home },
    { key: "listings", label: "Listings", icon: Box },
    { key: "applications", label: "Seller Apps", icon: UserPlus },
    { key: "users", label: "Users", icon: Users },
    { key: "homepage", label: "Homepage", icon: FileImage },
    { key: "seed", label: "Demo Data", icon: Sparkles },
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
        <BackToSiteLink className="mb-8" />
        <nav className="space-y-1">
          {nav.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setSection(key)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-luxury uppercase transition-colors ${section === key ? "bg-gold/10 text-gold border-l-2 border-gold" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>
        <button onClick={() => signOut().then(() => navigate({ to: "/" }))} className="mt-10 flex items-center gap-3 px-3 py-2.5 text-xs tracking-luxury uppercase text-muted-foreground hover:text-destructive">
          <LogOut size={14} /> Sign Out
        </button>
      </aside>

      <main className="p-8 lg:p-12">
        {section === "overview" && <Overview />}
        {section === "listings" && <Listings />}
        {section === "applications" && <Applications />}
        {section === "users" && <UsersPanel />}
        {section === "homepage" && <HomepageCMS />}
        {section === "seed" && <SeedPanel />}
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
  const get = useServerFn(adminGetStats);
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: () => get() });
  const s = q.data;
  return (
    <>
      <PageHead eyebrow="Dashboard" title="Marketplace Overview" />
      <div className="grid gap-6 md:grid-cols-5">
        {[
          ["Listings", s?.total ?? "—"],
          ["Pending", s?.pending ?? "—"],
          ["Approved", s?.approved ?? "—"],
          ["Users", s?.users ?? "—"],
          ["Seller Apps", s?.sellerAppsPending ?? "—"],
        ].map(([l, v]) => (
          <div key={String(l)} className="border border-border/40 p-6">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{l}</div>
            <div className="mt-2 font-serif text-3xl gradient-gold-text">{String(v)}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function Listings() {
  const list = useServerFn(adminListAllListings);
  const setStatus = useServerFn(adminSetListingStatus);
  const togFeatured = useServerFn(adminToggleFeatured);
  const togVerified = useServerFn(adminToggleVerified);
  const del = useServerFn(adminDeleteListing);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-listings"], queryFn: () => list() });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-listings"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); };

  return (
    <>
      <PageHead eyebrow="Manage" title="Listings" />
      <div className="border border-border/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-luxury uppercase text-muted-foreground">
            <tr className="border-b border-border/40">
              <th className="text-left p-4">Asset</th>
              <th className="text-left p-4">Seller</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Flags</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).map((l: any) => (
              <tr key={l.id} className="border-b border-border/40 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {l.cover_image && <img src={l.cover_image} alt="" className="h-12 w-16 object-cover" />}
                    <div>
                      <div className="text-foreground">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.category_slug} · {formatUsd(Number(l.price_usd))}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs text-muted-foreground">{l.profiles?.full_name ?? l.profiles?.email ?? "—"}</td>
                <td className="p-4"><StatusPill status={l.status} /></td>
                <td className="p-4 space-x-3 text-xs">
                  <label className="inline-flex items-center gap-1"><input type="checkbox" checked={l.featured} onChange={(e) => togFeatured({ data: { id: l.id, featured: e.target.checked } }).then(refresh)} className="accent-[var(--gold)]" /> Featured</label>
                  <label className="inline-flex items-center gap-1"><input type="checkbox" checked={l.verified} onChange={(e) => togVerified({ data: { id: l.id, verified: e.target.checked } }).then(refresh)} className="accent-[var(--gold)]" /> Verified</label>
                </td>
                <td className="p-4 space-x-2 text-xs tracking-luxury uppercase">
                  {l.status !== "approved" && <button onClick={() => setStatus({ data: { id: l.id, status: "approved" } }).then(() => { toast.success("Approved"); refresh(); })} className="text-emerald-400 hover:underline">Approve</button>}
                  {l.status !== "rejected" && <button onClick={() => setStatus({ data: { id: l.id, status: "rejected" } }).then(() => { toast.success("Rejected"); refresh(); })} className="text-destructive hover:underline">Reject</button>}
                  <button onClick={() => { if (confirm("Delete listing?")) del({ data: { id: l.id } }).then(() => { toast.success("Deleted"); refresh(); }); }} className="text-muted-foreground hover:text-destructive hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Applications() {
  const list = useServerFn(adminListSellerApplications);
  const decide = useServerFn(adminDecideSellerApplication);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-apps"], queryFn: () => list() });
  return (
    <>
      <PageHead eyebrow="Manage" title="Seller Applications" />
      {!q.data?.length ? (
        <div className="border border-border/40 p-10 text-center text-muted-foreground">No applications.</div>
      ) : (
        <div className="grid gap-4">
          {q.data.map((a: any) => (
            <div key={a.id} className="border border-border/40 p-5">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <div className="font-serif text-xl text-foreground">{a.company_name || a.profiles?.full_name || a.profiles?.email}</div>
                  <div className="text-xs text-muted-foreground">{a.profiles?.email} · {a.website}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{a.about}</p>
                </div>
                <StatusPill status={a.status} />
              </div>
              {a.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button onClick={() => decide({ data: { id: a.id, approve: true } }).then(() => { toast.success("Approved"); qc.invalidateQueries({ queryKey: ["admin-apps"] }); })} className="text-xs tracking-luxury uppercase text-emerald-400">Approve</button>
                  <button onClick={() => decide({ data: { id: a.id, approve: false } }).then(() => { toast.success("Rejected"); qc.invalidateQueries({ queryKey: ["admin-apps"] }); })} className="text-xs tracking-luxury uppercase text-destructive">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function UsersPanel() {
  const list = useServerFn(adminListUsers);
  const setRole = useServerFn(adminSetUserRole);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });
  const toggle = async (user_id: string, role: "admin" | "seller" | "buyer", enabled: boolean) => {
    try { await setRole({ data: { user_id, role, enabled } }); toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-users"] }); }
    catch (e: any) { toast.error(e?.message); }
  };
  return (
    <>
      <PageHead eyebrow="Manage" title="Users" />
      <div className="border border-border/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-luxury uppercase text-muted-foreground">
            <tr className="border-b border-border/40"><th className="text-left p-4">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">Roles</th></tr>
          </thead>
          <tbody>
            {(q.data ?? []).map((u: any) => (
              <tr key={u.id} className="border-b border-border/40 last:border-0">
                <td className="p-4 text-foreground">{u.full_name ?? "—"}</td>
                <td className="p-4 text-muted-foreground">{u.email}</td>
                <td className="p-4 flex flex-wrap gap-3 text-xs">
                  {(["admin", "seller", "buyer"] as const).map((r) => {
                    const on = u.roles?.includes(r);
                    return <label key={r} className="inline-flex items-center gap-1"><input type="checkbox" checked={on} onChange={(e) => toggle(u.id, r, e.target.checked)} className="accent-[var(--gold)]" /> {r}</label>;
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function HomepageCMS() {
  const get = useServerFn(getHomepage);
  const save = useServerFn(adminUpdateHomepage);
  const q = useQuery({ queryKey: ["homepage-content"], queryFn: () => get() });
  const allListings = useServerFn(adminListAllListings);
  const lq = useQuery({ queryKey: ["admin-listings"], queryFn: () => allListings() });

  const [form, setForm] = useState<any>(null);
  useEffect(() => { if (q.data) setForm({ ...q.data }); }, [q.data]);

  if (!form) return <PageHead eyebrow="Manage" title="Homepage…" />;

  const upd = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));
  const toggleFeatured = (id: string) => {
    const ids = new Set<string>(form.featured_listing_ids ?? []);
    if (ids.has(id)) ids.delete(id); else ids.add(id);
    upd("featured_listing_ids", Array.from(ids));
  };
  const submit = async () => {
    try {
      await save({ data: {
        hero_eyebrow: form.hero_eyebrow,
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        primary_cta_label: form.primary_cta_label,
        primary_cta_href: form.primary_cta_href,
        secondary_cta_label: form.secondary_cta_label,
        secondary_cta_href: form.secondary_cta_href,
        featured_listing_ids: form.featured_listing_ids ?? [],
      }});
      toast.success("Homepage saved.");
    } catch (e: any) { toast.error(e?.message); }
  };

  return (
    <>
      <PageHead eyebrow="Manage" title="Homepage Content" />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border border-border/40 p-6 space-y-5">
          <CMS label="Hero Eyebrow" value={form.hero_eyebrow} onChange={(v) => upd("hero_eyebrow", v)} />
          <CMS label="Hero Title" value={form.hero_title} onChange={(v) => upd("hero_title", v)} />
          <CMS label="Hero Subtitle" value={form.hero_subtitle} onChange={(v) => upd("hero_subtitle", v)} textarea />
          <div className="grid grid-cols-2 gap-4">
            <CMS label="Primary CTA" value={form.primary_cta_label} onChange={(v) => upd("primary_cta_label", v)} />
            <CMS label="Primary CTA href" value={form.primary_cta_href} onChange={(v) => upd("primary_cta_href", v)} />
            <CMS label="Secondary CTA" value={form.secondary_cta_label} onChange={(v) => upd("secondary_cta_label", v)} />
            <CMS label="Secondary CTA href" value={form.secondary_cta_href} onChange={(v) => upd("secondary_cta_href", v)} />
          </div>
          <button onClick={submit} className="bg-gold text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-gold-soft">Save Homepage</button>
        </div>
        <div className="border border-border/40 p-6">
          <div className="text-[10px] tracking-luxury uppercase text-gold mb-4">Featured listings (homepage)</div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {(lq.data ?? []).filter((l: any) => l.status === "approved").map((l: any) => (
              <label key={l.id} className="flex items-center gap-3 border border-border/40 p-3 cursor-pointer">
                <input type="checkbox" checked={(form.featured_listing_ids ?? []).includes(l.id)} onChange={() => toggleFeatured(l.id)} className="accent-[var(--gold)]" />
                {l.cover_image && <img src={l.cover_image} alt="" className="h-10 w-14 object-cover" />}
                <div className="flex-1 text-sm text-foreground">{l.title}</div>
                <div className="text-xs text-gold">{formatUsd(Number(l.price_usd))}</div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SeedPanel() {
  const seed = useServerFn(adminSeedDemoData);
  const m = useMutation({
    mutationFn: () => seed(),
    onSuccess: (r: any) => toast.success(r?.skipped ? r.message : `Seeded ${r.inserted} listings.`),
    onError: (e: any) => toast.error(e?.message ?? "Seed failed."),
  });
  return (
    <>
      <PageHead eyebrow="Demo Data" title="Seed Marketplace" />
      <div className="border border-border/40 p-8 max-w-2xl">
        <p className="text-sm text-muted-foreground">Populates the marketplace with curated demo listings (Hamptons, Aspen, Bugatti, etc.) owned by your admin account, in <b className="text-gold">pending</b> status so you can practice the approval workflow.</p>
        <p className="mt-3 text-xs text-muted-foreground">Safe to run only on an empty marketplace — it skips if listings already exist.</p>
        <button onClick={() => m.mutate()} disabled={m.isPending} className="mt-6 bg-gold text-primary-foreground px-6 py-3 text-xs tracking-luxury uppercase hover:bg-gold-soft disabled:opacity-60">
          {m.isPending ? "Seeding…" : "Seed Demo Listings"}
        </button>
      </div>
    </>
  );
}

function CMS({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      {textarea ? (
        <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full bg-background border border-border/40 px-3 py-2 text-foreground focus:border-gold focus:outline-none" />
      ) : (
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-border/40 px-3 py-2 text-foreground focus:border-gold focus:outline-none" />
      )}
    </label>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "text-muted-foreground border-border",
    pending: "text-gold border-gold/40",
    approved: "text-emerald-400 border-emerald-500/40",
    rejected: "text-destructive border-destructive/40",
  };
  return <span className={`inline-block border px-2 py-0.5 text-[10px] tracking-luxury uppercase ${map[status] ?? ""}`}>{status}</span>;
}

function Full({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground text-xs tracking-luxury uppercase">{children}</div>;
}
