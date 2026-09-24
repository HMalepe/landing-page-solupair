import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { RouteLoadingSkeleton } from "@/components/route-loading-skeleton";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 30_000,
    defaultPendingComponent: RouteLoadingSkeleton,
    // Fast navigations stay instant. The skeleton only appears if a route is actually slow.
    defaultPendingMs: 200,
    defaultPendingMinMs: 0,
  });

  return router;
};
