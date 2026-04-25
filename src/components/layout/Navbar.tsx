import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { XMark } from "@/components/brand/XMark";

const NAV = [
  { to: "/articles", label: "Articles" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/newsletter", label: "Newsletter" },
] as const;

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

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link to="/" className="group flex items-center gap-2">
            <XMark size={14} className="text-teal transition-transform duration-300 group-hover:rotate-45" />
            <span className="font-serif text-lg tracking-tight md:text-xl">Shelf Life Wisdom</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group relative font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className={active ? "text-foreground" : ""}>{item.label}</span>
                  <span
                    className="absolute -bottom-1 left-0 h-px bg-teal transition-all duration-300"
                    style={{ width: active ? "100%" : "0%" }}
                  />
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
            <Link
              to="/newsletter"
              className="rounded-full bg-teal px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-background transition-all hover:shadow-teal-glow"
            >
              Subscribe Free
            </Link>
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden rounded p-2 text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background md:hidden">
          <div className="flex h-16 items-center justify-between px-6">
            <Link to="/" className="flex items-center gap-2">
              <XMark size={14} className="text-teal" />
              <span className="font-serif text-lg">Shelf Life Wisdom</span>
            </Link>
            <button onClick={() => setOpen(false)} className="p-2" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-serif text-4xl tracking-tight text-foreground transition-colors hover:text-teal"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/newsletter"
              className="mt-4 rounded-full bg-teal px-6 py-3 font-mono text-xs uppercase tracking-wider text-background"
            >
              Subscribe Free
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
