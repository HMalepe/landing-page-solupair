import type { BuildIllustrationId } from "@/components/build-illustrations";

export type BuildCategory = {
  id: BuildIllustrationId;
  label: string;
  summary: string;
  solutions: readonly string[];
};

/** What we typically build, by sector. */
export const BUILD_CATEGORIES: readonly BuildCategory[] = [
  {
    id: "salons",
    label: "Salons & barbers",
    summary: "Booking-heavy teams juggling WhatsApp enquiries, walk-ins and stylist schedules.",
    solutions: [
      "WhatsApp booking and menu flows",
      "Owner dashboard for appointments and clients",
      "Automated reminders and follow-ups",
      "Optional loyalty or rebooking nudges",
    ],
  },
  {
    id: "clinics",
    label: "Clinics & pharmacies",
    summary: "Practices that need clearer appointment handling without replacing clinical systems.",
    solutions: [
      "Patient enquiry and booking capture",
      "Reminder and recall automations",
      "Simple admin dashboards",
      "Forms and consent-friendly flows",
    ],
  },
  {
    id: "restaurants",
    label: "Restaurants & takeaways",
    summary: "Food businesses tired of missed calls, scattered orders and manual specials lists.",
    solutions: [
      "Menu-led landing pages or ordering enquiry flows",
      "WhatsApp order capture and FAQs",
      "Daily specials or hours updates",
      "Light reporting for busy periods",
    ],
  },
  {
    id: "services",
    label: "Service businesses",
    summary: "Plumbers, cleaners, installers and similar teams quoting and scheduling on the fly.",
    solutions: [
      "Enquiry forms tied to job pipelines",
      "Quote request and follow-up automations",
      "Field-friendly mobile dashboards",
      "Customer status updates via WhatsApp or email",
    ],
  },
  {
    id: "retail",
    label: "Retail teams",
    summary: "Shops balancing stock questions, orders and staff coordination across channels.",
    solutions: [
      "Product enquiry and catalogue pages",
      "Order or stock-request workflows",
      "Staff-facing admin views",
      "Customer follow-up after purchase",
    ],
  },
] as const;

export const BUILD_CATEGORY_INTRO = {
  heading: "Built for businesses where admin costs money",
  body: "Missed messages, slow follow-ups, manual bookings and messy spreadsheets quietly drain time. Here's what we typically build by sector.",
};
