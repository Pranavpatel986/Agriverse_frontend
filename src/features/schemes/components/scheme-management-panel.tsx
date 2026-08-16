"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SchemeCard } from "./scheme-card";
import { SchemeForm } from "./scheme-form";
import { ConfirmDialog } from "@/shared/components/composite/confirm-dialog";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";
import { useDeleteScheme, useSchemes, useScheme } from "../hooks/use-schemes";
import type { SchemeSummary } from "../types/scheme.types";

export function SchemeManagementPanel() {
  const { data, isLoading, isError, refetch } = useSchemes({ size: 24 });
  const deleteScheme = useDeleteScheme();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SchemeSummary | null>(null);
  const { data: editingScheme } = useScheme(editingId ?? undefined);

  function openCreate() {
    setEditingId(null);
    setFormOpen(true);
  }

  function openEdit(scheme: SchemeSummary) {
    setEditingId(scheme.id);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteScheme.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  if (isError) {
    return <ErrorState description="Couldn't load schemes." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Schemes</h2>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon />
          Add scheme
        </Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} className="sm:grid-cols-2 lg:grid-cols-3" />
      ) : data?.content.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Add the first scheme to get started."
          action={
            <Button onClick={openCreate}>
              <PlusIcon />
              Add scheme
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.content.map((scheme) => (
            <div key={scheme.id} className="group relative">
              <SchemeCard scheme={scheme} onSelect={() => openEdit(scheme)} />
              <Button
                variant="ghost"
                size="icon"
                className="bg-card text-destructive absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100"
                aria-label={`Delete scheme: ${scheme.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(scheme);
                }}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <SchemeForm open={formOpen} onOpenChange={setFormOpen} editing={editingScheme} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this scheme?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        isConfirming={deleteScheme.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
