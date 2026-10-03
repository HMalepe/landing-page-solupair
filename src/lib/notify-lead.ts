import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CAPABILITY_NEEDS } from "@/lib/lead-schema";
import {
  ADD_ONS,
  PROJECT_TYPES,
  URGENCY_LEVELS,
  formatZAR,
  type AddOnId,
  type ProjectTypeId,
  type UrgencyId,
} from "@/lib/quote-config";
import { BUDGET_OPTIONS, CONTACT_EMAIL } from "@/lib/site";

const PROJECT_TYPE_IDS = PROJECT_TYPES.map((type) => type.id) as [
  ProjectTypeId,
  ...ProjectTypeId[],
];
const ADD_ON_IDS = ADD_ONS.map((addOn) => addOn.id) as [AddOnId, ...AddOnId[]];
const URGENCY_IDS = URGENCY_LEVELS.map((level) => level.id) as [UrgencyId, ...UrgencyId[]];

const leadEmailSchema = z.object({
  name: z.string().trim().min(2).max(120),
  business: z.string().trim().min(2).max(160),
  needs: z.array(z.enum(CAPABILITY_NEEDS)).min(1).max(CAPABILITY_NEEDS.length),
  budgetBand: z.enum(BUDGET_OPTIONS),
  contact: z.string().trim().min(5).max(160),
  website: z.string().max(200).optional(),
  quote: z
    .object({
      projectType: z.enum(PROJECT_TYPE_IDS),
      extraPages: z.number().int().min(0).max(10),
      addOns: z.array(z.enum(ADD_ON_IDS)).max(ADD_ON_IDS.length),
      urgency: z.enum(URGENCY_IDS),
      rangeMin: z.number().int().min(0).max(10_000_000),
      rangeMax: z.number().int().min(0).max(10_000_000),
    })
    .nullable(),
});

type LeadEmail = z.infer<typeof leadEmailSchema>;

function singleLine(value: string, max = 180) {
  return value.replace(/[\r\n\u0000]/g, " ").trim().slice(0, max);
}

function labelFor<T extends { id: string; label: string }>(items: readonly T[], id: string) {
  return items.find((item) => item.id === id)?.label ?? id;
}

function enquiryText(lead: LeadEmail) {
  const lines = [
    "New enquiry from the Solupair website",
    "",
    `Name: ${lead.name}`,
    `Business: ${lead.business}`,
    `What they need: ${lead.needs.join(", ")}`,
    `Budget: ${lead.budgetBand}`,
    `Contact: ${lead.contact}`,
  ];

  if (lead.quote) {
    const urgency = URGENCY_LEVELS.find((level) => level.id === lead.quote?.urgency);
    const addOns =
      lead.quote.addOns.length > 0
        ? lead.quote.addOns.map((id) => labelFor(ADD_ONS, id)).join(", ")
        : "None";
    lines.push(
      "",
      "Quote on the pricing page",
      `Project: ${labelFor(PROJECT_TYPES, lead.quote.projectType)}`,
      `Extra pages: ${lead.quote.extraPages}`,
      `Add-ons: ${addOns}`,
      `Timing: ${urgency ? `${urgency.label} (${urgency.description})` : lead.quote.urgency}`,
      `Estimate: ${formatZAR(lead.quote.rangeMin)} – ${formatZAR(lead.quote.rangeMax)}`,
    );
  }

  return lines.join("\n");
}

async function deliverLeadEmail(lead: LeadEmail) {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  if (!user || !pass) {
    throw new Error("Mailbox delivery is not configured.");
  }

  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.contact) ? lead.contact : undefined;

  await transport.sendMail({
    from: `Solupair website <${user}>`,
    to: CONTACT_EMAIL,
    replyTo,
    subject: singleLine(`New enquiry from ${lead.name} — ${lead.business}`, 140),
    text: enquiryText(lead),
  });
}

export const notifyLead = createServerFn({ method: "POST" })
  .validator(leadEmailSchema)
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };

    try {
      await deliverLeadEmail(data);
    } catch (error) {
      console.error("Lead email failed", error);
      throw new Error("Could not deliver the enquiry email.");
    }

    return { ok: true as const };
  });
