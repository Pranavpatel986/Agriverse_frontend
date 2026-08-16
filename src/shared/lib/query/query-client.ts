import { QueryClient } from "@tanstack/react-query";
import { toAppError } from "@/shared/lib/api/error";

/**
 * One factory used both by the client Provider (browser singleton) and
 * by any server-side prefetching (a fresh instance per request, per the
 * TanStack Query SSR guidance) — see providers.tsx.
 *
 * Defaults reflect the Frontend Technical Specification's cross-cutting
 * standard ("all data fetching for personalized/dynamic content goes
 * through TanStack Query... consistent caching, retry, and
 * background-refetch behavior by default"):
 *  - staleTime > 0 so navigating back to a page already visited this
 *    session doesn't refetch instantly (important on constrained rural
 *    networks, per the Product Spec).
 *  - retry skips 4xx entirely (a 404/403 retrying is never useful) and
 *    caps 5xx/network retries at 2.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const appError = toAppError(error);
          if (appError.status >= 400 && appError.status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
