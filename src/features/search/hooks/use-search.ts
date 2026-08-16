import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import { searchService } from "../api/search.service";
import type { SearchParams } from "../types/search.types";

/** Full search-results-page query — only fires once `q` is non-empty. */
export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.search.query(params),
    queryFn: () => searchService.query(params),
    enabled: params.q.trim().length > 0,
    placeholderData: (previousData) => previousData, // keep old results visible during refetch
  });
}

/** Autocomplete suggestions — caller is expected to pass an already
 *  debounced `q` (see useDebouncedValue), and short min-length gating
 *  avoids firing on a single keystroke. */
export function useAutocomplete(q: string) {
  return useQuery({
    queryKey: ["search", "autocomplete", q],
    queryFn: () => searchService.autocomplete(q),
    enabled: q.trim().length >= 2,
    staleTime: 30 * 1000,
  });
}

export function useTrendingSearches(limit = 10) {
  return useQuery({
    queryKey: queryKeys.search.trending(limit),
    queryFn: () => searchService.trending(limit),
    staleTime: 5 * 60 * 1000,
  });
}
