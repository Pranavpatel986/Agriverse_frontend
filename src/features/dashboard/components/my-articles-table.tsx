"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { TableRowSkeleton } from "@/shared/components/feedback/skeletons";
import { useMyArticles, useUpdateArticleStatus } from "../hooks/use-dashboard";
import { useHasMinimumRole } from "@/features/auth/hooks/use-role";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import type { ArticleStatus } from "../types/dashboard.types";

const STATUS_STYLES: Record<ArticleStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  in_review: "bg-harvest-100 text-harvest-700",
  published: "bg-canopy-100 text-canopy-800",
  archived: "bg-loam-100 text-loam-700",
};

/**
 * Columns intentionally stop at Title/Status/Actions — the actual
 * AdminArticleSummaryResponse (confirmed against the real OpenAPI
 * schema) has no view count or updated-at field at all, unlike a
 * typical CMS table. Add those columns back once the backend actually
 * returns them; showing a permanent "—" for data that will never arrive
 * is worse than not showing the column.
 */
export function MyArticlesTable({
  statusFilter,
}: {
  statusFilter: ArticleStatus | "all";
}) {
  const { data, isLoading, isError, refetch } = useMyArticles(
    statusFilter === "all" ? {} : { status: statusFilter },
  );
  const updateStatus = useUpdateArticleStatus();
  // Publishing out of review is a reviewer action, not an author one —
  // an AUTHOR submitting their own article for review must not be able
  // to immediately self-approve it here, which is what showing this
  // button unconditionally would let them do. EDITOR/ADMIN get it as a
  // quick shortcut; the full review flow with feedback still lives at
  // /admin → Articles for anyone who wants to leave a note first.
  const canReview = useHasMinimumRole("EDITOR");

  if (isError) {
    return (
      <ErrorState description="Couldn't load your articles." onRetry={() => refetch()} />
    );
  }

  if (!isLoading && data?.content.length === 0) {
    return (
      <EmptyState
        title="No articles here yet"
        description="Articles you submit for review will appear in this list."
      />
    );
  }

  return (
    <div className="border-border rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }, (_, i) => (
                <TableRowSkeleton key={i} columns={3} />
              ))
            : data?.content.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-xs truncate font-medium">
                    {article.title}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_STYLES[article.status]} variant="secondary">
                      {article.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {(article.status === "draft" || article.status === "in_review") && (
                      <Button size="sm" variant="ghost" asChild className="mr-2">
                        <Link href={`${ROUTES.dashboard}/articles/${article.id}/edit`}>Edit</Link>
                      </Button>
                    )}
                    {article.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updateStatus.isPending}
                        onClick={() =>
                          updateStatus.mutate({
                            articleId: article.id,
                            payload: { status: "in_review" },
                          })
                        }
                      >
                        Submit for review
                      </Button>
                    )}
                    {article.status === "in_review" && canReview && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              articleId: article.id,
                              payload: { status: "published" },
                            })
                          }
                        >
                          Publish
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-clay-100"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({
                              articleId: article.id,
                              payload: { status: "draft" },
                            })
                          }
                        >
                          Send back to draft
                        </Button>
                      </div>
                    )}
                    {article.status === "published" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updateStatus.isPending}
                        onClick={() =>
                          updateStatus.mutate({
                            articleId: article.id,
                            payload: { status: "archived" },
                          })
                        }
                      >
                        Archive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
