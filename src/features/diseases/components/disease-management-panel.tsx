"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DiseaseCard } from "./disease-card";
import { DiseaseForm } from "./disease-form";
import { ConfirmDialog } from "@/shared/components/composite/confirm-dialog";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";
import { useDeleteDisease, useDiseases, useDisease } from "../hooks/use-diseases";
import type { DiseaseSummary } from "../types/disease.types";

export function DiseaseManagementPanel() {
  const { data, isLoading, isError, refetch } = useDiseases({ size: 24 });
  const deleteDisease = useDeleteDisease();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiseaseSummary | null>(null);
  const { data: editingDisease } = useDisease(editingId ?? undefined);

  function openCreate() {
    setEditingId(null);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteDisease.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  if (isError) {
    return <ErrorState description="Couldn't load diseases." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Diseases</h2>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon />
          Add disease
        </Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} className="sm:grid-cols-2 lg:grid-cols-3" />
      ) : data?.content.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Add the first disease entry to get started."
          action={
            <Button onClick={openCreate}>
              <PlusIcon />
              Add disease
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.content.map((disease) => (
            <div key={disease.id} className="group relative">
              <DiseaseCard
                disease={disease}
                onSelect={() => {
                  setEditingId(disease.id);
                  setFormOpen(true);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="bg-card text-destructive absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100"
                aria-label={`Delete disease: ${disease.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(disease);
                }}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <DiseaseForm open={formOpen} onOpenChange={setFormOpen} editing={editingDisease} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this disease entry?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        isConfirming={deleteDisease.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
