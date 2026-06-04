import { Link } from "@tanstack/react-router";
import { CONTACT_EMAIL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <div className="aurora-blob -top-32 -left-20 h-72 w-72 bg-cyan/20" />
      <div className="aurora-blob bottom-0 right-0 h-80 w-80 bg-plasma/20" />

      <div className="relative mx-auto max-w-[1320px] px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
              [ solupair / studio ]
            </p>
            <h2 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">
              Design that<br />
              <span className="gradient-aurora-text">ships revenue.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              A futures-first design studio building interfaces, brands and tools for ambitious software teams.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-cyan btn-fill"
            >
              Book a discovery call <span aria-hidden>→</span>
            </Link>
          </div>

          <nav className="md:col-span-4 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Studio</p>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/services" className="hover:text-cyan transition-colors">Services</Link></li>
                <li><Link to="/work" className="hover:text-cyan transition-colors">Work</Link></li>
                <li><Link to="/process" className="hover:text-cyan transition-colors">Process</Link></li>
                <li><Link to="/about" className="hover:text-cyan transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Capabilities</p>
              <ul className="space-y-3 text-muted-foreground">
                <li>Product UI/UX</li>
                <li>Brand systems</li>
                <li>Landing pages</li>
                <li>E-commerce</li>
                <li>Internal tools</li>
              </ul>
            </div>
          </nav>

          <div className="md:col-span-3">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Signal</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-muted-foreground hover:text-cyan transition-colors">{CONTACT_EMAIL}</a>
            <p className="text-sm text-muted-foreground">+1 (415) 555·0117</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Located</p>
            <p className="text-sm text-muted-foreground">SF · Lisbon · Remote-first</p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      <div className="relative mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-2 px-6 py-6 font-mono text-[10px] uppercase tracking-widest text-text-tertiary md:flex-row">
        <span>© {new Date().getFullYear()} Solupair Studio · All rights reserved</span>
        <span>v.2026.4 · Built in-house</span>
      </div>
    </footer>
  );
}
