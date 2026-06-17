import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo1 from "@/assets/1.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/instruments", label: "Instruments" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "bg-background/85 backdrop-blur-xl border-b shadow-sm" : "bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo1} alt="FutureKeys Music Academy" className="h-10 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-navy" : "text-foreground/70 hover:text-navy"
                )}
              >
                {n.label}
                {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gold rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button asChild variant="gold" size="default">
            <Link to="/enroll">Enroll Now</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium",
                  pathname === n.to ? "bg-secondary text-navy" : "text-foreground/80 hover:bg-secondary"
                )}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="gold">
                <Link to="/enroll">Enroll Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
