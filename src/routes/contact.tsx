import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/brand/Reveal";
import { CONTACT_EMAIL, pageHead } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () =>
    pageHead({
      title: "Contact — Solupair Studio",
      description: "Tell us what you're shipping. We respond in 24 hours with whether we're the right studio for it.",
      path: "/contact",
    }),
});

const BUDGETS = ["< $25k", "$25k – $75k", "$75k – $200k", "$200k+", "Not sure yet"];
const SCOPES = ["Product UI / UX", "Brand system", "Landing page", "E-commerce", "Internal tools", "Design-engineering", "AI surface", "Something else"];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [scope, setScope] = useState<string>(SCOPES[0]);
  const [budget, setBudget] = useState<string>(BUDGETS[1]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    // Simulate dispatch — wire to backend later
    setTimeout(() => {
      setPending(false);
      setSubmitted(true);
      toast.success("Brief received. We'll respond within 24 hours.");
    }, 700);
  };

  return (
    <div className="relative pt-32 pb-32">
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-grid opacity-[0.25]" />
      <div className="aurora-blob top-20 -left-20 h-[420px] w-[420px] bg-cyan/25" />
      <div className="aurora-blob top-40 right-0 h-[500px] w-[500px] bg-plasma/25" />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-16 px-6 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ contact / start ]</p>
          <h1 className="mt-4 headline-mega text-[clamp(2.8rem,7vw,6rem)]">
            Tell us<br />what<br />
            <span className="font-serif italic gradient-aurora-text">you're shipping.</span>
          </h1>
          <p className="mt-8 max-w-md text-muted-foreground">
            Five fields. Written response in 24 hours with whether we're the right studio — and if not, who is.
          </p>

          <div className="mt-12 space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Direct line</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block font-display text-2xl tracking-tight hover:gradient-aurora-text">{CONTACT_EMAIL}</a>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Studio</p>
              <p className="mt-1 text-foreground/90">San Francisco · Lisbon · Remote-first</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Booking window</p>
              <p className="mt-1 flex items-center gap-2 text-foreground/90">
                <span className="h-2 w-2 rounded-full bg-lime pulse-dot" />
                Q3 2026 · 2 slots open
              </p>
            </div>
          </div>
        </header>

        <div className="lg:col-span-7">
          <Reveal>
            <div className="relative rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-xl md:p-10">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan/5 via-transparent to-plasma/10 pointer-events-none" />

              {submitted ? (
                <div className="relative py-16 text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-lime/15 text-lime">●</span>
                  <h3 className="mt-6 font-display text-4xl tracking-tight">Signal received.</h3>
                  <p className="mt-3 text-muted-foreground">We'll be back within 24 hours.</p>
                  <Link to="/work" className="mt-8 inline-flex font-mono text-[11px] uppercase tracking-widest text-cyan">
                    Meanwhile, browse the work →
                  </Link>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="relative space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Your name" name="name" placeholder="Jane Operator" required />
                    <Field label="Email" name="email" type="email" placeholder="jane@company.com" required />
                  </div>
                  <Field label="Company" name="company" placeholder="Cobra Labs" required />

                  <div>
                    <Label>Scope</Label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {SCOPES.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setScope(s)}
                          className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                            scope === s ? "border-cyan bg-cyan/15 text-cyan" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          }`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Budget</Label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                            budget === b ? "border-plasma bg-plasma/15 text-plasma" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
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
                      className="mt-3 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-text-tertiary focus:border-cyan focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-cyan px-8 py-4 font-mono text-[11px] uppercase tracking-widest text-background shadow-glow-cyan transition-transform hover:scale-[1.01] disabled:opacity-60"
                  >
                    {pending ? "Transmitting…" : "Transmit brief →"}
                  </button>
                  <p className="text-center font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                    NDA on request · No marketing follow-ups · Promise
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
  return <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">{children}</p>;
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
        className="mt-3 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-text-tertiary focus:border-cyan focus:outline-none"
      />
    </div>
  );
}
