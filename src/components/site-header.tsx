import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import solupairLogo from "@/assets/solupair-logo.png";
import solupairWordmark from "@/assets/solupair-wordmark.png";

type SiteHeaderProps = {
  /** Sticky bar for inner pages (pricing, etc.) */
  sticky?: boolean;
};

const HEADER_HEIGHT_VAR = "--site-header-height";

function SolupairLogo() {
  return (
    <Link
      to="/"
      className="site-logo inline-flex min-w-0 flex-row items-center gap-2.5 sm:gap-3 lg:gap-3.5"
      aria-label="Solupair home"
    >
      <img
        src={solupairLogo}
        alt=""
        aria-hidden
        width={1536}
        height={1206}
        decoding="async"
        className="site-logo-mark w-auto shrink-0 object-contain object-left"
      />
      <div className="site-logo-wordmark-wrap">
        <img
          src={solupairWordmark}
          alt="Solupair"
          width={1448}
          height={176}
          decoding="async"
          className="site-logo-wordmark h-full w-auto object-contain object-left"
        />
      </div>
    </Link>
  );
}

function publishHeaderHeight(el: HTMLElement) {
  const height = Math.ceil(el.getBoundingClientRect().height);
  if (height <= 0) return;
  document.documentElement.style.setProperty(HEADER_HEIGHT_VAR, `${height}px`);
}

export function SiteHeader({ sticky = false }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    publishHeaderHeight(el);

    const ro = new ResizeObserver(() => {
      publishHeaderHeight(el);
    });
    ro.observe(el);

    const onViewport = () => publishHeaderHeight(el);
    window.addEventListener("resize", onViewport);
    window.visualViewport?.addEventListener("resize", onViewport);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onViewport);
      window.visualViewport?.removeEventListener("resize", onViewport);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`site-header safe-area-top relative z-50 w-full${sticky ? " site-header--sticky" : ""}`}
    >
      <div className="site-header-bar">
        <div className="site-header-inner">
          <SolupairLogo />
          <nav className="site-nav" aria-label="Primary">
            <a href="/#work" className="site-nav-link site-nav-link--secondary">
              <span className="site-nav-label site-nav-label--short">Work</span>
              <span className="site-nav-label site-nav-label--full">Projects</span>
            </a>
            <Link
              to="/pricing"
              className="site-nav-link site-nav-link--secondary"
              activeProps={{
                className: "site-nav-link site-nav-link--secondary site-nav-link--active",
              }}
            >
              <span className="site-nav-label site-nav-label--short">Price</span>
              <span className="site-nav-label site-nav-label--full">Pricing</span>
            </Link>
            <a href="/#contact" className="site-nav-link site-nav-link--primary">
              <span className="site-nav-label site-nav-label--short">Start</span>
              <span className="site-nav-label site-nav-label--full">Start a project</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
