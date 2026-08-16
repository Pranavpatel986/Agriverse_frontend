import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { Crop, CropFormValues, CropListParams, CropPage } from "../types/crop.types";

export const cropService = {
  list: (params: CropListParams = {}) =>
    apiClient.get<CropPage>(endpoints.crops.list, { params }).then((res) => res.data),

  byId: (id: string) =>
    apiClient.get<Crop>(endpoints.crops.byId(id)).then((res) => res.data),

  create: (payload: CropFormValues) =>
    apiClient.post<Crop>(endpoints.admin.crops, payload).then((res) => res.data),

  update: (id: string, payload: Partial<CropFormValues>) =>
    apiClient.put<Crop>(endpoints.admin.crop(id), payload).then((res) => res.data),

  remove: (id: string) =>
    apiClient
      .delete<{ message: string }>(endpoints.admin.crop(id))
      .then((res) => res.data),
};
