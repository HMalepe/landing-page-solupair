import { useEffect, useState } from "react";

/**
 * Flips true once the browser reports an idle period after mount (falling
 * back to a short timeout on Safari, which has no requestIdleCallback).
 * Used to defer starting non-critical, code-split work — like importing
 * the hero ball's chunk — until after first paint has had a chance to land.
 */
export function useIdleReady(timeout = 1500) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(
          () =>
            cb({
              didTimeout: false,
              timeRemaining: () => 0,
            }),
          200,
        ));
    const cancelRic = window.cancelIdleCallback ?? window.clearTimeout;

    const id = ric(() => setReady(true), { timeout });
    return () => cancelRic(id);
  }, [timeout]);

  return ready;
}
