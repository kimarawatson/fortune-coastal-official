import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Download, Image as ImageIcon, Plus, Search, Upload, X, ZoomIn, ZoomOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  adminExportCatalog,
  adminDeleteCatalogListing,
  adminGetListingDetail,
  adminImportListings,
  adminListCatalog,
  adminSaveListing,
  adminSetCatalogFeatured,
  adminSetCatalogStatus,
  adminSetCatalogVerified,
} from "@/lib/catalog-admin.functions";
import { formatUsd } from "@/lib/format";

type Row = Record<string, any>;

type FormState = {
  id: string | null;
  category_slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  location: string | null;
  country: string | null;
  city: string | null;
  price_usd: number | string;
  accepts_btc: boolean;
  cover_image: string | null;
  source_url: string | null;
  external_id: string | null;
  status: "draft" | "pending" | "approved" | "rejected";
  featured: boolean;
  verified: boolean;
  images: string[];
};

const EMPTY: FormState = {
  id: null,
  category_slug: "real-estate",
  title: "",
  subtitle: "",
  description: "",
  location: "",
  country: "United States",
  city: "",
  price_usd: 0,
  accepts_btc: true,
  cover_image: "",
  source_url: "",
  external_id: "",
  status: "approved",
  featured: false,
  verified: true,
  images: [],
};

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const sqlLit = (v: unknown) => (v === null || v === undefined || v === "" ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export default function ProductsPanel() {
  const qc = useQueryClient();
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [viewer, setViewer] = useState<{ images: string[]; index: number } | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const listFn = useServerFn(adminListCatalog);
  const detailFn = useServerFn(adminGetListingDetail);
  const exportFn = useServerFn(adminExportCatalog);
  const importFn = useServerFn(adminImportListings);
  const delFn = useServerFn(adminDeleteCatalogListing);
  const statusFn = useServerFn(adminSetCatalogStatus);
  const featFn = useServerFn(adminSetCatalogFeatured);
  const verFn = useServerFn(adminSetCatalogVerified);

  const catsQ = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data ?? [],
  });
  const q = useQuery({ queryKey: ["admin-catalog", category], queryFn: () => listFn({ data: { category: category || null } }) });

  const rows: Row[] = useMemo(() => {
    const all = (q.data ?? []) as Row[];
    const term = search.trim().toLowerCase();
    return all.filter((r) => {
      const haystack = `${r.title ?? ""} ${r.subtitle ?? ""} ${r.location ?? ""} ${r.city ?? ""} ${r.country ?? ""} ${r.external_id ?? ""}`.toLowerCase();
      return (!term || haystack.includes(term)) && (!statusFilter || r.status === statusFilter) && (!featuredOnly || r.featured);
    });
  }, [q.data, search, statusFilter, featuredOnly]);

  const refresh = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["admin-catalog"] }),
      qc.invalidateQueries({ queryKey: ["home-featured"] }),
    ]);

  async function runFlag(key: string, id: string, field: "featured" | "verified", value: boolean, fn: () => Promise<unknown>, message: string) {
    setPending(key);
    const previous = qc.getQueriesData({ queryKey: ["admin-catalog"] });
    qc.setQueriesData({ queryKey: ["admin-catalog"] }, (current: unknown) =>
      Array.isArray(current) ? current.map((row: Row) => row.id === id ? { ...row, [field]: value } : row) : current,
    );
    try {
      await fn();
      await refresh();
      toast.success(message);
    } catch (err: any) {
      previous.forEach(([queryKey, data]) => qc.setQueryData(queryKey, data));
      toast.error(err?.message ?? "Update failed");
    } finally {
      setPending(null);
    }
  }

  async function openEdit(id: string) {
    try {
      const d = await detailFn({ data: { id } });
      if (!d.listing) throw new Error("Product details were not found.");
      setEditing({ ...EMPTY, ...(d.listing as Partial<FormState>), images: d.images });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not load product details");
    }
  }

  async function openGallery(id: string, cover: string | null) {
    try {
      const d = await detailFn({ data: { id } });
      const imgs = Array.from(new Set([cover, ...d.images].filter((image): image is string => Boolean(image))));
      if (!imgs.length) throw new Error("This product has no images.");
      setViewer({ images: imgs, index: 0 });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not load product images");
    }
  }

  async function exportCsv() {
    const data = await exportFn({ data: { category: category || null } });
    const head = ["id", "external_id", "category_slug", "title", "subtitle", "description", "location", "country", "city", "price_usd", "accepts_btc", "cover_image", "source_url", "status", "featured", "verified", "images"];
    const lines = [head.join(",")];
    for (const l of data.listings as Row[]) {
      lines.push(head.map((h) => (h === "images" ? csvCell((data.gallery[l.id] ?? []).join(" | ")) : csvCell(l[h]))).join(","));
    }
    download(`fcg-listings-${category || "all"}.csv`, lines.join("\n"), "text/csv");
    toast.success(`Exported ${data.listings.length} products.`);
  }

  async function exportSql() {
    const data = await exportFn({ data: { category: category || null } });
    const out: string[] = [
      "-- Fortune Coastal Group — product export (run after schema.sql)",
      "begin;",
      "alter table public.listings add column if not exists source_url text;",
      "alter table public.listings add column if not exists external_id text;",
      "alter table public.listings alter column seller_id drop not null;",
      "create unique index if not exists listings_external_id_key on public.listings (external_id) where external_id is not null;",
    ];
    for (const l of data.listings as Row[]) {
      out.push(
        `insert into public.listings (id, external_id, category_slug, title, subtitle, description, location, country, city, price_usd, accepts_btc, cover_image, source_url, status, featured, verified) values (${sqlLit(l.id)}::uuid,${sqlLit(l.external_id)},${sqlLit(l.category_slug)},${sqlLit(l.title)},${sqlLit(l.subtitle)},${sqlLit(l.description)},${sqlLit(l.location)},${sqlLit(l.country)},${sqlLit(l.city)},${Number(l.price_usd).toFixed(2)},${l.accepts_btc},${sqlLit(l.cover_image)},${sqlLit(l.source_url)},'${l.status}'::public.listing_status,${l.featured},${l.verified}) on conflict (id) do update set external_id=excluded.external_id, category_slug=excluded.category_slug, title=excluded.title, subtitle=excluded.subtitle, description=excluded.description, location=excluded.location, country=excluded.country, city=excluded.city, price_usd=excluded.price_usd, accepts_btc=excluded.accepts_btc, cover_image=excluded.cover_image, source_url=excluded.source_url, status=excluded.status, featured=excluded.featured, verified=excluded.verified;`,
      );
      const imgs = data.gallery[l.id] ?? [];
      out.push(`delete from public.listing_images where listing_id = ${sqlLit(l.id)}::uuid;`);
      if (imgs.length) {
        out.push(
          `insert into public.listing_images (listing_id, image_url, sort_order) values ${imgs
            .map((u: string, i: number) => `(${sqlLit(l.id)}::uuid,${sqlLit(u)},${i})`)
            .join(",")};`,
        );
      }
    }
    out.push("commit;");
    download(`fcg-listings-${category || "all"}.sql`, out.join("\n"), "text/plain");
    toast.success("SQL file downloaded.");
  }

  async function importCsv(file: File) {
    const grid = parseCsv(await file.text());
    if (grid.length < 2) return toast.error("CSV appears empty.");
    const head = grid[0].map((h) => h.replace(/^\uFEFF/, "").trim().toLowerCase());
    const idx = (n: string) => head.indexOf(n);
    const payload = grid.slice(1).map((r) => {
      const get = (n: string) => (idx(n) >= 0 ? r[idx(n)]?.trim() ?? "" : "");
      const images = get("images").split("|").map((s) => s.trim()).filter(Boolean);
      const price = Number(get("price_usd").replace(/[^0-9.]/g, "")) || 0;
      return {
        id: get("id") || null,
        external_id: get("external_id") || null,
        category_slug: get("category_slug") || "real-estate",
        title: get("title"),
        subtitle: get("subtitle") || null,
        description: get("description") || null,
        location: get("location") || null,
        country: get("country") || null,
        city: get("city") || null,
        price_usd: price,
        accepts_btc: get("accepts_btc").toLowerCase() !== "false",
        cover_image: get("cover_image") || images[0] || null,
        source_url: get("source_url") || null,
        status: (["draft", "pending", "approved", "rejected"].includes(get("status")) ? get("status") : "approved") as any,
        featured: get("featured").toLowerCase() === "true",
        verified: get("verified").toLowerCase() !== "false",
        images,
      };
    }).filter((r) => r.title);
    if (!payload.length) return toast.error("No rows with a title found.");
    const res = await importFn({ data: { rows: payload } });
    toast.success(`Imported — ${res.created} new, ${res.updated} updated.`);
    refresh();
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold">Manage</div>
          <h1 className="mt-2 font-serif text-4xl text-foreground">Products</h1>
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] tracking-luxury uppercase">
          <button onClick={() => setEditing({ ...EMPTY })} className="inline-flex items-center gap-2 border border-gold/40 px-4 py-2.5 text-gold hover:bg-gold/10">
            <Plus size={13} /> Add product
          </button>
          <label className="inline-flex items-center gap-2 border border-border/50 px-4 py-2.5 text-muted-foreground hover:text-foreground cursor-pointer">
            <Upload size={13} /> Import CSV
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) importCsv(f).catch((err) => toast.error(err?.message ?? "Import failed")); }} />
          </label>
          <button onClick={() => exportCsv().catch((e) => toast.error(e?.message))} className="inline-flex items-center gap-2 border border-border/50 px-4 py-2.5 text-muted-foreground hover:text-foreground">
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => exportSql().catch((e) => toast.error(e?.message))} className="inline-flex items-center gap-2 border border-border/50 px-4 py-2.5 text-muted-foreground hover:text-foreground">
            <Download size={13} /> Export SQL
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
        {[{ slug: "", name: "All" }, ...((catsQ.data ?? []) as Row[])].map((c) => (
          <button
            key={c.slug || "all"}
            onClick={() => setCategory(c.slug)}
            className={`px-4 py-2 text-[10px] tracking-luxury uppercase border transition-colors ${category === c.slug ? "border-gold/60 bg-gold/10 text-gold" : "border-border/40 text-muted-foreground hover:text-foreground"}`}
          >
            {c.name}
          </button>
        ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[280px] flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, city, location, country or ID"
              className="w-full bg-transparent border border-border/40 py-3 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50"
            />
            {search && <button type="button" onClick={() => setSearch("")} title="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={15} /></button>}
          </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-background border border-border/40 px-4 py-3 text-xs uppercase tracking-luxury text-foreground focus:outline-none focus:border-gold/50">
            <option value="">All statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
          <label className="inline-flex items-center gap-2 border border-border/40 px-4 py-3 text-xs uppercase tracking-luxury text-muted-foreground">
            <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="accent-[var(--gold)]" /> Featured only
          </label>
          <span className="text-xs text-muted-foreground">{rows.length} products</span>
        </div>
      </div>

      <div className="border border-border/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-luxury uppercase text-muted-foreground">
            <tr className="border-b border-border/40">
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Flags</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading…</td></tr>}
            {!q.isLoading && q.isError && (
              <tr><td colSpan={6} className="p-8 text-center text-destructive text-xs">
                Could not load products: {(q.error as any)?.message ?? "unknown error"}
                <button onClick={() => q.refetch()} className="ml-3 text-gold hover:underline uppercase tracking-luxury">Retry</button>
              </td></tr>
            )}
            {!q.isLoading && !q.isError && !rows.length && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No products.</td></tr>}

            {rows.map((l) => (
              <tr key={l.id} className="border-b border-border/40 last:border-0 align-top">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {l.cover_image ? (
                      <button onClick={() => openGallery(l.id, l.cover_image)} title="View all product images" className="group relative">
                        <img src={l.cover_image} alt={l.title} loading="lazy" className="h-14 w-20 object-cover border border-border/40 hover:border-gold/60 transition-colors" />
                        <span className="absolute inset-0 grid place-items-center bg-background/55 opacity-0 group-hover:opacity-100 transition-opacity text-gold"><ImageIcon size={17} /></span>
                      </button>
                    ) : (
                      <div className="h-14 w-20 border border-border/40 grid place-items-center text-[9px] text-muted-foreground">No image</div>
                    )}
                    <div>
                      <div className="text-foreground max-w-[380px] truncate">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.location ?? "—"}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs uppercase tracking-luxury text-muted-foreground">{String(l.category_slug).replace(/-/g, " ")}</td>
                <td className="p-4 text-foreground">{formatUsd(Number(l.price_usd))}</td>
                <td className="p-4 text-xs uppercase tracking-luxury text-gold">{l.status}</td>
                <td className="p-4 space-x-3 text-xs whitespace-nowrap">
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!l.featured}
                      disabled={pending === `f-${l.id}`}
                      onChange={(e) => runFlag(`f-${l.id}`, l.id, "featured", e.target.checked, () => featFn({ data: { id: l.id, featured: e.target.checked } }), e.target.checked ? "Marked as featured" : "Removed from featured")}
                      className="accent-[var(--gold)]"
                    /> Featured
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!l.verified}
                      disabled={pending === `v-${l.id}`}
                      onChange={(e) => runFlag(`v-${l.id}`, l.id, "verified", e.target.checked, () => verFn({ data: { id: l.id, verified: e.target.checked } }), e.target.checked ? "Marked verified" : "Verification removed")}
                      className="accent-[var(--gold)]"
                    /> Verified
                  </label>
                </td>
                <td className="p-4 space-x-3 text-xs tracking-luxury uppercase whitespace-nowrap">
                   <button onClick={() => openGallery(l.id, l.cover_image)} className="text-foreground hover:text-gold">Images</button>
                   <button onClick={() => openEdit(l.id)} className="text-gold hover:underline">Edit</button>
                  {l.status !== "approved" && <button onClick={() => statusFn({ data: { id: l.id, status: "approved" } }).then(() => { toast.success("Approved"); refresh(); })} className="text-emerald-400 hover:underline">Approve</button>}
                  <button onClick={() => { if (confirm("Delete this product?")) delFn({ data: { id: l.id } }).then(() => { toast.success("Deleted"); refresh(); }); }} className="text-muted-foreground hover:text-destructive hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductForm
          value={editing}
          categories={(catsQ.data ?? []) as Row[]}
          onClose={() => setEditing(null)}
          onView={(images, index) => setViewer({ images, index })}
          onSaved={async (saved) => {
            qc.setQueriesData({ queryKey: ["admin-catalog"] }, (current: unknown) => {
              if (!Array.isArray(current)) return current;
              const exists = current.some((row: Row) => row.id === saved.id);
              return exists
                ? current.map((row: Row) => row.id === saved.id ? { ...row, ...saved } : row)
                : [saved, ...current];
            });
            await refresh();
            setEditing(null);
          }}
        />
      )}
      {viewer && <Fullscreen images={viewer.images} index={viewer.index} onIndex={(i) => setViewer({ images: viewer.images, index: i })} onClose={() => setViewer(null)} />}
    </>
  );
}

function ProductForm({
  value, categories, onClose, onSaved, onView,
}: {
  value: FormState;
  categories: Row[];
  onClose: () => void;
  onSaved: (saved: Row) => Promise<void>;
  onView: (images: string[], index: number) => void;
}) {
  const save = useServerFn(adminSaveListing);
  const [form, setForm] = useState({ ...value });
  const [imagesText, setImagesText] = useState(value.images.join("\n"));
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const images = imagesText.split("\n").map((s) => s.trim()).filter(Boolean);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await save({
        data: {
          id: form.id || null,
          category_slug: form.category_slug,
          title: form.title,
          subtitle: form.subtitle || null,
          description: form.description || null,
          location: form.location || null,
          country: form.country || null,
          city: form.city || null,
          price_usd: Number(form.price_usd) || 0,
          accepts_btc: !!form.accepts_btc,
          cover_image: form.cover_image || null,
          source_url: form.source_url || null,
          external_id: form.external_id || null,
          status: form.status,
          featured: !!form.featured,
          verified: !!form.verified,
          images,
        },
      });
      if (!result.listing) throw new Error("The database did not return the saved product.");
      await onSaved(result.listing as Row);
      toast.success("Product saved.");
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full bg-transparent border border-border/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-gold/60";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-4 md:p-10">
      <form onSubmit={submit} className="mx-auto max-w-4xl bg-charcoal/95 border border-gold/25 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">{form.id ? "Edit product" : "New product"}</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <L label="Title"><input required value={form.title} onChange={(e) => set("title", e.target.value)} className={field} /></L>
          <L label="Category">
            <select value={form.category_slug} onChange={(e) => set("category_slug", e.target.value)} className={field}>
              {categories.map((c) => <option key={c.slug} value={c.slug} className="bg-charcoal">{c.name}</option>)}
            </select>
          </L>
          <L label="Subtitle"><input value={form.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} className={field} /></L>
          <L label="Location"><input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} className={field} /></L>
          <L label="City"><input value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} className={field} /></L>
          <L label="Country"><input value={form.country ?? ""} onChange={(e) => set("country", e.target.value)} className={field} /></L>
          <L label="Price USD (0 = price on request)"><input type="number" min={0} step="0.01" value={form.price_usd} onChange={(e) => set("price_usd", e.target.value)} className={field} /></L>
          <L label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={field}>
              {["approved", "pending", "draft", "rejected"].map((s) => <option key={s} value={s} className="bg-charcoal">{s}</option>)}
            </select>
          </L>
          <L label="Cover image URL"><input value={form.cover_image ?? ""} onChange={(e) => set("cover_image", e.target.value)} className={field} /></L>
          <L label="Source URL"><input value={form.source_url ?? ""} onChange={(e) => set("source_url", e.target.value)} className={field} /></L>
        </div>

        <L label="Description"><textarea rows={4} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} className={field} /></L>
        <L label="Gallery image URLs (one per line)">
          <textarea rows={5} value={imagesText} onChange={(e) => setImagesText(e.target.value)} className={field} />
        </L>

        {!!images.length && (
          <div className="flex flex-wrap gap-2">
            {images.map((u, i) => (
              <button type="button" key={u + i} onClick={() => onView(images, i)}>
                <img src={u} alt="" loading="lazy" className="h-16 w-24 object-cover border border-border/40 hover:border-gold/60" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-6 text-xs tracking-luxury uppercase text-muted-foreground">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!form.accepts_btc} onChange={(e) => set("accepts_btc", e.target.checked)} className="accent-[var(--gold)]" /> Accepts BTC</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-[var(--gold)]" /> Featured</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!form.verified} onChange={(e) => set("verified", e.target.checked)} className="accent-[var(--gold)]" /> Verified</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button disabled={busy} className="border border-gold/50 bg-gold/10 px-6 py-3 text-[10px] tracking-luxury uppercase text-gold disabled:opacity-50">{busy ? "Saving…" : "Save product"}</button>
          <button type="button" onClick={onClose} className="px-6 py-3 text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-foreground">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      {children}
    </label>
  );
}

function Fullscreen({ images, index, onIndex, onClose }: { images: string[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const src = images[index];
  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
      <div className="flex items-center justify-between p-4 text-gold">
        <div className="text-[10px] tracking-luxury uppercase">{index + 1} / {images.length}</div>
        <div className="flex items-center gap-4">
          <button onClick={() => setZoom((z) => Math.max(1, z - 0.25))}><ZoomOut size={18} /></button>
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))}><ZoomIn size={18} /></button>
          <button onClick={onClose}><X size={20} /></button>
        </div>
      </div>
      <div className="flex-1 grid place-items-center overflow-auto px-4">
        <img src={src} alt="" style={{ transform: `scale(${zoom})` }} className="max-h-[75vh] max-w-full object-contain transition-transform" />
      </div>
      <div className="relative flex items-center gap-3 p-4">
        <button onClick={() => onIndex((index - 1 + images.length) % images.length)} className="text-gold"><ChevronLeft size={22} /></button>
        <div className="flex-1 flex gap-2 overflow-x-auto">
          {images.map((u, i) => (
            <img key={u + i} src={u} alt="" onClick={() => onIndex(i)} className={`h-16 w-24 object-cover cursor-pointer border ${i === index ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`} />
          ))}
        </div>
        <button onClick={() => onIndex((index + 1) % images.length)} className="text-gold"><ChevronRight size={22} /></button>
      </div>
    </div>
  );
}
