import { createFileRoute } from "@tanstack/react-router";
import { WhatWeBuildPageContent } from "@/components/what-we-build-page";
import { WhatWeBuildRouteSkeleton } from "@/components/route-loading-skeleton";
import { SiteHeader } from "@/components/site-header";
import { LEGAL_NAME, pageHead } from "@/lib/site";

export const Route = createFileRoute("/what-we-build")({
  component: WhatWeBuildPage,
  pendingComponent: WhatWeBuildRouteSkeleton,
  pendingMs: 0,
  // Ensures the pending skeleton can engage during the route transition.
  loader: async () => null,
  head: () =>
    pageHead({
      title: `What We Build — ${LEGAL_NAME}`,
      description:
        "Websites, dashboards and WhatsApp automation for South African SME owners — by business type and project shape. Every build starts with a conversation.",
      path: "/what-we-build",
    }),
});

function WhatWeBuildPage() {
  return (
    <main className="build-page min-h-[100dvh] bg-background font-sans text-foreground">
      <div className="build-direction build-page-shell relative isolate min-h-[100dvh] overflow-x-clip">
        <div className="build-direction-glow build-direction-glow--left" aria-hidden />
        <div className="build-direction-glow build-direction-glow--right" aria-hidden />
        <SiteHeader sticky />
        <WhatWeBuildPageContent />
      </div>
    </main>
  );
}
