"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ConfirmDialog } from "@/shared/components/composite/confirm-dialog";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { CropForm } from "./crop-form";
import { useCrops, useDeleteCrop } from "../hooks/use-crops";
import type { Crop } from "../types/crop.types";

export function CropManagementPanel() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const { data, isLoading, isError, refetch } = useCrops({ q: debouncedQuery, size: 50 });
  const deleteCrop = useDeleteCrop();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Crop | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Crop | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteCrop.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  if (isError) {
    return <ErrorState description="Couldn't load crops." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Crops</h2>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon />
          Add crop
        </Button>
      </div>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search crops…"
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : data?.content.length === 0 ? (
        <EmptyState
          title="No crops found"
          description={query ? "Try a different search." : "Add the first crop to get started."}
          action={
            !query ? (
              <Button onClick={openCreate}>
                <PlusIcon />
                Add crop
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="divide-border bg-card divide-y rounded-lg border">
          {data?.content.map((crop) => (
            <div
              key={crop.id}
              className="hover:bg-muted/50 flex items-center justify-between gap-3 px-4 py-3"
            >
              <button
                type="button"
                className="flex flex-1 items-center gap-2 text-left"
                onClick={() => {
                  setEditing(crop);
                  setFormOpen(true);
                }}
              >
                <span className="font-medium">{crop.name}</span>
                {crop.scientificName && (
                  <span className="text-muted-foreground text-sm italic">
                    {crop.scientificName}
                  </span>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive size-8"
                aria-label={`Delete crop: ${crop.name}`}
                onClick={() => setDeleteTarget(crop)}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <CropForm open={formOpen} onOpenChange={setFormOpen} editing={editing ?? undefined} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this crop?"
        description={`"${deleteTarget?.name}" will be permanently removed. Crops referenced by diseases, schemes, or machinery may fail to delete — unlink those first.`}
        confirmLabel="Delete"
        isConfirming={deleteCrop.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
