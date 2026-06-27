import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/fcg-logo.png";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];


export function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const { session, isAdmin, isSeller } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" aria-label="FCG home">
          <img src={logo} alt="Fortune Coastal Group" className="h-10 w-10 rounded-md" />
          <div className="hidden sm:block leading-tight">
            <div className="font-serif text-lg text-foreground">Fortune Coastal</div>
            <div className="text-[10px] tracking-luxury text-gold uppercase">Group</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((n) => {
            const active = n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`text-xs tracking-luxury uppercase transition-colors ${active ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}>
                {n.label}
              </Link>
            );
          })}
          {session && (
            <>
              {isSeller && <Link to="/seller" className="text-xs tracking-luxury uppercase text-muted-foreground hover:text-foreground">Seller</Link>}
              {isAdmin && <Link to="/admin" className="text-xs tracking-luxury uppercase text-gold">Admin</Link>}
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!session ? (
            <>
              <Link to="/auth" className="text-xs tracking-luxury uppercase text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/auth" className="text-xs tracking-luxury uppercase border border-gold/60 text-gold px-5 py-2.5 hover:bg-gold hover:text-primary-foreground transition-colors">Apply</Link>
            </>
          ) : (
            <Link to="/dashboard" className="text-xs tracking-luxury uppercase border border-gold/60 text-gold px-5 py-2.5 hover:bg-gold hover:text-primary-foreground transition-colors">My Portal</Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-6 flex flex-col gap-5">
            {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-sm tracking-luxury uppercase text-foreground">{n.label}</Link>)}
            
            {session && isSeller && <Link to="/seller" onClick={() => setOpen(false)} className="text-sm tracking-luxury uppercase text-foreground">Seller</Link>}
            {session && isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="text-sm tracking-luxury uppercase text-gold">Admin</Link>}
            <div className="hairline my-2" />
            {!session ? (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-sm tracking-luxury uppercase text-gold">Sign in / Apply</Link>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
