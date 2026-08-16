import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type {
  CategoryDetail,
  CategoryFormValues,
  CategoryTreeNode,
} from "../types/category.types";

export const categoryService = {
  tree: () =>
    apiClient
      .get<{ content: CategoryTreeNode[] }>(endpoints.categories.list)
      .then((res) => res.data.content),

  bySlug: (slug: string) =>
    apiClient
      .get<CategoryDetail>(endpoints.categories.bySlug(slug))
      .then((res) => res.data),

  create: (payload: CategoryFormValues) =>
    apiClient
      .post<{ id: string; slug: string }>(endpoints.categories.create, payload)
      .then((res) => res.data),

  update: (id: string, payload: Partial<CategoryFormValues>) =>
    apiClient
      .put<CategoryDetail>(endpoints.categories.update(id), payload)
      .then((res) => res.data),

  remove: (id: string) =>
    apiClient
      .delete<{ message: string }>(endpoints.categories.remove(id))
      .then((res) => res.data),
};
