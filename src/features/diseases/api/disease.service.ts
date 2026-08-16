import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  DiseaseDetail,
  DiseaseFormValues,
  DiseaseListParams,
  DiseaseSummary,
} from "../types/disease.types";

export const diseaseService = {
  list: (params: DiseaseListParams = {}) =>
    apiClient
      .get<PaginatedResponse<DiseaseSummary>>(endpoints.diseases.list, { params })
      .then((res) => res.data),

  byId: (id: string) =>
    apiClient.get<DiseaseDetail>(endpoints.diseases.byId(id)).then((res) => res.data),

  create: (payload: DiseaseFormValues) =>
    apiClient
      .post<{ id: string }>(endpoints.admin.diseases, payload)
      .then((res) => res.data),

  update: (id: string, payload: Partial<DiseaseFormValues>) =>
    apiClient
      .put<DiseaseDetail>(endpoints.admin.disease(id), payload)
      .then((res) => res.data),

  remove: (id: string) =>
    apiClient
      .delete<{ message: string }>(endpoints.admin.disease(id))
      .then((res) => res.data),
};
