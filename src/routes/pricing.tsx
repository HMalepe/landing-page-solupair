import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QuoteBuilderSection } from "@/components/quote-builder-section";
import { RouteLoadingSkeleton } from "@/components/route-loading-skeleton";
import { SiteHeader } from "@/components/site-header";
import type { LeadFormQuotePrefill } from "@/components/lead-form";
import { PENDING_QUOTE_STORAGE_KEY } from "@/lib/quote-config";
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
  const navigate = useNavigate();

  const lockQuote = (quote: LeadFormQuotePrefill) => {
    sessionStorage.setItem(PENDING_QUOTE_STORAGE_KEY, JSON.stringify(quote));
    void navigate({ to: "/", hash: "contact" });
  };

  return (
    <main className="pricing-page min-h-[100dvh] bg-background font-sans text-foreground">
      <div className="relative isolate min-h-[100dvh] overflow-x-clip">
        <SiteHeader sticky />
        <QuoteBuilderSection onLockQuote={lockQuote} />
      </div>
    </main>
  );
}
