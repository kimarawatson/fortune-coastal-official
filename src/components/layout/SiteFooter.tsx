import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 mt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 max-w-md">
          <div className="font-serif text-2xl text-foreground">Fortune Coastal Group</div>
          <div className="text-[10px] tracking-luxury text-gold uppercase mt-1">A Private Wealth Marketplace</div>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            The world's discreet marketplace for luxury real estate, vehicles, yachts, jets, and exclusive
            experiences — settled in USD or Bitcoin.
          </p>
        </div>
        <div>
          <div className="text-xs tracking-luxury uppercase text-gold mb-5">Marketplace</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/marketplace" className="hover:text-foreground">All Assets</Link></li>
            <li><Link to="/marketplace" className="hover:text-foreground">Real Estate</Link></li>
            <li><Link to="/marketplace" className="hover:text-foreground">Yachts & Jets</Link></li>
            <li><Link to="/marketplace" className="hover:text-foreground">Concierge</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs tracking-luxury uppercase text-gold mb-5">Company</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Become a Seller</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Client Portal</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Fortune Coastal Group. All rights reserved.</div>
          <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Discretion · Verification · Settlement</div>
        </div>
      </div>
    </footer>
  );
}
