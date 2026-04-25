import { useState } from "react";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function NewsletterCTA({ source = "home" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("That doesn't look right. Try a real email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase(), source });
    setLoading(false);
    if (error && error.code !== "23505") {
      toast.error("Something failed. Try again.");
      return;
    }
    setDone(true);
  };

  return (
    <section
      className="relative isolate w-full overflow-hidden"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      <div className="grain" />
      <div className="relative mx-auto max-w-[900px] px-6 py-24 text-center md:py-32">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal">
          Shelf Life Wisdom · Newsletter
        </p>
        <h2
          className="mt-6 font-serif font-medium tracking-tight"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          Stay sharp. Zero fluff.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Weekly inventory insights for people who actually work the floor.
          One email. Five minutes. No marketing copy.
        </p>

        {done ? (
          <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 rounded-full border border-teal bg-teal/10 px-6 py-4 text-teal">
            <Check className="h-5 w-5" />
            <span className="font-mono text-[12px] uppercase tracking-wider">
              You're in. Know your shelf.
            </span>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@operation.com"
              className="flex-1 rounded-full border border-border bg-background/60 px-5 py-3 text-sm text-foreground placeholder:text-text-tertiary focus:border-teal focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-background transition-all hover:shadow-teal-glow disabled:opacity-60"
            >
              {loading ? "Joining…" : "Join Free"} <ArrowRight className="h-3 w-3" />
            </button>
          </form>
        )}

        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
          No spam. Just shelf wisdom.
        </p>
      </div>
    </section>
  );
}
