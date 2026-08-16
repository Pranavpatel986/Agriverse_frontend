"use client";

import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { useComments } from "../hooks/use-comments";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { useCurrentUser } from "@/features/auth/hooks/use-role";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/config/routes";

export function CommentsSection({ articleId }: { articleId: string }) {
  const { isAuthenticated } = useCurrentUser();
  const { data, isLoading, isError, refetch } = useComments(articleId);

  return (
    <section aria-labelledby="comments-heading" className="space-y-6">
      <h2
        id="comments-heading"
        className="font-display flex items-center gap-2 text-xl font-semibold"
      >
        <MessageCircleIcon className="text-primary size-5" aria-hidden="true" />
        Comments {data?.content && `(${data.content.length})`}
      </h2>

      {isAuthenticated ? (
        <CommentForm articleId={articleId} />
      ) : (
        <p className="border-border bg-muted/40 text-muted-foreground rounded-md border px-4 py-3 text-sm">
          <Link href={ROUTES.login} className="link-underline text-primary font-medium">
            Log in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      {isError && (
        <ErrorState
          variant="inline"
          description="Couldn't load comments."
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!isLoading && !isError && data?.content.length === 0 && (
        <EmptyState
          title="No comments yet"
          description="Be the first to ask a question."
        />
      )}

      {!isLoading && data && data.content.length > 0 && (
        <ul className="space-y-5">
          {data.content.map((comment) => (
            <CommentItem key={comment.id} articleId={articleId} comment={comment} />
          ))}
        </ul>
      )}
    </section>
  );
}
