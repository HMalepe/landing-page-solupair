const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
type UtmKey = (typeof UTM_KEYS)[number];

export type UtmParams = Partial<Record<UtmKey, string>>;

/** Reads UTM params from the current URL, if present. */
export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  const search = new URLSearchParams(window.location.search);
  const result: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = search.get(key);
    if (value) result[key] = value;
  }
  return result;
}
