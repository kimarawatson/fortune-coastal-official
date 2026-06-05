import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/fcg-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Fortune Coastal Group" }, { name: "robots", content: "noindex" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-charcoal">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 30% 40%, oklch(0.74 0.09 78 / 0.15), transparent 70%)" }} />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="FCG" className="h-10 w-10" />
            <div className="text-[10px] tracking-luxury uppercase text-gold">Fortune Coastal</div>
          </Link>
          <div>
            <div className="font-serif text-4xl text-foreground italic">"Wealth, made borderless."</div>
            <div className="mt-4 text-xs tracking-luxury uppercase text-gold">FCG · Est. 2024</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 lg:p-16">
        <form
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
          className="w-full max-w-sm"
        >
          <div className="text-[10px] tracking-luxury uppercase text-gold">Member Access</div>
          <h1 className="mt-3 font-serif text-4xl text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your private portal.</p>

          <div className="mt-10 space-y-5">
            <Field label="Email Address" type="email" />
            <Field label="Password" type="password" />
            <button className="w-full bg-gold text-primary-foreground py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors">
              Enter Portal
            </button>
            <div className="text-xs text-muted-foreground text-center">
              No account? <Link to="/register" className="text-gold">Apply for membership</Link>
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
