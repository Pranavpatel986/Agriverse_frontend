"use client";

import { useState } from "react";
import { useArticles } from "@/features/articles/hooks/use-articles";
import { ArticleCard } from "@/shared/components/composite/article-card";
import { Pagination } from "@/shared/components/composite/pagination";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import type { PaginatedResponse } from "@/shared/types/api";
import type { ArticleSummary } from "@/features/articles/types/article.types";

interface CategoryArticleListProps {
  categorySlug: string;
  /** Page 0, fetched server-side at build/revalidation time — rendered
   *  directly here so we don't refetch what SSG already produced. */
  initialPage: PaginatedResponse<ArticleSummary>;
}

export function CategoryArticleList({
  categorySlug,
  initialPage,
}: CategoryArticleListProps) {
  const [page, setPage] = useState(0);
  const isFirstPage = page === 0;

  const query = useArticles({ categorySlug, page, size: 12 }, { enabled: !isFirstPage });
  const data = isFirstPage ? initialPage : query.data;
  const isLoading = !isFirstPage && query.isLoading;
  const isError = !isFirstPage && query.isError;

  if (data?.content.length === 0 && isFirstPage) {
    return (
      <EmptyState
        title="No articles published in this category yet"
        description="Check back soon, or browse a related category."
      />
    );
  }

  return (
    <div className="space-y-6">
      {isError ? (
        <ErrorState
          onRetry={() => query.refetch()}
          description="Couldn't load this page."
        />
      ) : isLoading ? (
        <CardGridSkeleton count={12} className="sm:grid-cols-2 lg:grid-cols-3" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.content.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {data && (
        <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
