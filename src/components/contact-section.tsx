import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ContactHelixBackground } from "@/components/contact-helix-background";
import { LeadForm } from "@/components/lead-form";
import { useSectionInView } from "@/hooks/use-section-in-view";
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
      className={`contact-section safe-area-x section-surface snap-section-compact relative isolate flex flex-col justify-start overflow-x-visible px-4 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10 lg:px-14 lg:pt-14 lg:pb-12${sectionInView ? " contact-in-view" : ""}`}
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
