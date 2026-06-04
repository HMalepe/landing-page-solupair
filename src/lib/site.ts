/** Production site — matches Vercel custom domain */
export const SITE_HOST = "solupair.co.za";
export const SITE_URL = `https://${SITE_HOST}`;
export const SITE_NAME = "Solupair";
export const LEGAL_NAME = "Solupair Pty Ltd";
export const SITE_TAGLINE = "South African B2B design and software for teams that ship.";
export const LOCATION_LABEL = "South Africa · Johannesburg & Cape Town · Remote-first";
export const CURRENCY = "ZAR";

/** Startup-friendly project budgets (South African Rand) */
export const BUDGET_OPTIONS = [
  "< R50 000",
  "R50k – R150k",
  "R150k – R400k",
  "R400k+",
  "Not sure yet",
] as const;

export const CONTACT_EMAIL = `info@${SITE_HOST}`;
export const CONTACT_PHONE = "+27624760899";
export const CONTACT_PHONE_DISPLAY = "+27 62 476 0899";

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function pageHead({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}) {
  const url = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
