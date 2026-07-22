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
    // Show the skeleton immediately — never sit on a blank document.
    defaultPendingMs: 0,
    defaultPendingMinMs: 180,
  });

  return router;
};
