import { Link } from "@tanstack/react-router";
import { NatureImage } from "@/components/brand/NatureImage";
import { IMAGES } from "@/lib/images";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY, LEGAL_NAME, LOCATION_LABEL, SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      <NatureImage
        src={IMAGES.forest}
        alt="Forest canopy"
        className="absolute inset-0 h-full w-full opacity-30"
        overlay="dark"
      />

      <div className="relative mx-auto max-w-[1100px] px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-sm font-medium text-sage">{LEGAL_NAME}</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
              Design & software, rooted in South Africa.
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              {LEGAL_NAME} builds interfaces, brands, and tools for teams who care about craft — and the people who use what they ship.
            </p>
            <Link to="/contact" className="btn-nature-outline mt-8 inline-flex">
              Book a discovery call
            </Link>
          </div>

          <nav className="md:col-span-4 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">{SITE_NAME}</p>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/services" className="transition-colors hover:text-sage">Services</Link></li>
                <li><Link to="/about" className="transition-colors hover:text-sage">About</Link></li>
                <li><Link to="/contact" className="transition-colors hover:text-sage">Contact</Link></li>
                <li><Link to="/work" className="transition-colors text-text-tertiary hover:text-sage">Work</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">Capabilities</p>
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
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">Contact</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-muted-foreground transition-colors hover:text-sage">{CONTACT_EMAIL}</a>
            <a href={`tel:${CONTACT_PHONE}`} className="mt-2 block text-sm text-muted-foreground transition-colors hover:text-sage">{CONTACT_PHONE_DISPLAY}</a>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">Located</p>
            <p className="text-sm text-muted-foreground">{LOCATION_LABEL}</p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-2 border-t border-border/60 px-6 py-6 text-xs text-text-tertiary md:flex-row">
        <span>© {new Date().getFullYear()} {LEGAL_NAME} · All rights reserved</span>
        <span>{SITE_NAME} · solupair.co.za</span>
      </div>
    </footer>
  );
}
