"use client";

import { ArticleForm } from "./article-form";
import { useArticleForEdit } from "../hooks/use-articles";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/feedback/error-state";

export function EditArticleForm({ id }: { id: string }) {
  const { data: article, isLoading, isError, refetch } = useArticleForEdit(id);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-display mb-6 text-2xl font-semibold">Edit article</h1>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError || !article ? (
        <ErrorState
          description="Couldn't load this article — it may not exist, or you may not have permission to edit it."
          onRetry={() => refetch()}
        />
      ) : (
        <ArticleForm key={article.id} editing={article} />
      )}
    </div>
  );
}
