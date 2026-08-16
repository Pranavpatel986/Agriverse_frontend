"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-role";
import { useRecommendations } from "@/features/articles/hooks/use-recommendations";
import { RecommendationCard } from "./recommendation-card";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function RecommendationRail() {
  const { isAuthenticated } = useCurrentUser();
  const { data, isLoading, isError, refetch } = useRecommendations(6);

  if (!isAuthenticated) return null;

  return (
    <section aria-labelledby="recommendations-heading" className="space-y-4">
      <h2 id="recommendations-heading" className="font-display text-xl font-semibold">
        Picked for you
      </h2>

      {isError && (
        <ErrorState
          variant="inline"
          description="Couldn't load your recommendations."
          onRetry={() => refetch()}
        />
      )}

      {!isError && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))
            : data?.map((article) => (
                <RecommendationCard
                  key={article.id}
                  article={article}
                  reason={article.reason}
                />
              ))}
        </div>
      )}
    </section>
  );
}
