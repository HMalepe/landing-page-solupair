import { Link } from "@tanstack/react-router";
import { XMark } from "@/components/brand/XMark";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <XMark className="text-teal" size={14} />
              <span className="font-serif text-2xl tracking-tight">Shelf Life Wisdom</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Editorial-grade inventory wisdom for operators who actually work the floor.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-teal">
              Know your shelf.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                Read
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/articles" className="hover:text-teal transition-colors">Articles</Link></li>
                <li><Link to="/categories" className="hover:text-teal transition-colors">Categories</Link></li>
                <li><Link to="/about" className="hover:text-teal transition-colors">About</Link></li>
                <li><Link to="/newsletter" className="hover:text-teal transition-colors">Newsletter</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                Topics
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/categories/$slug" params={{ slug: "fifo-fefo" }} className="hover:text-teal transition-colors">FIFO & FEFO</Link></li>
                <li><Link to="/categories/$slug" params={{ slug: "waste-reduction" }} className="hover:text-teal transition-colors">Waste Reduction</Link></li>
                <li><Link to="/categories/$slug" params={{ slug: "cold-chain" }} className="hover:text-teal transition-colors">Cold Chain</Link></li>
                <li><Link to="/categories/$slug" params={{ slug: "retail-ops" }} className="hover:text-teal transition-colors">Retail Ops</Link></li>
              </ul>
            </div>
          </nav>

          <div className="md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
              Powered by
            </p>
            <div className="mt-2 inline-flex items-center gap-2 opacity-60">
              <XMark size={12} className="text-teal" />
              <span className="font-serif text-base">ExpiryDesk</span>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-teal">
              Track · Alert · Prevent Waste
            </p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-teal/40 to-transparent" />

      <div className="mx-auto max-w-[1200px] px-6 py-6 text-center font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
        © Shelf Life Wisdom. Know your shelf.
      </div>
    </footer>
  );
}
