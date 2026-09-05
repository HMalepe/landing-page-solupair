// Every route in this app is fully static — no route loader fetches
// per-request or per-user data (see src/routes/*.tsx: every `loader`
// returns `null`). Without any caching, Vercel invokes the serverless
// function fresh for every single visit to every page, paying a render
// (and sometimes a cold start) each time. Since the HTML is identical for
// every visitor, let Vercel's edge cache serve it directly after the first
// request in a given window — the origin only gets hit again once the
// cache expires or is revalidated in the background.
//
// UNVERIFIED: this repo's nitro/@tanstack/react-start versions are pinned
// betas, and this change has not been confirmed to actually serve content
// (as opposed to a header-only empty response) end to end. Check the
// preview deployment for this branch in a real browser before merging —
// load "/", "/privacy", "/terms" and "/what-we-build" and confirm they
// render normally, then check response headers (e.g. via browser devtools
// Network tab) for "cache-control" and repeat the load to see it come from
// cache. Do not merge to main on CI green alone.
export default {
  routeRules: {
    "/": { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    "/privacy": {
      headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    },
    "/terms": {
      headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    },
    "/what-we-build": {
      headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    },
  },
};
