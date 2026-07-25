import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";
import { useSubmitRateLimit } from "@/hooks/use-submit-rate-limit";
import {
  CAPABILITY_NEEDS,
  LEAD_FORM_DEFAULTS,
  leadFormSchema,
  type CapabilityNeed,
  type LeadFormValues,
} from "@/lib/lead-schema";
import { BUDGET_OPTIONS, CONTACT_EMAIL } from "@/lib/site";
import { getUtmParams } from "@/lib/utm";
import {
  formatZAR,
  type ProjectTypeId,
  type QuoteRange,
  type QuoteSelection,
} from "@/lib/quote-config";
import type { Json } from "@/integrations/supabase/types";

export type LeadFormQuotePrefill = {
  selection: QuoteSelection;
  range: QuoteRange;
};

type LeadFormProps = {
  initialQuote?: LeadFormQuotePrefill;
  onSubmitted?: () => void;
};

function needsForProjectType(type: ProjectTypeId): CapabilityNeed[] {
  switch (type) {
    case "website":
      return ["Websites"];
    case "dashboard":
      return ["Dashboards"];
    case "whatsapp":
      return ["WhatsApp", "Automation"];
    case "internal-tool":
      return ["Automation", "Dashboards"];
    default:
      return [];
  }
}

export function LeadForm({ initialQuote, onSubmitted }: LeadFormProps) {
  const { checkAllowed, markSubmitted } = useSubmitRateLimit();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: LEAD_FORM_DEFAULTS,
  });

  useEffect(() => {
    if (!initialQuote) return;
    form.setValue("needs", needsForProjectType(initialQuote.selection.projectType));
  }, [initialQuote, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    // Honeypot tripped — silently drop, no feedback that would help a bot learn.
    if (values.website) return;

    const rate = checkAllowed();
    if (!rate.allowed) {
      toast.error(`Give it a few more seconds.`, {
        description: `Wait ${rate.waitSeconds}s and submit again.`,
      });
      return;
    }

    const utm = getUtmParams();

    // Wrapped: a misconfigured client throws synchronously (missing env vars),
    // a real network failure rejects — both must land on the same instructive
    // error copy instead of an uncaught exception.
    try {
      const { error } = await supabase.from("leads").insert({
        name: values.name,
        business: values.business,
        needs: values.needs,
        budget_band: values.budgetBand,
        contact: values.contact,
        quote_project_type: initialQuote?.selection.projectType ?? null,
        quote_config: initialQuote
          ? (JSON.parse(JSON.stringify(initialQuote.selection)) as Json)
          : null,
        quote_range_min: initialQuote?.range.min ?? null,
        quote_range_max: initialQuote?.range.max ?? null,
        utm_source: utm.utm_source ?? null,
        utm_medium: utm.utm_medium ?? null,
        utm_campaign: utm.utm_campaign ?? null,
        utm_term: utm.utm_term ?? null,
        utm_content: utm.utm_content ?? null,
      });

      if (error) throw error;

      markSubmitted();
      toast.success("Booked.", {
        description: "We'll call you back within 1–2 business days.",
      });
      form.reset(LEAD_FORM_DEFAULTS);
      onSubmitted?.();
    } catch {
      toast.error("That didn't send.", {
        description: `Check your connection and try again, or email us directly at ${CONTACT_EMAIL}.`,
      });
    }
  });

  const needs = form.watch("needs");
  const budgetBand = form.watch("budgetBand");
  const errors = form.formState.errors;

  return (
    <form onSubmit={onSubmit} className="contact-form" noValidate>
      {initialQuote && (
        <div className="contact-field">
          <p className="contact-field-label">Your quote</p>
          <p className="contact-form-reassurance !mt-1">
            {formatZAR(initialQuote.range.min)} – {formatZAR(initialQuote.range.max)} (estimate,
            confirmed on the call)
          </p>
        </div>
      )}

      <div className="contact-field">
        <label htmlFor="lead-name" className="contact-field-label">
          Your name
        </label>
        <Input
          id="lead-name"
          autoComplete="name"
          placeholder="Your name"
          className="contact-form-input mobile-input"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          {...form.register("name")}
        />
        {errors.name && (
          <p id="lead-name-error" role="alert" className="text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="lead-business" className="contact-field-label">
          Your business
        </label>
        <Input
          id="lead-business"
          autoComplete="organization"
          placeholder="Your business name"
          className="contact-form-input mobile-input"
          aria-invalid={!!errors.business}
          aria-describedby={errors.business ? "lead-business-error" : undefined}
          {...form.register("business")}
        />
        {errors.business && (
          <p id="lead-business-error" role="alert" className="text-xs text-destructive">
            {errors.business.message}
          </p>
        )}
      </div>

      <div className="contact-field">
        <p className="contact-field-label" id="lead-needs-label">
          What do you need?
        </p>
        <ToggleGroup
          type="multiple"
          value={needs}
          onValueChange={(value) =>
            form.setValue("needs", value as CapabilityNeed[], { shouldValidate: true })
          }
          className="!justify-start flex-wrap gap-2"
          aria-labelledby="lead-needs-label"
        >
          {CAPABILITY_NEEDS.map((need) => (
            <ToggleGroupItem
              key={need}
              value={need}
              variant="outline"
              className="rounded-full border-input px-4 data-[state=on]:border-accent data-[state=on]:bg-accent/15 data-[state=on]:text-accent-foreground"
            >
              {need}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {errors.needs && (
          <p role="alert" className="text-xs text-destructive">
            {errors.needs.message}
          </p>
        )}
      </div>

      <div className="contact-field">
        <p className="contact-field-label" id="lead-budget-label">
          Rough budget
        </p>
        <ToggleGroup
          type="single"
          value={budgetBand}
          onValueChange={(value) => {
            if (value)
              form.setValue("budgetBand", value as LeadFormValues["budgetBand"], {
                shouldValidate: true,
              });
          }}
          className="!justify-start flex-wrap gap-2"
          aria-labelledby="lead-budget-label"
        >
          {BUDGET_OPTIONS.map((band) => (
            <ToggleGroupItem
              key={band}
              value={band}
              variant="outline"
              className="rounded-full border-input px-4 data-[state=on]:border-accent data-[state=on]:bg-accent/15 data-[state=on]:text-accent-foreground"
            >
              {band}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {errors.budgetBand && (
          <p role="alert" className="text-xs text-destructive">
            {errors.budgetBand.message}
          </p>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="lead-contact" className="contact-field-label">
          Email or phone
        </label>
        <Input
          id="lead-contact"
          autoComplete="email"
          placeholder="you@business.co.za"
          className="contact-form-input mobile-input"
          aria-invalid={!!errors.contact}
          aria-describedby={errors.contact ? "lead-contact-error" : undefined}
          {...form.register("contact")}
        />
        {errors.contact && (
          <p id="lead-contact-error" role="alert" className="text-xs text-destructive">
            {errors.contact.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from real visitors and screen readers, left empty by humans. */}
      <div
        className="pointer-events-none absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="lead-website">Leave this field empty</label>
        <input
          id="lead-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...form.register("website")}
        />
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="contact-submit-btn hero-btn hero-btn--primary touch-target disabled:opacity-60"
      >
        <span>{form.formState.isSubmitting ? "Booking…" : "Book a call"}</span>
      </button>

      <p className="contact-form-reassurance">
        No spam — we reply within 1–2 business days with scope and a starting price range.
      </p>
    </form>
  );
}
