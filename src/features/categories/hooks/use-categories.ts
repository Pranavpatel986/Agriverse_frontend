import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import { categoryService } from "../api/category.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { CategoryFormValues } from "../types/category.types";

export function useCategoryTree() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: categoryService.tree,
    staleTime: 10 * 60 * 1000, // taxonomy changes rarely
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: () => categoryService.bySlug(slug),
    enabled: Boolean(slug),
  });
}

// --- Admin mutations (CategoryManagementPanel) --------------------------

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation<{ id: string; slug: string }, AppError, CategoryFormValues>({
    mutationFn: async (payload) => {
      try {
        return await categoryService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation<unknown, AppError, { id: string; payload: Partial<CategoryFormValues> }>({
    mutationFn: async ({ id, payload }) => {
      try {
        return await categoryService.update(id, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation<unknown, AppError, string>({
    mutationFn: async (id) => {
      try {
        return await categoryService.remove(id);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}
