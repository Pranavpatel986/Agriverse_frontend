import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { ArticleSummary, RecommendedArticle } from "../types/article.types";

export const recommendationService = {
  forCurrentUser: (limit = 10) =>
    apiClient
      .get<{ content: RecommendedArticle[] }>(endpoints.recommendations.forCurrentUser, {
        params: { limit },
      })
      .then((res) => res.data.content),

  forArticle: (articleId: string, limit = 5) =>
    apiClient
      .get<{ content: ArticleSummary[] }>(
        endpoints.recommendations.forArticle(articleId),
        {
          params: { limit },
        },
      )
      .then((res) => res.data.content),
};
