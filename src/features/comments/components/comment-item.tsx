"use client";

import { formatDistanceToNow } from "date-fns";
import { HeartIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useToggleCommentLike } from "../hooks/use-comments";
import { useCurrentUser } from "@/features/auth/hooks/use-role";
import type { Comment } from "../types/comment.types";

export function CommentItem({
  articleId,
  comment,
}: {
  articleId: string;
  comment: Comment;
}) {
  const { isAuthenticated } = useCurrentUser();
  const toggleLike = useToggleCommentLike(articleId);
  const liked = comment.viewerHasLiked ?? false;

  const initials = comment.user.displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <li className="flex gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{comment.user.displayName}</span>
          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-foreground text-sm">{comment.body}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!isAuthenticated || toggleLike.isPending}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this comment" : "Like this comment"}
          className="text-muted-foreground h-7 gap-1 px-2 text-xs"
          onClick={() =>
            toggleLike.mutate({ commentId: comment.id, currentlyLiked: liked })
          }
        >
          <HeartIcon className={cn("size-3.5", liked && "fill-clay-500 text-clay-500")} />
          {comment.likeCount}
        </Button>
      </div>
    </li>
  );
}
