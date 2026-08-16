import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { machineryService } from "../api/machinery.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { MachineryFormValues, MachineryListParams } from "../types/machinery.types";

export function useMachineryList(params: MachineryListParams = {}) {
  return useQuery({
    queryKey: ["machinery", "list", params],
    queryFn: () => machineryService.list(params),
  });
}

export function useMachinery(id: string | undefined) {
  return useQuery({
    queryKey: ["machinery", "detail", id],
    queryFn: () => machineryService.byId(id as string),
    enabled: Boolean(id),
  });
}

// --- Admin mutations (MachineryManagementPanel) ----------------------

function useInvalidateMachinery() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["machinery"] });
}

export function useCreateMachinery() {
  const invalidate = useInvalidateMachinery();
  return useMutation<{ id: string }, AppError, MachineryFormValues>({
    mutationFn: async (payload) => {
      try {
        return await machineryService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useUpdateMachinery() {
  const invalidate = useInvalidateMachinery();
  return useMutation<
    unknown,
    AppError,
    { id: string; payload: Partial<MachineryFormValues> }
  >({
    mutationFn: async ({ id, payload }) => {
      try {
        return await machineryService.update(id, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}

export function useDeleteMachinery() {
  const invalidate = useInvalidateMachinery();
  return useMutation<unknown, AppError, string>({
    mutationFn: async (id) => {
      try {
        return await machineryService.remove(id);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: invalidate,
  });
}
