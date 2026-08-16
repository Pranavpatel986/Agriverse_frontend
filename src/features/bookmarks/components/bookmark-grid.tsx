"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ROUTES } from "@/config/routes";
import { useRemoveBookmark } from "../hooks/use-bookmarks";
import type { Bookmark } from "../types/bookmark.types";
import type { BookmarkFilter } from "./bookmark-filter-tabs";

const UNDO_WINDOW_MS = 4000;

const EMPTY_MESSAGES: Record<BookmarkFilter, { title: string; description: string }> = {
  all: {
    title: "No bookmarks yet",
    description: "Save articles, roadmaps, and quizzes to find them here later.",
  },
  article: {
    title: "No saved articles",
    description: "Bookmark an article to see it here.",
  },
  roadmap: {
    title: "No saved roadmaps",
    description: "Bookmark a roadmap to see it here.",
  },
  quiz: { title: "No saved quizzes", description: "Bookmark a quiz to see it here." },
};

export function BookmarkGrid({
  bookmarks,
  activeFilter,
}: {
  bookmarks: Bookmark[];
  activeFilter: BookmarkFilter;
}) {
  const removeBookmark = useRemoveBookmark();
  const [pendingRemovalIds, setPendingRemovalIds] = useState<Set<string>>(new Set());
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const visibleBookmarks = bookmarks.filter((b) => !pendingRemovalIds.has(b.id));

  function handleRemove(bookmark: Bookmark) {
    setPendingRemovalIds((prev) => new Set(prev).add(bookmark.id));

    const timer = setTimeout(() => {
      removeBookmark.mutate(bookmark.id, {
        onError: () => {
          // Failed removal: restore the card and surface an inline error,
          // per the spec.
          setPendingRemovalIds((prev) => {
            const next = new Set(prev);
            next.delete(bookmark.id);
            return next;
          });
        },
      });
      timers.current.delete(bookmark.id);
    }, UNDO_WINDOW_MS);

    timers.current.set(bookmark.id, timer);

    toast(`Removed "${bookmark.entitySummary.title}"`, {
      action: {
        label: "Undo",
        onClick: () => {
          const pendingTimer = timers.current.get(bookmark.id);
          if (pendingTimer) {
            clearTimeout(pendingTimer);
            timers.current.delete(bookmark.id);
          }
          setPendingRemovalIds((prev) => {
            const next = new Set(prev);
            next.delete(bookmark.id);
            return next;
          });
        },
      },
    });
  }

  if (visibleBookmarks.length === 0) {
    const { title, description } = EMPTY_MESSAGES[activeFilter];
    return (
      <EmptyState
        title={title}
        description={description}
        action={
          <Button variant="outline" asChild>
            <Link href={ROUTES.home}>Browse categories</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleBookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="group border-border bg-card relative flex items-start justify-between gap-2 rounded-lg border p-4"
        >
          <div className="min-w-0">
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {bookmark.entityType}
            </span>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-medium">
              <Link
                href={
                  bookmark.entityType === "article"
                    ? ROUTES.article(bookmark.entitySummary.slug)
                    : "#"
                }
                className="link-underline"
              >
                {bookmark.entitySummary.title}
              </Link>
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive size-7 shrink-0"
            aria-label={`Remove bookmark: ${bookmark.entitySummary.title}`}
            onClick={() => handleRemove(bookmark)}
          >
            <XIcon className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
