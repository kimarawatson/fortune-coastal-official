import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackToSiteLink({
  className = "",
  label = "Back to site",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-gold transition-colors ${className}`.trim()}
    >
      <ArrowLeft size={14} />
      {label}
    </Link>
  );
}