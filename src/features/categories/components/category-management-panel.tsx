"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ConfirmDialog } from "@/shared/components/composite/confirm-dialog";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CategoryForm } from "./category-form";
import { useCategoryTree, useCategory, useDeleteCategory } from "../hooks/use-categories";
import type { CategoryTreeNode } from "../types/category.types";

interface FlatRow {
  id: string;
  name: string;
  slug: string;
  depth: number;
}

function flatten(nodes: CategoryTreeNode[], depth = 0): FlatRow[] {
  return nodes.flatMap((node) => [
    { id: node.id, name: node.name, slug: node.slug, depth },
    ...flatten(node.children, depth + 1),
  ]);
}

export function CategoryManagementPanel() {
  const { data: tree, isLoading, isError, refetch } = useCategoryTree();
  const deleteCategory = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FlatRow | null>(null);
  // Editing needs full detail (parentCategoryId, description) that the
  // tree listing doesn't carry — fetched by slug, the only "get one"
  // endpoint the backend exposes for categories.
  const { data: editingCategory } = useCategory(editingSlug ?? "");

  const rows = tree ? flatten(tree) : [];

  function openCreate() {
    setEditingSlug(null);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteCategory.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  if (isError) {
    return <ErrorState description="Couldn't load categories." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories</h2>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon />
          Add category
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Add the first category to start organizing articles."
          action={
            <Button onClick={openCreate}>
              <PlusIcon />
              Add category
            </Button>
          }
        />
      ) : (
        <div className="divide-border bg-card divide-y rounded-lg border">
          {rows.map((row) => (
            <div
              key={row.id}
              className="hover:bg-muted/50 flex items-center justify-between gap-3 px-4 py-3"
              style={{ paddingLeft: `${16 + row.depth * 24}px` }}
            >
              <button
                type="button"
                className="flex flex-1 items-center gap-2 text-left"
                onClick={() => {
                  setEditingSlug(row.slug);
                  setFormOpen(true);
                }}
              >
                {row.depth > 0 && <span className="text-muted-foreground">—</span>}
                <span className="font-medium">{row.name}</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {row.slug}
                </Badge>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive size-8"
                aria-label={`Delete category: ${row.name}`}
                onClick={() => setDeleteTarget(row)}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <CategoryForm open={formOpen} onOpenChange={setFormOpen} editing={editingCategory} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this category?"
        description={`"${deleteTarget?.name}" will be permanently removed. Categories with articles or subcategories can't be deleted — remove or reassign those first.`}
        confirmLabel="Delete"
        isConfirming={deleteCategory.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
