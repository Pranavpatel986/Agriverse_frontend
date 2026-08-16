"use client";

import { useCategoryTree } from "@/features/categories/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { CategoryTreeNode } from "../types/category.types";

interface FlatCategory {
  id: string;
  name: string;
  depth: number;
}

/** Depth-first flatten so subcategories render indented directly under their parent. */
function flatten(nodes: CategoryTreeNode[], depth = 0): FlatCategory[] {
  return nodes.flatMap((node) => [
    { id: node.id, name: node.name, depth },
    ...flatten(node.children, depth + 1),
  ]);
}

/** A node and everything under it — used to stop a category being offered as its own descendant's parent. */
function collectSubtreeIds(node: CategoryTreeNode): Set<string> {
  const ids = new Set([node.id]);
  for (const child of node.children) {
    for (const id of collectSubtreeIds(child)) ids.add(id);
  }
  return ids;
}

function findNode(nodes: CategoryTreeNode[], id: string): CategoryTreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return undefined;
}

interface CategoryPickerProps {
  value: string | undefined;
  onChange: (categoryId: string | undefined) => void;
  placeholder?: string;
  /** Excludes this category and its whole subtree — pass the category being
   *  edited so it (and its own descendants) can't be picked as its own parent. */
  excludeId?: string;
  /** Adds a "No parent" option that resolves to `undefined`, for the admin form. */
  allowNone?: boolean;
}

export function CategoryPicker({
  value,
  onChange,
  placeholder,
  excludeId,
  allowNone,
}: CategoryPickerProps) {
  const { data: categories, isLoading } = useCategoryTree();

  const excludedIds = excludeId && categories
    ? collectSubtreeIds(findNode(categories, excludeId) ?? { id: excludeId, name: "", slug: "", children: [] })
    : new Set<string>();

  const options = (categories ? flatten(categories) : []).filter((c) => !excludedIds.has(c.id));

  return (
    <Select
      value={value ?? (allowNone ? "none" : undefined)}
      onValueChange={(next) => onChange(next === "none" ? undefined : next)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading…" : (placeholder ?? "Select a category")} />
      </SelectTrigger>
      <SelectContent>
        {allowNone && <SelectItem value="none">No parent (top-level)</SelectItem>}
        {options.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {"\u00A0\u00A0".repeat(category.depth)}
            {category.depth > 0 ? "— " : ""}
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
