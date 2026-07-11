import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
  as?: "div" | "section" | "article" | "li" | "span";
};

export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setVisible(true); io.disconnect(); break; }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delayClass = delay ? ` reveal-delay-${delay}` : "";
  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`reveal${delayClass}${visible ? " is-visible" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
