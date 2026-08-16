import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cropService } from "../api/crop.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { CropFormValues, CropListParams } from "../types/crop.types";

export function useCrops(params: CropListParams = {}) {
  return useQuery({
    queryKey: ["crops", params],
    queryFn: () => cropService.list(params),
    staleTime: 10 * 60 * 1000, // crop reference data changes rarely
  });
}

export function useCrop(id: string | undefined) {
  return useQuery({
    queryKey: ["crops", "detail", id],
    queryFn: () => cropService.byId(id as string),
    enabled: Boolean(id),
  });
}

// --- Admin mutations (CropManagementPanel) ------------------------------

function useInvalidateCrops() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["crops"] });
}

export function useCreateCrop() {
  const invalidate = useInvalidateCrops();
  return useMutation<{ id: string }, AppError, CropFormValues>({
    mutationFn: async (payload) => {
      try {
        return await cropService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useUpdateCrop() {
  const invalidate = useInvalidateCrops();
  return useMutation<unknown, AppError, { id: string; payload: Partial<CropFormValues> }>({
    mutationFn: async ({ id, payload }) => {
      try {
        return await cropService.update(id, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useDeleteCrop() {
  const invalidate = useInvalidateCrops();
  return useMutation<unknown, AppError, string>({
    mutationFn: async (id) => {
      try {
        return await cropService.remove(id);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}
