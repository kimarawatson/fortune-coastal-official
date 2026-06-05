import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/fcg-logo.png";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Apply — Fortune Coastal Group" }, { name: "robots", content: "noindex" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-charcoal">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 70% 60%, oklch(0.74 0.09 78 / 0.15), transparent 70%)" }} />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="FCG" className="h-10 w-10" />
            <div className="text-[10px] tracking-luxury uppercase text-gold">Fortune Coastal</div>
          </Link>
          <div>
            <div className="font-serif text-4xl text-foreground">A private circle, by application.</div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">Membership is reviewed by our advisory desk within 48 hours.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 lg:p-16">
        <form
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
          className="w-full max-w-md"
        >
          <div className="text-[10px] tracking-luxury uppercase text-gold">Apply for Membership</div>
          <h1 className="mt-3 font-serif text-4xl text-foreground">Begin your application</h1>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <Field label="First Name" />
            <Field label="Last Name" />
            <div className="col-span-2"><Field label="Email Address" type="email" /></div>
            <div className="col-span-2"><Field label="Country of Residence" /></div>
            <div className="col-span-2"><Field label="Password" type="password" /></div>
            <button className="col-span-2 bg-gold text-primary-foreground py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
              Submit Application
            </button>
            <div className="col-span-2 text-xs text-muted-foreground text-center">
              Already a member? <Link to="/login" className="text-gold">Sign in</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">{label}</div>
      <input type={type} className="w-full bg-charcoal border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
    </label>
  );
}
