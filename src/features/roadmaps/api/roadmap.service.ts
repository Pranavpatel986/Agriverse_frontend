import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  RoadmapDetail,
  RoadmapListParams,
  RoadmapProgress,
  RoadmapSummary,
  UpdateRoadmapProgressRequest,
  CreateRoadmapInput,
} from "../types/roadmap.types";

export const roadmapService = {
  list: (params: RoadmapListParams = {}) =>
    apiClient
      .get<PaginatedResponse<RoadmapSummary>>(endpoints.roadmaps.list, { params })
      .then((res) => res.data),

  bySlug: (slug: string) =>
    apiClient.get<RoadmapDetail>(endpoints.roadmaps.bySlug(slug)).then((res) => res.data),

  updateProgress: (roadmapId: string, payload: UpdateRoadmapProgressRequest) =>
    apiClient
      .patch<RoadmapProgress>(endpoints.roadmaps.progress(roadmapId), payload)
      .then((res) => res.data),

  create: (payload: CreateRoadmapInput) =>
    apiClient
      .post<{ id: string; slug: string }>(endpoints.roadmaps.create, payload)
      .then((res) => res.data),
};
