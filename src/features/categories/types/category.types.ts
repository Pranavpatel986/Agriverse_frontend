import type { PublicId } from "@/shared/types/api";

/**
 * The current backend genuinely returns a full recursive tree from
 * GET /categories — CategoryTreeNode.children is populated at every level,
 * confirmed against CategoryService.toTreeNode(). (An earlier version of
 * this comment claimed otherwise, matching an older OpenAPI snapshot;
 * that was wrong for the codebase as it stands and meant CategoryPicker
 * was silently only ever offering top-level categories.)
 */
export interface CategoryTreeNode {
  id: PublicId;
  name: string;
  slug: string;
  children: CategoryTreeNode[];
}

export interface CategoryDetail {
  id: PublicId;
  name: string;
  description?: string;
  parentCategoryId?: PublicId;
  articleCount: number;
  children: CategoryTreeNode[];
}

// --- Admin CRUD (CategoryManagementPanel) -------------------------------

export interface CategoryFormValues {
  name: string;
  parentCategoryId?: string;
  description?: string;
}
