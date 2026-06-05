import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/fcg-logo.png";

const nav = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Hidden admin entry — clicking logo goes to admin login
    navigate({ to: "/admin-login" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="/admin-login" onClick={handleLogoClick} className="flex items-center gap-3 group" aria-label="FCG home">
          <img src={logo} alt="Fortune Coastal Group" className="h-10 w-10 rounded-md" />
          <div className="hidden sm:block leading-tight">
            <div className="font-serif text-lg text-foreground">Fortune Coastal</div>
            <div className="text-[10px] tracking-luxury text-gold uppercase">Group</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((n) => {
            const active = location.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`text-xs tracking-luxury uppercase transition-colors ${active ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-xs tracking-luxury uppercase text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-xs tracking-luxury uppercase border border-gold/60 text-gold px-5 py-2.5 hover:bg-gold hover:text-primary-foreground transition-colors"
          >
            Apply
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-6 flex flex-col gap-5">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-sm tracking-luxury uppercase text-foreground">
                {n.label}
              </Link>
            ))}
            <div className="hairline my-2" />
            <Link to="/login" onClick={() => setOpen(false)} className="text-sm tracking-luxury uppercase text-muted-foreground">Sign In</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="text-sm tracking-luxury uppercase text-gold">Apply</Link>
          </div>
        </div>
      )}
    </header>
  );
}
