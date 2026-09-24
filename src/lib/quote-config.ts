/**
 * ZAR quote-builder pricing model — a data file, edit ranges here without
 * touching the configurator UI. Figures live on the pricing page.
 */
export const PENDING_QUOTE_STORAGE_KEY = "solupair-pending-quote";

export type ProjectTypeId = "website" | "dashboard" | "whatsapp" | "internal-tool";

export type ProjectTypeConfig = {
  id: ProjectTypeId;
  label: string;
  description: string;
  base: { min: number; max: number };
};

export const PROJECT_TYPES: readonly ProjectTypeConfig[] = [
  {
    id: "website",
    label: "Website",
    description: "Marketing site or landing page",
    base: { min: 3500, max: 9000 },
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Internal or customer-facing dashboard",
    base: { min: 7500, max: 18000 },
  },
  {
    id: "whatsapp",
    label: "WhatsApp automation",
    description: "Booking, FAQ or reminder automation",
    base: { min: 6000, max: 15000 },
  },
  {
    id: "internal-tool",
    label: "Internal tool",
    description: "Custom workflow or ops tool",
    base: { min: 12000, max: 30000 },
  },
] as const;

export type AddOnId =
  | "payments"
  | "booking-system"
  | "third-party-integration"
  | "custom-reporting";

export type AddOnConfig = {
  id: AddOnId;
  label: string;
  delta: { min: number; max: number };
};

export const ADD_ONS: readonly AddOnConfig[] = [
  { id: "payments", label: "Payment integration", delta: { min: 1500, max: 4000 } },
  { id: "booking-system", label: "Booking / calendar system", delta: { min: 2000, max: 5000 } },
  {
    id: "third-party-integration",
    label: "Third-party integration (CRM, POS, etc.)",
    delta: { min: 1500, max: 4500 },
  },
  {
    id: "custom-reporting",
    label: "Custom reporting / analytics",
    delta: { min: 2000, max: 6000 },
  },
] as const;

/** Per extra page/section beyond the base scope. */
export const EXTRA_PAGE_DELTA = { min: 400, max: 900 } as const;
export const EXTRA_PAGES_MIN = 0;
export const EXTRA_PAGES_MAX = 10;

export type UrgencyId = "standard" | "priority" | "rush";

export type UrgencyConfig = {
  id: UrgencyId;
  label: string;
  description: string;
  multiplier: number;
};

export const URGENCY_LEVELS: readonly UrgencyConfig[] = [
  { id: "standard", label: "Standard", description: "3–8 weeks", multiplier: 1 },
  { id: "priority", label: "Priority", description: "2–5 weeks", multiplier: 1.2 },
  { id: "rush", label: "Rush", description: "Under 2 weeks", multiplier: 1.45 },
] as const;

export type QuoteSelection = {
  projectType: ProjectTypeId;
  extraPages: number;
  addOns: AddOnId[];
  urgency: UrgencyId;
};

export const DEFAULT_QUOTE_SELECTION: QuoteSelection = {
  projectType: "website",
  extraPages: 0,
  addOns: [],
  urgency: "standard",
};

export type QuoteRange = { min: number; max: number };

function roundToNearest(value: number, step: number) {
  return Math.round(value / step) * step;
}

/** Always returns a range, never a false-precise single number. */
export function computeQuoteRange(selection: QuoteSelection): QuoteRange {
  const type = PROJECT_TYPES.find((t) => t.id === selection.projectType) ?? PROJECT_TYPES[0];
  const pages = Math.min(EXTRA_PAGES_MAX, Math.max(EXTRA_PAGES_MIN, selection.extraPages));

  let min = type.base.min + pages * EXTRA_PAGE_DELTA.min;
  let max = type.base.max + pages * EXTRA_PAGE_DELTA.max;

  for (const id of selection.addOns) {
    const addOn = ADD_ONS.find((a) => a.id === id);
    if (!addOn) continue;
    min += addOn.delta.min;
    max += addOn.delta.max;
  }

  const urgency = URGENCY_LEVELS.find((u) => u.id === selection.urgency) ?? URGENCY_LEVELS[0];
  min *= urgency.multiplier;
  max *= urgency.multiplier;

  const step = 500;
  return { min: roundToNearest(min, step), max: roundToNearest(max, step) };
}

/**
 * Deterministic manual formatting — Intl.NumberFormat("en-ZA") pulls ICU
 * locale data that differs between Node's SSR render and the browser's
 * built-in ICU, producing a comma on the client but a space on the server
 * (a hydration mismatch). Plain string math can't diverge between the two.
 */
export function formatZAR(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  const withThousands = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}R ${withThousands}`;
}
