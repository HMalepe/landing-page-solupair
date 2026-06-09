import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/brand/Reveal";
import { NatureImage } from "@/components/brand/NatureImage";
import { IMAGES } from "@/lib/images";
import {
  BUDGET_OPTIONS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
  CURRENCY,
  LEGAL_NAME,
  LOCATION_LABEL,
  pageHead,
} from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () =>
    pageHead({
      title: `Contact — ${LEGAL_NAME}`,
      description: `Contact ${LEGAL_NAME}. Tell us what you're shipping — we respond in 24 hours.`,
      path: "/contact",
    }),
});

const SCOPES = ["Product UI / UX", "Brand system", "Landing page", "E-commerce", "Internal tools", "Design-engineering", "AI surface", "Something else"];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [scope, setScope] = useState<string>(SCOPES[0]);
  const [budget, setBudget] = useState<string>(BUDGET_OPTIONS[0]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setSubmitted(true);
      toast.success("Brief received. We'll respond within 24 hours.");
    }, 700);
  };

  return (
    <div className="relative pb-32">
      <section className="relative min-h-[40vh] overflow-hidden pt-24">
        <NatureImage
          src={IMAGES.team}
          alt="Team collaborating in a bright space"
          className="absolute inset-0 h-full w-full"
          overlay="dark"
          priority
        />
        <header className="relative mx-auto max-w-[1100px] px-6 pb-8 pt-32">
          <p className="text-sm font-medium text-sage">Contact</p>
          <h1 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.08] tracking-tight">
            Tell us what you're{" "}
            <span className="font-serif italic gradient-nature-text">building.</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-sage">{LEGAL_NAME}</p>
        </header>
      </section>

      <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 gap-16 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="max-w-md text-muted-foreground">
            Five fields. Written response in 24 hours from {LEGAL_NAME} — and if we're not the right fit, we'll say who is.
          </p>

          <div className="mt-12 space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Direct line</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block font-display text-xl tracking-tight transition-colors hover:text-sage">{CONTACT_EMAIL}</a>
              <a href={`tel:${CONTACT_PHONE}`} className="mt-3 block font-display text-xl tracking-tight transition-colors hover:text-sage">{CONTACT_PHONE_DISPLAY}</a>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{LEGAL_NAME}</p>
              <p className="mt-1 text-foreground/90">{LOCATION_LABEL}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Availability</p>
              <p className="mt-1 flex items-center gap-2 text-foreground/90">
                <span className="h-2 w-2 rounded-full bg-sage pulse-dot" />
                Open for new briefs · 2 slots
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <div className="relative rounded-2xl border border-border bg-surface/60 p-6 md:p-10">
              {submitted ? (
                <div className="py-16 text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sage/15 text-sage text-2xl">✓</span>
                  <h3 className="mt-6 font-display text-3xl tracking-tight">Message received.</h3>
                  <p className="mt-3 text-muted-foreground">We'll be back within 24 hours.</p>
                  <Link to="/work" className="mt-8 inline-flex text-sm font-medium text-sage hover:underline">
                    Meanwhile, browse the work →
                  </Link>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Your name" name="name" placeholder="Thabo Molefe" required />
                    <Field label="Email" name="email" type="email" placeholder="you@startup.co.za" required />
                  </div>
                  <Field label="Company" name="company" placeholder="Your Startup (Pty) Ltd" required />

                  <div>
                    <Label>Scope</Label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {SCOPES.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setScope(s)}
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                            scope === s ? "border-sage bg-sage/15 text-sage" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          }`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Budget ({CURRENCY})</Label>
                    <p className="mt-1 text-xs text-text-tertiary">Typical early-stage ranges · quotes ex. VAT where applicable</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {BUDGET_OPTIONS.map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                            budget === b ? "border-clay bg-clay/15 text-clay" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          }`}
                        >{b}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>The brief</Label>
                    <textarea
                      name="brief"
                      required
                      rows={5}
                      placeholder="What are you shipping? Where are you stuck? What does winning look like?"
                      className="mt-3 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-text-tertiary focus:border-sage focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="btn-nature-primary w-full justify-center disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Send brief"}
                  </button>
                  <p className="text-center text-xs text-text-tertiary">
                    POPIA respected · No marketing follow-ups · Promise
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{children}</p>;
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-text-tertiary focus:border-sage focus:outline-none"
      />
    </div>
  );
}
