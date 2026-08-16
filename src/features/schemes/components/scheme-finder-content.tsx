"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSchemes } from "@/features/schemes/hooks/use-schemes";
import { SchemeCard } from "@/features/schemes/components/scheme-card";
import {
  SchemeFilterBar,
  type SchemeFilters,
} from "@/features/schemes/components/scheme-filter-bar";
import { SchemeDetailPanelContent } from "@/features/schemes/components/scheme-detail-panel-content";
import { DetailPanel } from "@/shared/components/composite/detail-panel";
import { MobileFilterSheet } from "@/shared/components/composite/mobile-filter-sheet";
import { Pagination } from "@/shared/components/composite/pagination";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";
import { Button } from "@/shared/components/ui/button";
import type { PaginatedResponse } from "@/shared/types/api";
import type { SchemeSummary } from "@/features/schemes/types/scheme.types";

export function SchemeFinderContent({
  initialPage,
}: {
  initialPage: PaginatedResponse<SchemeSummary>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSchemeId = searchParams.get("scheme");

  const [filters, setFilters] = useState<SchemeFilters>({});
  const [page, setPage] = useState(0);
  const isDefaultView =
    !filters.state && !filters.beneficiaryType && !filters.cropId && page === 0;

  const query = useSchemes({ ...filters, page, size: 12 });
  const data = isDefaultView ? initialPage : query.data;
  const isLoading = !isDefaultView && query.isLoading;
  const isError = !isDefaultView && query.isError;

  function openScheme(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("scheme", id);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function closeDetailPanel() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("scheme");
    router.replace(params.toString() ? `?${params.toString()}` : "?", { scroll: false });
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <header className="max-w-2xl space-y-1">
        <h1 className="font-display text-2xl font-semibold">Government Scheme Finder</h1>
        <p className="text-muted-foreground text-sm">
          Find subsidies and support programs you may be eligible for.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <SchemeFilterBar
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(0);
            }}
          />
        </aside>

        <div className="space-y-4">
          <MobileFilterSheet>
            <SchemeFilterBar
              filters={filters}
              onChange={(next) => {
                setFilters(next);
                setPage(0);
              }}
            />
          </MobileFilterSheet>

          {isError ? (
            <ErrorState onRetry={() => query.refetch()} />
          ) : isLoading ? (
            <CardGridSkeleton
              count={9}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            />
          ) : data?.content.length === 0 ? (
            <EmptyState
              title="No schemes match these filters"
              description="Try broadening your search."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({});
                    setPage(0);
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data?.content.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onSelect={() => openScheme(scheme.id)}
                  />
                ))}
              </div>
              {data && (
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      <DetailPanel
        open={Boolean(selectedSchemeId)}
        onOpenChange={(open) => !open && closeDetailPanel()}
        title="Scheme details"
      >
        {selectedSchemeId && <SchemeDetailPanelContent schemeId={selectedSchemeId} />}
      </DetailPanel>
    </div>
  );
}
