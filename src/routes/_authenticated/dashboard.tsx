import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight, Bitcoin, Building2, MessageSquare, Receipt, Store,
  TrendingUp, UserCircle, Wallet,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { SignOutButton } from "@/components/SignOutButton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatUsd } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Portfolio Dashboard — Fortune Coastal" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, userId, roles, isSeller, loading } = useAuth();

  const inquiriesQ = useQuery({
    queryKey: ["my-inquiries", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id, message, created_at, seller_response, listings:listing_id(id,title,cover_image,price_usd,location)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const holdingsQ = useQuery({
    queryKey: ["my-holdings", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price_usd, price_btc, status, cover_image, location, category_slug")
        .eq("seller_id", userId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const opportunitiesQ = useQuery({
    queryKey: ["dashboard-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price_usd, price_btc, cover_image, location, category_slug, accepts_btc")
        .eq("status", "approved")
        .order("featured", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid place-items-center text-muted-foreground text-xs tracking-luxury uppercase">
        Loading…
      </div>
    );
  }

  const holdings = holdingsQ.data ?? [];
  const owned = holdings.filter((h) => h.status === "approved");
  const portfolioValue = owned.reduce((s, h) => s + Number(h.price_usd ?? 0), 0);
  const btcHoldings = owned.reduce((s, h) => s + Number(h.price_btc ?? 0), 0);
  const inquiries = inquiriesQ.data ?? [];
  const openInquiries = inquiries.filter((i: any) => !i.seller_response).length;
  const firstName = (user?.user_metadata?.full_name || user?.email || "").split(" ")[0];

  return (
    <SiteLayout>
      <div className="bg-background">
        {/* Welcome */}
        <section className="mx-auto max-w-[1700px] px-4 lg:px-8 pt-12 pb-10">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-[11px] tracking-luxury uppercase text-gold">Member Portfolio</div>
              <h1 className="mt-3 font-serif text-4xl md:text-5xl text-foreground">Welcome back, {firstName}</h1>
              <p className="mt-3 text-base text-muted-foreground">
                {roles.length ? roles.join(" · ") : "buyer"} account · {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/profile" className="inline-flex items-center gap-2 px-5 py-3 text-xs tracking-luxury uppercase text-foreground/80 hover:text-gold transition-colors">
                <UserCircle size={16} /> Profile
              </Link>
              <SignOutButton />
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="mx-auto max-w-[1700px] px-4 lg:px-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi icon={TrendingUp} label="Total Portfolio Value" value={formatUsd(portfolioValue)} note={`${owned.length} verified position${owned.length === 1 ? "" : "s"}`} />
          <Kpi icon={Bitcoin} label="Bitcoin Equivalent" value={btcHoldings ? `₿ ${btcHoldings.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "₿ 0"} note="Settled value of holdings" />
          <Kpi icon={Building2} label="Properties Owned" value={String(owned.length)} note={holdings.length > owned.length ? `${holdings.length - owned.length} pending review` : "All positions active"} />
          <Kpi icon={MessageSquare} label="Open Inquiries" value={String(openInquiries)} note={`${inquiries.length} total conversation${inquiries.length === 1 ? "" : "s"}`} />
        </section>

        {/* Main grid */}
        <section className="mx-auto max-w-[1700px] px-4 lg:px-8 mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr] pb-8">
          {/* Holdings */}
          <Panel title="My Holdings" icon={Building2} action={isSeller ? { to: "/seller", label: "Manage" } : undefined}>
            {holdingsQ.isLoading ? (
              <Loading />
            ) : !holdings.length ? (
              <Empty text="No positions yet." cta={{ to: "/marketplace", label: "Browse Opportunities" }} />
            ) : (
              <ul className="divide-y divide-border/30">
                {holdings.map((h) => (
                  <li key={h.id} className="flex items-center gap-4 py-4">
                    {h.cover_image ? (
                      <img src={h.cover_image} alt="" className="h-14 w-20 object-cover rounded-sm" />
                    ) : (
                      <div className="h-14 w-20 rounded-sm bg-charcoal/50" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-lg text-foreground truncate">{h.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{h.location ?? "United States"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-lg gradient-gold-text">{formatUsd(Number(h.price_usd))}</div>
                      <div className="text-[11px] tracking-luxury uppercase text-muted-foreground">{h.status}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Wallet / actions */}
          <div className="grid gap-4 content-start">
            <Panel title="Quick Actions" icon={Wallet}>
              <div className="grid gap-3">
                <ActionRow to="/marketplace" label="View Opportunities" note="Curated U.S. estates ready to transact" />
                <ActionRow to="/developments" label="Developments" note="Meozzi Star tower programs" />
                <ActionRow to="/seller" label={isSeller ? "Seller Portal" : "Become a Seller"} note={isSeller ? "Manage listings and inquiries" : "Apply to list assets on FCG"} icon={Store} />
              </div>
            </Panel>

            <Panel title="Recent Activity" icon={Receipt}>
              {inquiriesQ.isLoading ? (
                <Loading />
              ) : !inquiries.length ? (
                <Empty text="No activity recorded." cta={{ to: "/marketplace", label: "Start an Inquiry" }} />
              ) : (
                <ul className="divide-y divide-border/30">
                  {inquiries.slice(0, 5).map((i: any) => (
                    <li key={i.id} className="py-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="text-base text-foreground truncate">{i.listings?.title ?? "Listing inquiry"}</div>
                        <div className="text-[11px] tracking-luxury uppercase text-muted-foreground shrink-0">
                          {new Date(i.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{i.message}</div>
                      <div className="mt-1.5 text-[11px] tracking-luxury uppercase text-gold">
                        {i.seller_response ? "Seller responded" : "Awaiting seller"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </section>

        {/* Recommended */}
        <section className="mx-auto max-w-[1700px] px-4 lg:px-8 pb-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] tracking-luxury uppercase text-gold">Recommended</div>
              <h2 className="mt-2 font-serif text-3xl text-foreground">Opportunities for you</h2>
            </div>
            <Link to="/marketplace" className="text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1">
              View all
            </Link>
          </div>

          {opportunitiesQ.isLoading ? (
            <div className="mt-6"><Loading /></div>
          ) : !opportunitiesQ.data?.length ? (
            <div className="mt-6 bg-charcoal/30 p-8 text-muted-foreground">No approved listings available yet.</div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {opportunitiesQ.data.map((o) => (
                <Link key={o.id} to="/asset/$id" params={{ id: o.id }} className="group bg-charcoal/30 hover:bg-charcoal/50 transition-colors overflow-hidden">
                  {o.cover_image && (
                    <img src={o.cover_image} alt={o.title} className="h-44 w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                  )}
                  <div className="p-5">
                    <div className="text-[11px] tracking-luxury uppercase text-gold truncate">{o.location ?? "United States"}</div>
                    <div className="mt-2 font-serif text-xl text-foreground line-clamp-2">{o.title}</div>
                    <dl className="mt-4 space-y-2 text-sm">
                      <Row k="Type" v={String(o.category_slug ?? "").replace(/-/g, " ") || "Real estate"} />
                      <Row k="Price" v={formatUsd(Number(o.price_usd))} gold />
                      <Row k="Min. investment" v={formatUsd(Math.round(Number(o.price_usd) * 0.05))} />
                      <Row k="Settlement" v={o.accepts_btc ? "USD or Bitcoin" : "USD"} />
                    </dl>
                    <div className="mt-5 inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-gold border-b border-gold/50 pb-1 group-hover:gap-3 transition-all">
                      View Opportunity <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}

function Row({ k, v, gold }: { k: string; v: string; gold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground text-[13px]">{k}</dt>
      <dd className={`${gold ? "gradient-gold-text font-serif text-base" : "text-foreground"} text-right capitalize`}>{v}</dd>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, note }: { icon: any; label: string; value: string; note: string }) {
  return (
    <div className="bg-charcoal/30 p-7">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 grid place-items-center rounded-full bg-gold/10 text-gold"><Icon size={20} strokeWidth={1.5} /></div>
        <div className="text-[11px] tracking-luxury uppercase text-muted-foreground">{label}</div>
      </div>
      <div className="mt-5 font-serif text-4xl gradient-gold-text">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{note}</div>
    </div>
  );
}

function Panel({ title, icon: Icon, action, children }: { title: string; icon: any; action?: { to: string; label: string }; children: React.ReactNode }) {
  return (
    <div className="bg-charcoal/30 p-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon size={16} className="text-gold" />
          <h2 className="font-serif text-2xl text-foreground">{title}</h2>
        </div>
        {action && (
          <Link to={action.to as any} className="text-xs tracking-luxury uppercase text-gold">{action.label}</Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ActionRow({ to, label, note, icon: Icon = ArrowRight }: { to: string; label: string; note: string; icon?: any }) {
  return (
    <Link to={to as any} className="flex items-center gap-4 p-4 bg-background/40 hover:bg-background/70 transition-colors">
      <div className="h-9 w-9 grid place-items-center rounded-full bg-gold/10 text-gold"><Icon size={16} strokeWidth={1.5} /></div>
      <div className="min-w-0">
        <div className="text-base text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground truncate">{note}</div>
      </div>
      <ArrowRight size={15} className="ml-auto text-gold/70" />
    </Link>
  );
}

function Loading() {
  return <div className="text-xs tracking-luxury uppercase text-muted-foreground py-6">Loading…</div>;
}

function Empty({ text, cta }: { text: string; cta: { to: string; label: string } }) {
  return (
    <div className="py-10 text-center">
      <div className="text-muted-foreground">{text}</div>
      <Link to={cta.to as any} className="mt-3 inline-block text-gold text-xs tracking-luxury uppercase border-b border-gold/50 pb-1">{cta.label}</Link>
    </div>
  );
}
