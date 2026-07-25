import type { BuildIllustrationId } from "@/components/build-illustrations";

export type BuildTier = {
  id: BuildIllustrationId;
  title: string;
  description: string;
  includes: readonly string[];
  cta: string;
  featured: boolean;
};

/** The three shapes a build usually takes — no numbers, scoped after a call. */
export const BUILD_TIERS: readonly BuildTier[] = [
  {
    id: "website",
    title: "Starter Website",
    description: "A clean premium landing page for businesses that need a sharper online presence.",
    includes: [
      "Mobile-first landing page",
      "Contact or enquiry form",
      "Basic SEO structure",
      "Fast modern build",
    ],
    cta: "Book a call",
    featured: false,
  },
  {
    id: "system",
    title: "Business System",
    description:
      "Dashboards, booking flows and automations for teams that need smoother operations.",
    includes: [
      "Dashboard or workflow build",
      "WhatsApp/customer flow planning",
      "Forms and automations",
      "Admin-friendly structure",
    ],
    cta: "Book a call",
    featured: true,
  },
  {
    id: "custom",
    title: "Custom Operations Tool",
    description: "For businesses with a specific process, internal tool or multi-step workflow.",
    includes: [
      "Custom planning",
      "Data/workflow mapping",
      "Tailored interface",
      "Integration-ready structure",
    ],
    cta: "Book a call",
    featured: false,
  },
] as const;
