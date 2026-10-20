import { Link } from "@tanstack/react-router";
import { track } from "@vercel/analytics";
import { useEffect, useRef, useState } from "react";
import { ContactHelixBackground } from "@/components/contact-helix-background";
import { LeadForm } from "@/components/lead-form";
import { useSectionInView } from "@/hooks/use-section-in-view";
import { CONTACT_WHATSAPP_URL } from "@/lib/site";
import { BOOKING_FORM_EVENT, openBookingForm } from "@/lib/open-booking-form";

function revealBookingForm() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const panel = document.getElementById("book");
  if (panel) {
    const rect = panel.getBoundingClientRect();
    const header = 80;
    const inView = rect.top >= header && rect.top < window.innerHeight * 0.72;
    if (!inView) {
      panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    }
  }
  window.setTimeout(() => {
    document.getElementById("lead-name")?.focus({ preventScroll: true });
  }, 80);
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z" />
    </svg>
  );
}

export function ContactSection() {
  const { sectionRef, sectionInView } = useSectionInView();
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (open) revealBookingForm();
  }, [open]);

  useEffect(() => {
    const openForm = () => {
      if (openRef.current) {
        revealBookingForm();
        return;
      }
      setOpen(true);
    };

    if (window.location.hash === "#book") openForm();
    window.addEventListener(BOOKING_FORM_EVENT, openForm);
    return () => window.removeEventListener(BOOKING_FORM_EVENT, openForm);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-scroll-snap="contact"
      aria-labelledby="contact-heading"
      className={`contact-section safe-area-x section-surface snap-section-compact relative isolate flex flex-col justify-start overflow-x-visible px-4 pt-10 pb-10 sm:px-10 sm:pt-12 sm:pb-12 lg:px-14 lg:pt-14 lg:pb-14${sectionInView ? " contact-in-view" : ""}`}
    >
      <div className="contact-helix-anchor" aria-hidden>
        <ContactHelixBackground />
        <div className="contact-helix-glow-line" />
      </div>
      <div className="contact-shell relative z-10 mx-auto w-full max-w-7xl border-t border-subtle pt-6 sm:pt-8 lg:pt-10">
        <div className="contact-grid">
          <div className="contact-intro">
            <h2
              id="contact-heading"
              className="contact-heading contact-reveal contact-reveal--heading font-display font-black uppercase tracking-tighter text-foreground"
            >
              <button
                type="button"
                className="contact-heading-btn"
                aria-expanded={open}
                aria-controls="book"
                onClick={() => openBookingForm()}
              >
                Let&apos;s Talk
              </button>
            </h2>
            <p className="contact-lead contact-reveal contact-reveal--lead">
              {open
                ? "Your name, how to reach you, and what you need. We'll call within 1–2 business days."
                : "Tell us how to reach you and we'll call you back."}
            </p>
          </div>

          <aside className="contact-details contact-reveal contact-reveal--details">
            <div className="contact-details-block">
              <div className="contact-details-label">Email</div>
              <a
                href="mailto:info@solupair.co.za"
                className="contact-text-link mt-1 block break-all text-base text-foreground transition hover:text-brand-cyan"
              >
                info@solupair.co.za
              </a>
            </div>
            <div className="contact-details-block">
              <div className="contact-details-label">WhatsApp</div>
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { source: "contact" })}
                className="contact-text-link mt-1 inline-flex items-center gap-2 text-base text-foreground transition hover:text-brand-cyan"
              >
                <WhatsAppIcon className="size-[1.15em] shrink-0" />
                Message us on WhatsApp
              </a>
            </div>
            <div className="contact-details-block">
              <div className="contact-details-label">Location</div>
              <p className="contact-details-copy">
                South Africa · Johannesburg &amp; Cape Town · Remote-first
              </p>
            </div>
          </aside>

          <div className="contact-booking contact-reveal contact-reveal--form">
            {!open && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="hero-btn hero-btn--primary touch-target"
                  onClick={() => openBookingForm()}
                >
                  <span>Book a call</span>
                </button>
                <Link
                  to="/pricing"
                  className="hero-btn hero-btn--secondary touch-target inline-flex"
                >
                  <span>Get a price</span>
                </Link>
              </div>
            )}
            <div
              id="book"
              className={`contact-booking-panel${open ? " contact-booking-panel--open" : ""}`}
            >
              <div className="contact-booking-panel__inner">
                {open && (
                  <>
                    <LeadForm variant="quick" />
                    <Link
                      to="/pricing"
                      className="contact-text-link w-fit text-sm text-text-soft hover:text-brand-cyan"
                    >
                      Want a price first? Get a price
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="safe-area-bottom contact-footer">
          <p className="contact-footer-copy">© 2026 Solupair Pty Ltd. All rights reserved.</p>
          <nav className="contact-footer-nav" aria-label="Legal">
            <Link to="/privacy" className="contact-footer-link">
              Privacy
            </Link>
            <Link to="/terms" className="contact-footer-link">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
