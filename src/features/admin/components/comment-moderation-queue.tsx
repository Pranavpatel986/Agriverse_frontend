"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { TableRowSkeleton } from "@/shared/components/feedback/skeletons";
import { useCommentQueue, useModerateComment } from "../hooks/use-admin";

export function CommentModerationQueue() {
  const { data, isLoading, isError, refetch } = useCommentQueue();
  const moderateComment = useModerateComment();
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [pendingRowId, setPendingRowId] = useState<string | null>(null);

  function handleModerate(commentId: string, action: "approve" | "remove") {
    setRowErrors((prev) => ({ ...prev, [commentId]: "" }));
    setPendingRowId(commentId);
    moderateComment.mutate(
      { commentId, payload: { action } },
      {
        onError: (error) =>
          setRowErrors((prev) => ({ ...prev, [commentId]: error.message })),
        onSettled: () => setPendingRowId(null),
      },
    );
  }

  if (isError) {
    return (
      <ErrorState
        description="Couldn't load the comment queue."
        onRetry={() => refetch()}
      />
    );
  }

  if (!isLoading && data?.content.length === 0) {
    return (
      <EmptyState
        title="All caught up"
        description="No comments are flagged for review."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Comment</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Flag reason</TableHead>
          <TableHead>Posted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <TableRowSkeleton key={i} columns={5} />)
          : data?.content.map((item) => {
              const isRowPending = pendingRowId === item.id && moderateComment.isPending;
              return (
                <TableRow key={item.id}>
                  <TableCell className="max-w-sm">
                    <p className="line-clamp-2 text-sm">{item.body}</p>
                    {rowErrors[item.id] && (
                      <p className="text-destructive mt-1 text-xs">
                        {rowErrors[item.id]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.user.displayName}
                  </TableCell>
                  <TableCell>
                    {item.flagReason && (
                      <Badge variant="secondary">{item.flagReason}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isRowPending}
                        aria-label="Approve this comment"
                        onClick={() => handleModerate(item.id, "approve")}
                      >
                        {isRowPending && <Loader2Icon className="animate-spin" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-clay-100"
                        disabled={isRowPending}
                        aria-label="Remove this comment"
                        onClick={() => handleModerate(item.id, "remove")}
                      >
                        Remove
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
