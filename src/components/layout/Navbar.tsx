import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-sage/15 ring-1 ring-sage/30">
        <span className="font-display text-sm font-semibold text-sage">S</span>
      </span>
      <span className="font-display text-lg font-medium tracking-tight">solupair</span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
          <Link to="/" className="group">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <span className="absolute inset-0 rounded-full border border-border bg-surface" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-sage pulse-dot" />
              South Africa · Open briefs
            </span>
            <Link to="/contact" className="btn-nature-primary py-2 text-sm">
              Start a project
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded p-2 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background md:hidden">
          <div className="flex h-16 items-center justify-between px-6">
            <Link to="/"><Logo /></Link>
            <button onClick={() => setOpen(false)} className="p-2" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-display text-4xl tracking-tight hover:text-sage"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-nature-primary mt-4">
              Start a project
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
