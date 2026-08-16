import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { diseaseService } from "../api/disease.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { DiseaseFormValues, DiseaseListParams } from "../types/disease.types";

export function useDiseases(params: DiseaseListParams = {}) {
  return useQuery({
    queryKey: ["diseases", "list", params],
    queryFn: () => diseaseService.list(params),
  });
}

export function useDisease(id: string | undefined) {
  return useQuery({
    queryKey: ["diseases", "detail", id],
    queryFn: () => diseaseService.byId(id as string),
    enabled: Boolean(id),
  });
}

// --- Admin mutations (DiseaseManagementPanel) ------------------------

function useInvalidateDiseases() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["diseases"] });
}

export function useCreateDisease() {
  const invalidate = useInvalidateDiseases();
  return useMutation<{ id: string }, AppError, DiseaseFormValues>({
    mutationFn: async (payload) => {
      try {
        return await diseaseService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useUpdateDisease() {
  const invalidate = useInvalidateDiseases();
  return useMutation<
    unknown,
    AppError,
    { id: string; payload: Partial<DiseaseFormValues> }
  >({
    mutationFn: async ({ id, payload }) => {
      try {
        return await diseaseService.update(id, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useDeleteDisease() {
  const invalidate = useInvalidateDiseases();
  return useMutation<unknown, AppError, string>({
    mutationFn: async (id) => {
      try {
        return await diseaseService.remove(id);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}
