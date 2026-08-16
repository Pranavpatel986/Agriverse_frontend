import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schemeService } from "../api/scheme.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { SchemeFormValues, SchemeListParams } from "../types/scheme.types";

export function useSchemes(params: SchemeListParams = {}) {
  return useQuery({
    queryKey: ["schemes", "list", params],
    queryFn: () => schemeService.list(params),
  });
}

export function useScheme(id: string | undefined) {
  return useQuery({
    queryKey: ["schemes", "detail", id],
    queryFn: () => schemeService.byId(id as string),
    enabled: Boolean(id),
  });
}

// --- Admin mutations (SchemeManagementPanel) -------------------------

function useInvalidateSchemes() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["schemes"] });
}

export function useCreateScheme() {
  const invalidate = useInvalidateSchemes();
  return useMutation<{ id: string }, AppError, SchemeFormValues>({
    mutationFn: async (payload) => {
      try {
        return await schemeService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useUpdateScheme() {
  const invalidate = useInvalidateSchemes();
  return useMutation<
    unknown,
    AppError,
    { id: string; payload: Partial<SchemeFormValues> }
  >({
    mutationFn: async ({ id, payload }) => {
      try {
        return await schemeService.update(id, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useDeleteScheme() {
  const invalidate = useInvalidateSchemes();
  return useMutation<unknown, AppError, string>({
    mutationFn: async (id) => {
      try {
        return await schemeService.remove(id);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}
