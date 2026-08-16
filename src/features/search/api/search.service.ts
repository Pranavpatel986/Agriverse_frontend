import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type {
  AutocompleteSuggestion,
  SearchParams,
  SearchResponse,
  TrendingTerm,
} from "../types/search.types";

export const searchService = {
  query: (params: SearchParams) =>
    apiClient
      .get<SearchResponse>(endpoints.search.query, { params })
      .then((res) => res.data),

  autocomplete: (q: string) =>
    apiClient
      .get<{ suggestions: AutocompleteSuggestion[] }>(endpoints.search.autocomplete, {
        params: { q },
      })
      .then((res) => res.data.suggestions),

  trending: (limit = 10) =>
    apiClient
      .get<{ terms: TrendingTerm[] }>(endpoints.search.trending, { params: { limit } })
      .then((res) => res.data.terms),
};
