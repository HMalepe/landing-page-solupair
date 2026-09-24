import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LeadForm, type LeadFormQuotePrefill } from "@/components/lead-form";
import { QuoteBuilderSection } from "@/components/quote-builder-section";
import { RouteLoadingSkeleton } from "@/components/route-loading-skeleton";
import { SiteHeader } from "@/components/site-header";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  pendingComponent: RouteLoadingSkeleton,
  pendingMs: 0,
  loader: async () => null,
  head: () =>
    pageHead({
      title: "Pricing — Solupair",
      description:
        "Build a live ZAR estimate for a website, dashboard, WhatsApp automation or internal tool. Nothing locks in until the call.",
      path: "/pricing",
    }),
});

function PricingPage() {
  const [quote, setQuote] = useState<LeadFormQuotePrefill | undefined>();

  const lockQuote = (next: LeadFormQuotePrefill) => {
    setQuote(next);
    document.getElementById("pricing-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="pricing-page min-h-[100dvh] bg-background font-sans text-foreground">
      <div className="relative isolate min-h-[100dvh] overflow-x-clip">
        <SiteHeader sticky />
        <QuoteBuilderSection onLockQuote={lockQuote} />
        <section
          id="pricing-booking"
          className="pricing-booking safe-area-x px-4 pb-16 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24"
        >
          <div className="mx-auto w-full max-w-4xl">
            <LeadForm initialQuote={quote} />
          </div>
        </section>
      </div>
    </main>
  );
}
