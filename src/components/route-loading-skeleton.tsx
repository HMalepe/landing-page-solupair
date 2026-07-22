/**
 * Branded route-transition skeleton — matches sticky header + page shell
 * so navigations never flash an empty document.
 */
export function RouteLoadingSkeleton({
  variant = "page",
}: {
  variant?: "page" | "pricing";
}) {
  return (
    <div
      className="route-skeleton min-h-[100dvh] bg-background font-sans text-foreground"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="route-skeleton__header safe-area-top" aria-hidden>
        <div className="route-skeleton__header-bar">
          <div className="route-skeleton__header-inner">
            <div className="route-skeleton__logo">
              <span className="route-skeleton__block route-skeleton__mark" />
              <span className="route-skeleton__block route-skeleton__wordmark" />
            </div>
            <div className="route-skeleton__nav">
              <span className="route-skeleton__block route-skeleton__nav-pill" />
              <span className="route-skeleton__block route-skeleton__nav-pill" />
              <span className="route-skeleton__block route-skeleton__nav-cta" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`route-skeleton__body${variant === "pricing" ? " route-skeleton__body--pricing" : ""}`}
        aria-hidden
      >
        <div className="route-skeleton__glow route-skeleton__glow--left" />
        <div className="route-skeleton__glow route-skeleton__glow--right" />

        <div className="route-skeleton__content">
          <span className="route-skeleton__block route-skeleton__eyebrow" />
          <span className="route-skeleton__block route-skeleton__title" />
          <span className="route-skeleton__block route-skeleton__title route-skeleton__title--short" />
          <span className="route-skeleton__block route-skeleton__lede" />
          <span className="route-skeleton__block route-skeleton__lede route-skeleton__lede--short" />

          {variant === "pricing" ? (
            <>
              <div className="route-skeleton__chips">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="route-skeleton__block route-skeleton__chip" />
                ))}
              </div>
              <div className="route-skeleton__cards">
                {Array.from({ length: 3 }, (_, i) => (
                  <span key={i} className="route-skeleton__block route-skeleton__card" />
                ))}
              </div>
            </>
          ) : (
            <div className="route-skeleton__cards">
              {Array.from({ length: 2 }, (_, i) => (
                <span key={i} className="route-skeleton__block route-skeleton__card" />
              ))}
            </div>
          )}
        </div>
      </div>

      <span className="sr-only">Loading Solupair…</span>
    </div>
  );
}

export function PricingRouteSkeleton() {
  return <RouteLoadingSkeleton variant="pricing" />;
}
