import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import logo from "@/assets/fcg-logo.png";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Access" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === "admin" && p === "admin") {
      sessionStorage.setItem("fcg-admin", "1");
      navigate({ to: "/admin" });
    } else {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-md border border-border/40 bg-charcoal/50 p-10">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="" className="h-10 w-10" />
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold">Restricted</div>
            <div className="font-serif text-xl text-foreground">Administrator Access</div>
          </div>
        </div>

        <div className="space-y-5">
          <label className="block">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">Username</div>
            <input value={u} onChange={(e) => setU(e.target.value)} className="w-full bg-background border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
          </label>
          <label className="block">
            <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mb-2">Password</div>
            <input type="password" value={p} onChange={(e) => setP(e.target.value)} className="w-full bg-background border border-border/40 px-4 py-3 text-foreground focus:border-gold focus:outline-none" />
          </label>
          {err && <div className="text-xs text-destructive">{err}</div>}
          <button className="w-full bg-gold text-primary-foreground py-4 text-xs tracking-luxury uppercase hover:bg-gold-soft transition-colors inline-flex items-center justify-center gap-2">
            <ShieldCheck size={14} /> Authenticate
          </button>
          <div className="text-[10px] text-muted-foreground text-center">Demo credentials: admin / admin</div>
        </div>
      </form>
    </div>
  );
}
