// Every route in this app is fully static — no route loader fetches
// per-request or per-user data (see src/routes/*.tsx: every `loader`
// returns `null`). Without any caching, Vercel invokes the serverless
// function fresh for every single visit to every page, paying a render
// (and sometimes a cold start) each time. Since the HTML is identical for
// every visitor, let Vercel's edge cache serve it directly after the first
// request in a given window — the origin only gets hit again once the
// cache expires or is revalidated in the background.
//
// Vercel strips s-maxage/stale-while-revalidate before the response reaches
// the browser (visitors see just `cache-control: public`); check
// `x-vercel-cache: HIT` on a repeat request to confirm it's working.
const STATIC_PAGE_CACHE = {
  headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" },
};

export default {
  routeRules: {
    "/": STATIC_PAGE_CACHE,
    "/pricing": STATIC_PAGE_CACHE,
    "/privacy": STATIC_PAGE_CACHE,
    "/terms": STATIC_PAGE_CACHE,
    "/what-we-build": STATIC_PAGE_CACHE,
  },
};
