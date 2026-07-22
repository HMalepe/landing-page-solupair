import { useLayoutEffect, useRef, useState } from "react";
import { useDeviceProfile } from "@/hooks/use-device-profile";

type SectionInViewOptions = {
  /** IntersectionObserver threshold(s). Prefer defaults — high values break tall pages. */
  threshold?: number | number[];
  rootMargin?: string;
  /**
   * Require this much of the element (or of the viewport filled by it) before revealing.
   * Prevents mid-snap ghost opacity when only a sliver is visible.
   */
  minRatio?: number;
  /** Hold intersection this long before flipping — skips transient snap crossings. */
  settleMs?: number;
};

const DEFAULT_THRESHOLDS = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8];

function isMeaningfullyVisible(
  el: HTMLElement,
  minRatio: number,
  rootMarginBottomPct = 0.18,
) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (vh <= 0) return false;

  const topBound = vh * rootMarginBottomPct;
  const bottomBound = vh * (1 - rootMarginBottomPct);
  const visibleTop = Math.max(rect.top, topBound);
  const visibleBottom = Math.min(rect.bottom, bottomBound);
  const visiblePx = Math.max(0, visibleBottom - visibleTop);
  if (visiblePx <= 0) return false;

  const elementRatio = visiblePx / Math.max(rect.height, 1);
  const viewportFill = visiblePx / vh;
  return elementRatio >= minRatio || viewportFill >= Math.max(minRatio, 0.4);
}

function entryIsMeaningful(
  entry: IntersectionObserverEntry,
  minRatio: number,
): boolean {
  if (!entry.isIntersecting) return false;
  const rootH = entry.rootBounds?.height ?? window.innerHeight;
  if (rootH <= 0) return false;
  const visiblePx = entry.intersectionRect.height;
  const viewportFill = visiblePx / rootH;
  return entry.intersectionRatio >= minRatio || viewportFill >= Math.max(minRatio, 0.4);
}

/** IntersectionObserver reveal trigger — respects prefers-reduced-motion. */
export function useSectionInView(options: SectionInViewOptions = {}) {
  const {
    threshold = DEFAULT_THRESHOLDS,
    // Shrink the bottom of the root so we wait until the section has risen into view.
    rootMargin = "0px 0px -18% 0px",
    minRatio = 0.35,
    settleMs = 150,
  } = options;
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionInView, setSectionInView] = useState(false);
  const { prefersReducedMotion } = useDeviceProfile();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion) {
      setSectionInView(true);
      return;
    }

    // Sync check before paint — avoids a blank opacity-0 flash on route entry.
    if (isMeaningfullyVisible(section, minRatio)) {
      setSectionInView(true);
      return;
    }

    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setSectionInView(true);
      observer.disconnect();
    };

    const clearSettle = () => {
      if (settleTimer !== null) {
        clearTimeout(settleTimer);
        settleTimer = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || revealed) return;

        if (!entryIsMeaningful(entry, minRatio)) {
          clearSettle();
          return;
        }

        if (settleMs <= 0) {
          reveal();
          return;
        }

        if (settleTimer !== null) return;
        settleTimer = setTimeout(() => {
          settleTimer = null;
          // Re-check after settle — snap may have bounced past.
          if (isMeaningfullyVisible(section, minRatio)) {
            reveal();
          }
        }, settleMs);
      },
      { threshold, rootMargin },
    );

    observer.observe(section);
    return () => {
      clearSettle();
      observer.disconnect();
    };
  }, [prefersReducedMotion, rootMargin, threshold, minRatio, settleMs]);

  return { sectionRef, sectionInView };
}
