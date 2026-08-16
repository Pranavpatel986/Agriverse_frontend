import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  SchemeDetail,
  SchemeFormValues,
  SchemeListParams,
  SchemeSummary,
} from "../types/scheme.types";

export const schemeService = {
  list: (params: SchemeListParams = {}) =>
    apiClient
      .get<PaginatedResponse<SchemeSummary>>(endpoints.schemes.list, { params })
      .then((res) => res.data),

  byId: (id: string) =>
    apiClient.get<SchemeDetail>(endpoints.schemes.byId(id)).then((res) => res.data),

  create: (payload: SchemeFormValues) =>
    apiClient
      .post<{ id: string }>(endpoints.admin.schemes, payload)
      .then((res) => res.data),

  update: (id: string, payload: Partial<SchemeFormValues>) =>
    apiClient
      .put<SchemeDetail>(endpoints.admin.scheme(id), payload)
      .then((res) => res.data),

  remove: (id: string) =>
    apiClient
      .delete<{ message: string }>(endpoints.admin.scheme(id))
      .then((res) => res.data),
};
