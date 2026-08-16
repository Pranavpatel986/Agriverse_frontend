import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import { recommendationService } from "../api/recommendation.service";
import { useCurrentUser } from "@/features/auth/hooks/use-role";

/** Home's RecommendationRail — client-side, authenticated users only per
 *  the spec, so the query is disabled entirely for logged-out visitors
 *  rather than firing a request that will 401. */
export function useRecommendations(limit = 10) {
  const { isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: queryKeys.recommendations.forCurrentUser(limit),
    queryFn: () => recommendationService.forCurrentUser(limit),
    enabled: isAuthenticated,
  });
}

/** Article's RelatedArticlesRail — public, anchored to one article. */
export function useArticleRecommendations(articleId: string, limit = 5) {
  return useQuery({
    queryKey: queryKeys.recommendations.forArticle(articleId, limit),
    queryFn: () => recommendationService.forArticle(articleId, limit),
    enabled: Boolean(articleId),
  });
}
