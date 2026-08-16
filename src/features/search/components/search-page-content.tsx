"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterIcon } from "lucide-react";
import { useSearch } from "@/features/search/hooks/use-search";
import { FilterSidebar } from "./filter-sidebar";
import { SearchResultCard } from "./search-result-card";
import { Pagination } from "@/shared/components/composite/pagination";
import { TrendingSearchesWidget } from "@/shared/components/composite/trending-searches-widget";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";
import { ArticleCardSkeleton } from "@/shared/components/feedback/skeletons";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ROUTES } from "@/config/routes";

const RESULTS_PER_PAGE = 12;

export function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const page = Number(searchParams.get("page") ?? 0);

  function updateParams(next: { category?: string | null; page?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.category !== undefined) {
      if (next.category) params.set("category", next.category);
      else params.delete("category");
      params.delete("page"); // filter change resets pagination
    }
    if (next.page !== undefined) params.set("page", String(next.page));
    router.push(`${ROUTES.search}?${params.toString()}`);
  }

  const { data, isLoading, isFetching, isError, refetch } = useSearch({
    q,
    category: category ?? undefined,
    page,
    size: RESULTS_PER_PAGE,
  });

  if (!q.trim()) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="font-display mb-6 text-2xl font-semibold">Search AgriVerse</h1>
        <TrendingSearchesWidget />
      </div>
    );
  }

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalElements / RESULTS_PER_PAGE))
    : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="font-display mb-1 text-2xl font-semibold">
        Results for &ldquo;{q}&rdquo;
      </h1>
      {/* Announced for screen reader users as results change, per the a11y spec. */}
      <p aria-live="polite" className="text-muted-foreground mb-6 text-sm">
        {isLoading ? "Searching…" : `${data?.totalElements ?? 0} results`}
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar
            selectedCategory={category}
            onChange={(next) => updateParams({ category: next })}
          />
        </aside>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mb-2 w-fit lg:hidden">
              <FilterIcon className="size-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetTitle>Filters</SheetTitle>
            <div className="mt-4">
              <FilterSidebar
                selectedCategory={category}
                onChange={(next) => updateParams({ category: next })}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className="space-y-6">
          {/* Thin top-of-list indicator on filter/page changes rather than
              collapsing previous results, per the spec's no-layout-jump rule. */}
          {isFetching && !isLoading && (
            <div className="bg-muted h-0.5 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-1/3 animate-pulse" />
            </div>
          )}

          {isError ? (
            <ErrorState
              title="Couldn't complete your search"
              description="Your query and filters are preserved — try again."
              onRetry={() => refetch()}
            />
          ) : isLoading ? (
            <CardGridSkeleton
              count={9}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              card={ArticleCardSkeleton}
            />
          ) : data?.content.length === 0 ? (
            <EmptyState
              title={`No results for "${q}"`}
              description="Try a different search, or browse categories instead."
              action={
                <Button variant="outline" asChild>
                  <a href={ROUTES.home}>Browse categories</a>
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data?.content.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(nextPage) => updateParams({ page: nextPage })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
