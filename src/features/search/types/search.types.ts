import type { ArticleCategoryRef } from "@/features/articles/types/article.types";
import type { PublicId } from "@/shared/types/api";

export interface SearchResultItem {
  id: PublicId;
  title: string;
  slug: string;
  excerpt: string;
  highlightedSnippet: string;
  category: ArticleCategoryRef;
}

export interface SearchResponse {
  content: SearchResultItem[];
  totalElements: number;
  tookMs: number;
}

export interface SearchParams {
  q: string;
  category?: string;
  page?: number;
  size?: number;
}

export type AutocompleteSuggestionType = "article" | "category" | "tag";

export interface AutocompleteSuggestion {
  text: string;
  type: AutocompleteSuggestionType;
}

export interface TrendingTerm {
  term: string;
  searchCount: number;
}
