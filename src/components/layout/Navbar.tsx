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
    <span className="flex items-center gap-2">
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <span className="absolute inset-0 rounded-md bg-gradient-to-br from-cyan to-plasma opacity-90" />
        <span className="absolute inset-[3px] rounded-[5px] bg-background" />
        <span className="relative font-mono text-[11px] font-bold tracking-tighter text-foreground">SP</span>
      </span>
      <span className="font-display text-lg font-medium tracking-tight">solupair</span>
      <span className="hidden font-mono text-[9px] uppercase tracking-widest text-text-tertiary md:inline">pty ltd</span>
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
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6">
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
                  className={`group relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
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

          <div className="hidden md:flex items-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-lime pulse-dot" />
              Booking · Q3
            </span>
            <Link
              to="/contact"
              className="rounded-full border border-cyan px-5 py-2 font-mono text-[11px] uppercase tracking-wider text-cyan btn-fill"
            >
              Start a project →
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden rounded p-2"
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
                className="font-display text-5xl tracking-tight hover:gradient-aurora-text"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-4 rounded-full bg-cyan px-6 py-3 font-mono text-xs uppercase tracking-wider text-background"
            >
              Start a project →
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
