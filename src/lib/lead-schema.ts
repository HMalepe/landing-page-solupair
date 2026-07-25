import { z } from "zod";
import { BUDGET_OPTIONS } from "@/lib/site";

/** The hero eyebrow's four capabilities — reused as the lead form's "what do you need" tags. */
export const CAPABILITY_NEEDS = ["WhatsApp", "Automation", "Websites", "Dashboards"] as const;
export type CapabilityNeed = (typeof CAPABILITY_NEEDS)[number];

const EMAIL_RE = /\S+@\S+\.\S+/;
const PHONE_RE = /\+?\d[\d\s-]{6,}/;

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  business: z.string().trim().min(2, "Enter your business name."),
  needs: z.array(z.enum(CAPABILITY_NEEDS)).min(1, "Pick at least one."),
  budgetBand: z.enum(BUDGET_OPTIONS, { message: "Pick a budget band." }),
  contact: z
    .string()
    .trim()
    .min(5, "Enter an email or phone number.")
    .refine(
      (value) => EMAIL_RE.test(value) || PHONE_RE.test(value),
      "Enter a valid email or phone number.",
    ),
  // Honeypot — hidden from real visitors; any value here means a bot filled it in.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const LEAD_FORM_DEFAULTS: LeadFormValues = {
  name: "",
  business: "",
  needs: [],
  budgetBand: BUDGET_OPTIONS[0],
  contact: "",
  website: "",
};
