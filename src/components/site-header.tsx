import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import solupairLogo from "@/assets/solupair-logo.png";
import solupairLogoMobile from "@/assets/solupair-logo-mobile.png";
import solupairWordmark from "@/assets/solupair-wordmark.png";
import solupairWordmarkMobile from "@/assets/solupair-wordmark-mobile.png";
import { useWordmarkORect } from "@/hooks/use-wordmark-o-rect";

type SiteHeaderProps = {
  /** Sticky bar for inner pages (what-we-build, etc.) */
  sticky?: boolean;
  /** Home only: hide the wordmark's smiley "O" until `logoRevealed`. */
  maskLogo?: boolean;
  logoRevealed?: boolean;
};

const HEADER_HEIGHT_VAR = "--site-header-height";

function SolupairLogo({
  maskLogo = false,
  logoRevealed = false,
}: Pick<SiteHeaderProps, "maskLogo" | "logoRevealed">) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLImageElement>(null);
  const oRect = useWordmarkORect(wrapRef, wordmarkRef, maskLogo);

  return (
    <Link
      to="/"
      className="site-logo inline-flex min-w-0 flex-row items-center gap-2.5 sm:gap-3 lg:gap-3.5"
      aria-label="Solupair home"
    >
      <img
        src={solupairLogo}
        srcSet={`${solupairLogoMobile} 200w, ${solupairLogo} 1536w`}
        sizes="(max-width: 639px) 90px, 1536px"
        alt=""
        aria-hidden
        width={1536}
        height={1206}
        decoding="async"
        fetchPriority="high"
        className="site-logo-mark w-auto shrink-0 object-contain object-left"
      />
      <div className="site-logo-wordmark-wrap" ref={wrapRef}>
        <img
          ref={wordmarkRef}
          src={solupairWordmark}
          srcSet={`${solupairWordmarkMobile} 500w, ${solupairWordmark} 1448w`}
          sizes="(max-width: 639px) 200px, 1448px"
          alt="Solupair"
          width={1448}
          height={176}
          decoding="async"
          fetchPriority="high"
          className="site-logo-wordmark h-full w-auto object-contain object-left"
        />
        {maskLogo && oRect && (
          <>
            <span
              aria-hidden
              className={`site-logo-o-mask${logoRevealed ? " site-logo-o-mask--revealed" : ""}`}
              style={{
                left: oRect.left,
                top: oRect.top,
                width: oRect.width,
                height: oRect.height,
              }}
            />
            <span
              aria-hidden
              className={`site-logo-o-spark${logoRevealed ? " site-logo-o-spark--active" : ""}`}
              style={{
                left: oRect.left,
                top: oRect.top,
                width: oRect.width,
                height: oRect.height,
              }}
            />
          </>
        )}
      </div>
    </Link>
  );
}

function publishHeaderHeight(el: HTMLElement) {
  const height = Math.ceil(el.getBoundingClientRect().height);
  if (height <= 0) return;
  document.documentElement.style.setProperty(HEADER_HEIGHT_VAR, `${height}px`);
}

export function SiteHeader({
  sticky = false,
  maskLogo = false,
  logoRevealed = false,
}: SiteHeaderProps) {
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
          <SolupairLogo maskLogo={maskLogo} logoRevealed={logoRevealed} />
          <nav className="site-nav" aria-label="Primary">
            <a href="/#work" className="site-nav-link site-nav-link--secondary">
              <span className="site-nav-label site-nav-label--short">Work</span>
              <span className="site-nav-label site-nav-label--full">Projects</span>
            </a>
            <Link
              to="/what-we-build"
              className="site-nav-link site-nav-link--secondary"
              activeProps={{
                className: "site-nav-link site-nav-link--secondary site-nav-link--active",
              }}
            >
              <span className="site-nav-label site-nav-label--short">Build</span>
              <span className="site-nav-label site-nav-label--full">What We Build</span>
            </Link>
            <a href="/#contact" className="site-nav-link site-nav-link--primary">
              <span className="site-nav-label site-nav-label--short">Book</span>
              <span className="site-nav-label site-nav-label--full">Book a call</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
