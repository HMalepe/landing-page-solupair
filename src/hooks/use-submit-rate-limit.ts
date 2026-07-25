const STORAGE_KEY = "solupair_lead_last_submit_at";
const COOLDOWN_MS = 30_000;

/** Basic client-side anti-spam: blocks rapid resubmission from the same browser. */
export function useSubmitRateLimit() {
  const checkAndMark = (): { allowed: true } | { allowed: false; waitSeconds: number } => {
    if (typeof window === "undefined") return { allowed: true };

    const last = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
    const elapsed = Date.now() - last;

    if (last && elapsed < COOLDOWN_MS) {
      return { allowed: false, waitSeconds: Math.ceil((COOLDOWN_MS - elapsed) / 1000) };
    }

    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    return { allowed: true };
  };

  return { checkAndMark };
}
