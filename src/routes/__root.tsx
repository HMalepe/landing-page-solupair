import { Outlet, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LEGAL_NAME, SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-sage">404</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight">Page not found.</h1>
        <p className="mt-4 text-muted-foreground">
          That path doesn't exist. Let's get you back on solid ground.
        </p>
        <a href="/" className="btn-nature-primary mt-8 inline-flex">
          Return to {SITE_NAME}
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
      { name: "theme-color", content: "#050505" },
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
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap",
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
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <Navbar />}
      <main className={isHome ? "" : "min-h-screen"}>
        <Outlet />
      </main>
      {!isHome && <Footer />}
      <Toaster theme="dark" />
    </>
  );
}
