"use client";

import { useArticleRecommendations } from "@/features/articles/hooks/use-recommendations";
import { RecommendationCard } from "./recommendation-card";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function RelatedArticlesRail({ articleId }: { articleId: string }) {
  const { data, isLoading, isError, refetch } = useArticleRecommendations(articleId, 5);

  if (!isLoading && !isError && data?.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="space-y-4">
      <h2 id="related-heading" className="font-display text-xl font-semibold">
        Related articles
      </h2>

      {isError && (
        <ErrorState
          variant="inline"
          description="Couldn't load related articles."
          onRetry={() => refetch()}
        />
      )}

      {!isError && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))
            : data?.map((article) => (
                <RecommendationCard key={article.id} article={article} />
              ))}
        </div>
      )}
    </section>
  );
}
