"use client";

import Link from "next/link";
import { TrendingUpIcon } from "lucide-react";
import { useTrendingSearches } from "@/features/search/hooks/use-search";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/config/routes";

export function TrendingSearchesWidget() {
  const { data: terms, isLoading, isError } = useTrendingSearches(10);

  if (isError || (!isLoading && !terms?.length)) return null;

  return (
    <section aria-labelledby="trending-searches-heading" className="space-y-3">
      <h2
        id="trending-searches-heading"
        className="text-foreground flex items-center gap-2 text-sm font-semibold"
      >
        <TrendingUpIcon className="text-accent size-4" aria-hidden="true" />
        Trending searches
      </h2>
      <div className="flex flex-wrap gap-2">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))
          : terms?.map((term) => (
              <Link
                key={term.term}
                href={`${ROUTES.search}?q=${encodeURIComponent(term.term)}`}
                className="border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground rounded-full border px-3 py-1 text-sm transition-colors"
              >
                {term.term}
              </Link>
            ))}
      </div>
    </section>
  );
}
