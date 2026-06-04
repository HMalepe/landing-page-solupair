import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/brand/Cursor";
import { Toaster } from "@/components/ui/sonner";
import { LEGAL_NAME, SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">404 · signal lost</p>
        <h1 className="mt-4 font-display text-7xl tracking-tight">Off-grid.</h1>
        <p className="mt-4 text-muted-foreground">
          That route never made it through QA. Let's get you somewhere real.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-cyan px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-cyan btn-fill"
        >
          Return to {SITE_NAME} →
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${LEGAL_NAME} — ${SITE_TAGLINE}` },
      {
        name: "description",
        content: `${LEGAL_NAME} — ${SITE_TAGLINE} Product UI/UX, brand systems, landing pages, e-commerce and internal tools.`,
      },
      { name: "theme-color", content: "#0A0814" },
      { property: "og:title", content: `${LEGAL_NAME} — ${SITE_TAGLINE}` },
      {
        property: "og:description",
        content: `${LEGAL_NAME} — Product UI/UX, brand systems, landing pages, e-commerce and internal tools.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/") },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Cursor />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <Toaster theme="dark" />
    </>
  );
}
