import { lookup } from "node:dns";
import type { LookupFunction } from "node:dns";
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
  // Why the browser could not save this lead to the database, if it could not.
  saveError: z.string().max(300).optional(),
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
  return value
    .replace(/[\r\n\u0000]/g, " ")
    .trim()
    .slice(0, max);
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

  if (lead.saveError) {
    lines.push(
      "",
      `Note: this enquiry was not saved to the database (${singleLine(lead.saveError, 300)}).`,
    );
  }

  return lines.join("\n");
}

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim().replace(/^['"]|['"]$/g, "") : "";
}

const ipv4Lookup: LookupFunction = (hostname, options, callback) => {
  if (typeof options === "function") {
    lookup(hostname, { family: 4 }, options);
    return;
  }
  lookup(hostname, { ...options, family: 4 }, callback);
};

function deliveryReason(error: unknown) {
  if (!error || typeof error !== "object") return "smtp";
  const failure = error as { code?: unknown; responseCode?: unknown };
  if (failure.code === "NOT_CONFIGURED") return "not-configured";
  if (failure.code === "EAUTH" || failure.responseCode === 535 || failure.responseCode === 534) {
    return "auth";
  }
  if (failure.responseCode === 553 || failure.responseCode === 550) return "sender";
  if (typeof failure.code === "string" && /^[A-Z0-9_]{2,24}$/.test(failure.code)) {
    return failure.code.toLowerCase();
  }
  if (typeof failure.responseCode === "number") return String(failure.responseCode);
  return "smtp";
}

async function deliverLeadEmail(lead: LeadEmail) {
  const user = readEnv("ZOHO_SMTP_USER");
  // Zoho shows app passwords in groups of four. The spaces are not part of the password.
  const pass = readEnv("ZOHO_SMTP_PASS").replace(/\s+/g, "");
  if (!user || !pass) {
    throw Object.assign(new Error("Mailbox delivery is not configured."), {
      code: "NOT_CONFIGURED",
    });
  }

  const nodemailer = await import("nodemailer");
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.contact) ? lead.contact : undefined;
  const message = {
    from: `Solupair website <${user}>`,
    to: CONTACT_EMAIL,
    replyTo,
    subject: singleLine(`New enquiry from ${lead.name} — ${lead.business}`, 140),
    text: enquiryText(lead),
  };
  const attempts = [
    { port: 465, secure: true },
    { port: 587, secure: false },
  ];

  let lastError: unknown;
  for (const attempt of attempts) {
    const transport = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: attempt.port,
      secure: attempt.secure,
      requireTLS: !attempt.secure,
      auth: { user, pass },
      lookup: ipv4Lookup,
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 12_000,
    });
    try {
      await transport.sendMail(message);
      return;
    } catch (error) {
      lastError = error;
      const reason = deliveryReason(error);
      if (reason === "auth" || reason === "sender") break;
    } finally {
      transport.close();
    }
  }

  throw lastError;
}

export const notifyLead = createServerFn({ method: "POST" })
  .validator(leadEmailSchema)
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };
    if (data.saveError) console.error("Lead save failed in the browser:", data.saveError);

    try {
      await deliverLeadEmail(data);
    } catch (error) {
      console.error("Lead email failed", error);
      throw new Error(`Could not deliver the enquiry email. (${deliveryReason(error)})`);
    }

    return { ok: true as const };
  });
