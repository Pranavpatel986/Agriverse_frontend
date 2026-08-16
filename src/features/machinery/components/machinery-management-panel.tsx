"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { MachineryCard } from "./machinery-card";
import { MachineryForm } from "./machinery-form";
import { ConfirmDialog } from "@/shared/components/composite/confirm-dialog";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";
import {
  useDeleteMachinery,
  useMachineryList,
  useMachinery,
} from "../hooks/use-machinery";
import type { MachinerySummary } from "../types/machinery.types";

export function MachineryManagementPanel() {
  const { data, isLoading, isError, refetch } = useMachineryList({ size: 24 });
  const deleteMachinery = useDeleteMachinery();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MachinerySummary | null>(null);
  const { data: editingItem } = useMachinery(editingId ?? undefined);

  function openCreate() {
    setEditingId(null);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMachinery.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  if (isError) {
    return (
      <ErrorState description="Couldn't load machinery." onRetry={() => refetch()} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Machinery</h2>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon />
          Add machinery
        </Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} className="sm:grid-cols-2 lg:grid-cols-3" />
      ) : data?.content.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Add the first machinery entry to get started."
          action={
            <Button onClick={openCreate}>
              <PlusIcon />
              Add machinery
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.content.map((item) => (
            <div key={item.id} className="group relative">
              <MachineryCard
                machinery={item}
                onSelect={() => {
                  setEditingId(item.id);
                  setFormOpen(true);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="bg-card text-destructive absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100"
                aria-label={`Delete machinery: ${item.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(item);
                }}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <MachineryForm open={formOpen} onOpenChange={setFormOpen} editing={editingItem} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this machinery entry?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        isConfirming={deleteMachinery.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
