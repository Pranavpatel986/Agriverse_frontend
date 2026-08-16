"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMachineryList } from "@/features/machinery/hooks/use-machinery";
import { MachineryCard } from "@/features/machinery/components/machinery-card";
import {
  MachineryFilterBar,
  type MachineryFilters,
} from "@/features/machinery/components/machinery-filter-bar";
import { MachineryDetailPanelContent } from "@/features/machinery/components/machinery-detail-panel-content";
import { DetailPanel } from "@/shared/components/composite/detail-panel";
import { MobileFilterSheet } from "@/shared/components/composite/mobile-filter-sheet";
import { Pagination } from "@/shared/components/composite/pagination";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";
import { Button } from "@/shared/components/ui/button";
import type { PaginatedResponse } from "@/shared/types/api";
import type { MachinerySummary } from "@/features/machinery/types/machinery.types";

export function MachineryDirectoryContent({
  initialPage,
}: {
  initialPage: PaginatedResponse<MachinerySummary>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("item");

  const [filters, setFilters] = useState<MachineryFilters>({});
  const [page, setPage] = useState(0);
  const isDefaultView = !filters.category && !filters.cropId && page === 0;

  const query = useMachineryList({ ...filters, page, size: 12 });
  const data = isDefaultView ? initialPage : query.data;
  const isLoading = !isDefaultView && query.isLoading;
  const isError = !isDefaultView && query.isError;

  function openItem(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("item", id);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function closeDetailPanel() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("item");
    router.replace(params.toString() ? `?${params.toString()}` : "?", { scroll: false });
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <header className="max-w-2xl space-y-1">
        <h1 className="font-display text-2xl font-semibold">Machinery Directory</h1>
        <p className="text-muted-foreground text-sm">
          Browse farm equipment by category, crop, and indicative price range.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <MachineryFilterBar
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(0);
            }}
          />
        </aside>

        <div className="space-y-4">
          <MobileFilterSheet>
            <MachineryFilterBar
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
              title="No machinery matches these filters"
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
                {data?.content.map((item) => (
                  <MachineryCard
                    key={item.id}
                    machinery={item}
                    onSelect={() => openItem(item.id)}
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
        open={Boolean(selectedId)}
        onOpenChange={(open) => !open && closeDetailPanel()}
        title="Machinery details"
      >
        {selectedId && <MachineryDetailPanelContent machineryId={selectedId} />}
      </DetailPanel>
    </div>
  );
}
