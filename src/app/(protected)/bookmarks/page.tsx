"use client";

import { useState } from "react";
import { useBookmarks } from "@/features/bookmarks/hooks/use-bookmarks";
import {
  BookmarkFilterTabs,
  type BookmarkFilter,
} from "@/features/bookmarks/components/bookmark-filter-tabs";
import { BookmarkGrid } from "@/features/bookmarks/components/bookmark-grid";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";

function BookmarksContent() {
  const [filter, setFilter] = useState<BookmarkFilter>("all");
  const { data, isLoading, isError, refetch } = useBookmarks(
    filter === "all" ? {} : { entityType: filter },
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold">Your bookmarks</h1>
        {data?.content && (
          <p className="text-muted-foreground text-sm">{data.content.length} saved</p>
        )}
      </header>

      <BookmarkFilterTabs value={filter} onChange={setFilter} />

      {isError ? (
        <ErrorState
          description="Couldn't load your bookmarks."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <CardGridSkeleton count={6} className="sm:grid-cols-2 lg:grid-cols-3" />
      ) : (
        <BookmarkGrid bookmarks={data?.content ?? []} activeFilter={filter} />
      )}
    </div>
  );
}

export default function BookmarksPage() {
  return (
    <AuthGate>
      <BookmarksContent />
    </AuthGate>
  );
}
