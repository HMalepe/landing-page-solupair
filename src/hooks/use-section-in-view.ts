import { useLayoutEffect, useRef, useState } from "react";
import { useDeviceProfile } from "@/hooks/use-device-profile";

type SectionInViewOptions = {
  threshold?: number | number[];
  rootMargin?: string;
  /** Fraction of element (or viewport fill) required before reveal. */
  minRatio?: number;
  /** Brief debounce so fast flings don’t flash mid-pass. */
  settleMs?: number;
};

const DEFAULT_THRESHOLDS = [0, 0.08, 0.16, 0.28, 0.45, 0.65];

function isMeaningfullyVisible(el: HTMLElement, minRatio: number) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (vh <= 0) return false;

  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, vh);
  const visiblePx = Math.max(0, visibleBottom - visibleTop);
  if (visiblePx <= 0) return false;

  const elementRatio = visiblePx / Math.max(rect.height, 1);
  const viewportFill = visiblePx / vh;
  return elementRatio >= minRatio || viewportFill >= 0.28;
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
  return entry.intersectionRatio >= minRatio || viewportFill >= 0.28;
}

/**
 * One-shot section reveal for a mount cycle.
 * Home remounts (via motion epoch) start a fresh cycle from page one.
 */
export function useSectionInView(options: SectionInViewOptions = {}) {
  const {
    threshold = DEFAULT_THRESHOLDS,
    rootMargin = "0px 0px -10% 0px",
    minRatio = 0.16,
    settleMs = 48,
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
          if (isMeaningfullyVisible(section, minRatio)) reveal();
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
