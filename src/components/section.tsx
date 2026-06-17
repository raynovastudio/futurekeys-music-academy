import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  children,
  className,
  muted,
  id,
}: { children: ReactNode; className?: string; muted?: boolean; id?: string }) {
  return (
    <section id={id} className={cn("py-16 md:py-24", muted && "bg-secondary", className)}>
      <div className="container mx-auto max-w-7xl px-4">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow, title, description, align = "center",
}: { eyebrow?: string; title: string; description?: string; align?: "center" | "left" }) {
  return (
    <div className={cn("mb-12 md:mb-16", align === "center" ? "text-center mx-auto max-w-2xl" : "text-left max-w-2xl")}>
      {eyebrow && (
        <div className={cn("inline-flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold")}>
          <span className="h-px w-6 bg-gold" />{eyebrow}<span className="h-px w-6 bg-gold" />
        </div>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy">{title}</h2>
      {description && <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}
