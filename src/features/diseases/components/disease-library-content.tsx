"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { useDiseases } from "@/features/diseases/hooks/use-diseases";
import { DiseaseCard } from "@/features/diseases/components/disease-card";
import {
  DiseaseFilterBar,
  type DiseaseFilters,
} from "@/features/diseases/components/disease-filter-bar";
import { DiseaseDetailPanelContent } from "@/features/diseases/components/disease-detail-panel-content";
import { DetailPanel } from "@/shared/components/composite/detail-panel";
import { MobileFilterSheet } from "@/shared/components/composite/mobile-filter-sheet";
import { Pagination } from "@/shared/components/composite/pagination";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";
import { Button } from "@/shared/components/ui/button";
import type { PaginatedResponse } from "@/shared/types/api";
import type { DiseaseSummary } from "@/features/diseases/types/disease.types";

export function DiseaseLibraryContent({
  initialPage,
}: {
  initialPage: PaginatedResponse<DiseaseSummary>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDiseaseId = searchParams.get("disease");

  const [symptom, setSymptom] = useState("");
  const [filters, setFilters] = useState<DiseaseFilters>({});
  const [page, setPage] = useState(0);
  const debouncedSymptom = useDebouncedValue(symptom, 350);

  const isDefaultView =
    !debouncedSymptom &&
    !filters.cropId &&
    !filters.pathogenType &&
    !filters.severity &&
    page === 0;

  const query = useDiseases({
    symptom: debouncedSymptom || undefined,
    ...filters,
    page,
    size: 12,
  });
  const data = isDefaultView ? initialPage : query.data;
  const isLoading = !isDefaultView && query.isLoading;
  const isError = !isDefaultView && query.isError;

  function openDisease(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("disease", id);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function closeDetailPanel() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("disease");
    router.replace(params.toString() ? `?${params.toString()}` : "?", { scroll: false });
  }

  function clearFilters() {
    setSymptom("");
    setFilters({});
    setPage(0);
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <header className="space-y-3">
        <h1 className="font-display text-2xl font-semibold">Plant Disease Library</h1>
        <div className="max-w-xl space-y-1.5">
          <Label htmlFor="symptom-search">Search by symptom</Label>
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="symptom-search"
              placeholder="e.g. yellowing leaves, wilting stems…"
              className="pl-9"
              value={symptom}
              onChange={(e) => {
                setSymptom(e.target.value);
                setPage(0);
              }}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <DiseaseFilterBar
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(0);
            }}
          />
        </aside>

        <div className="space-y-4">
          <MobileFilterSheet>
            <DiseaseFilterBar
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
              title="No diseases match that symptom"
              description="Try broadening your filters, or browse by crop instead."
              action={
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data?.content.map((disease) => (
                  <DiseaseCard
                    key={disease.id}
                    disease={disease}
                    onSelect={() => openDisease(disease.id)}
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
        open={Boolean(selectedDiseaseId)}
        onOpenChange={(open) => !open && closeDetailPanel()}
        title="Disease details"
      >
        {selectedDiseaseId && <DiseaseDetailPanelContent diseaseId={selectedDiseaseId} />}
      </DetailPanel>
    </div>
  );
}
