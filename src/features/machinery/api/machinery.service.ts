import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  MachineryDetail,
  MachineryFormValues,
  MachineryListParams,
  MachinerySummary,
} from "../types/machinery.types";

export const machineryService = {
  list: (params: MachineryListParams = {}) =>
    apiClient
      .get<PaginatedResponse<MachinerySummary>>(endpoints.machinery.list, { params })
      .then((res) => res.data),

  byId: (id: string) =>
    apiClient.get<MachineryDetail>(endpoints.machinery.byId(id)).then((res) => res.data),

  create: (payload: MachineryFormValues) =>
    apiClient
      .post<{ id: string }>(endpoints.admin.machinery, payload)
      .then((res) => res.data),

  update: (id: string, payload: Partial<MachineryFormValues>) =>
    apiClient
      .put<MachineryDetail>(endpoints.admin.machineryItem(id), payload)
      .then((res) => res.data),

  remove: (id: string) =>
    apiClient
      .delete<{ message: string }>(endpoints.admin.machineryItem(id))
      .then((res) => res.data),
};
