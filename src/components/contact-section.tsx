import { Link } from "@tanstack/react-router";
import { ContactHelixBackground } from "@/components/contact-helix-background";
import { LeadForm, type LeadFormQuotePrefill } from "@/components/lead-form";
import { useSectionInView } from "@/hooks/use-section-in-view";

type ContactSectionProps = {
  /** Set when a visitor arrives here via "Lock this quote & book a call". */
  pendingQuote?: LeadFormQuotePrefill;
  /** Called once the lead form successfully submits, to clear the pending quote. */
  onQuoteConsumed?: () => void;
};

export function ContactSection({ pendingQuote, onQuoteConsumed }: ContactSectionProps) {
  const { sectionRef, sectionInView } = useSectionInView();

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
              Let&apos;s Talk
            </h2>
            <p className="contact-lead contact-reveal contact-reveal--lead">
              Tell us what you need. We&apos;ll reply with the best next step, rough scope and
              starting price range.
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

          <div className="contact-reveal contact-reveal--form">
            <LeadForm initialQuote={pendingQuote} onSubmitted={onQuoteConsumed} />
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
