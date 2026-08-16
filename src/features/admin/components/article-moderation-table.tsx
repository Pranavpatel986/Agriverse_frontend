"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { TableRowSkeleton } from "@/shared/components/feedback/skeletons";
import { useArticlesInReview, useReviewArticle } from "../hooks/use-admin";

export function ArticleModerationTable() {
  const { data, isLoading, isError, refetch } = useArticlesInReview();
  const reviewArticle = useReviewArticle();
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [pendingRowId, setPendingRowId] = useState<string | null>(null);

  function handleReview(articleId: string, decision: "approve" | "reject") {
    setRowErrors((prev) => ({ ...prev, [articleId]: "" }));
    setPendingRowId(articleId);
    reviewArticle.mutate(
      {
        articleId,
        payload: { decision, feedback: feedbackDrafts[articleId] || undefined },
      },
      {
        onError: (error) =>
          setRowErrors((prev) => ({ ...prev, [articleId]: error.message })),
        onSettled: () => setPendingRowId(null),
      },
    );
  }

  if (isError) {
    return (
      <ErrorState
        description="Couldn't load the review queue."
        onRetry={() => refetch()}
      />
    );
  }

  if (!isLoading && data?.content.length === 0) {
    return (
      <EmptyState
        title="All caught up"
        description="No articles are waiting for review right now."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Feedback (optional)</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <TableRowSkeleton key={i} columns={4} />)
          : data?.content.map((article) => {
              const isRowPending = pendingRowId === article.id && reviewArticle.isPending;
              return (
                <TableRow key={article.id}>
                  <TableCell className="max-w-xs font-medium">{article.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {article.author.displayName}
                  </TableCell>
                  <TableCell>
                    <Textarea
                      rows={1}
                      placeholder="Optional note to the author…"
                      value={feedbackDrafts[article.id] ?? ""}
                      onChange={(e) =>
                        setFeedbackDrafts((prev) => ({
                          ...prev,
                          [article.id]: e.target.value,
                        }))
                      }
                      className="min-h-9"
                    />
                    {rowErrors[article.id] && (
                      <p className="text-destructive mt-1 text-xs">
                        {rowErrors[article.id]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isRowPending}
                        aria-label={`Approve article: ${article.title}`}
                        onClick={() => handleReview(article.id, "approve")}
                      >
                        {isRowPending && <Loader2Icon className="animate-spin" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-clay-100"
                        disabled={isRowPending}
                        aria-label={`Reject article: ${article.title}`}
                        onClick={() => handleReview(article.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
      </TableBody>
    </Table>
  );
}
