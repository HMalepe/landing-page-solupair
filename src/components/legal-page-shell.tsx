import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { CONTACT_EMAIL, LEGAL_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

export function LegalPageShell({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page min-h-[100dvh] bg-background font-sans text-foreground">
      <div className="legal-page-shell relative isolate min-h-[100dvh] overflow-x-clip">
        <div className="legal-page-glow legal-page-glow--left" aria-hidden />
        <div className="legal-page-glow legal-page-glow--right" aria-hidden />
        <SiteHeader sticky />

        <article className="legal-page-content relative z-10 mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-10 sm:pb-28 sm:pt-12 lg:px-14 lg:pb-32 lg:pt-14">
          <p className="legal-page-eyebrow">{eyebrow}</p>
          <h1 className="legal-page-title font-display font-black uppercase tracking-tighter text-foreground">
            {title}
          </h1>
          <p className="legal-page-updated">Last updated {updated}</p>

          <div className="legal-page-body">{children}</div>

          <footer className="legal-page-footer">
            <p>
              Questions about this policy? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="legal-page-inline-link">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p className="legal-page-footer-meta">
              © {new Date().getFullYear()} {LEGAL_NAME}.{" "}
              <Link to="/" className="legal-page-inline-link">
                Back to {SITE_NAME}
              </Link>
              {" · "}
              <a href={SITE_URL} className="legal-page-inline-link">
                {SITE_URL.replace("https://", "")}
              </a>
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="legal-section" data-anchor-target>
      <h2 className="legal-section__title">{title}</h2>
      <div className="legal-section__body">{children}</div>
    </section>
  );
}
