"use client";

import { useState } from "react";
import { BookmarkIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useCreateBookmark } from "@/features/bookmarks/hooks/use-bookmarks";
import { useCurrentUser } from "@/features/auth/hooks/use-role";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

/**
 * KNOWN GAP (flagged, not silently worked around): ArticleDetail doesn't
 * return whether the viewer has already bookmarked this article, or the
 * bookmark's own id — only DELETE /bookmarks/{bookmarkId} exists, not
 * "unbookmark by article id." So this button can reliably bookmark, but
 * can't yet un-bookmark from the Article page itself (that happens on
 * the Bookmarks page, which does have each bookmark's id). Worth asking
 * the backend team for either a `viewerHasBookmarked`/`bookmarkId` field
 * on ArticleDetail, or a DELETE-by-entity endpoint.
 */
export function BookmarkButton({ articleId }: { articleId: string }) {
  const { isAuthenticated } = useCurrentUser();
  const createBookmark = useCreateBookmark();
  const [optimisticallySaved, setOptimisticallySaved] = useState(false);

  if (!isAuthenticated) {
    return (
      <Button variant="outline" asChild>
        <Link href={ROUTES.login}>
          <BookmarkIcon />
          Log in to save
        </Link>
      </Button>
    );
  }

  const isSaved = optimisticallySaved;

  return (
    <Button
      variant={isSaved ? "secondary" : "outline"}
      disabled={createBookmark.isPending || isSaved}
      onClick={() => {
        setOptimisticallySaved(true); // immediate optimistic toggle per spec
        createBookmark.mutate(
          { entityType: "article", entityId: articleId },
          { onError: () => setOptimisticallySaved(false) },
        );
      }}
    >
      <BookmarkIcon className={cn(isSaved && "fill-current")} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
}
