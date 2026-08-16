import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  AnalyticsOverview,
  ManagedArticle,
  ManagedArticleListParams,
  UpdateArticleStatusRequest,
  UpdateArticleStatusResponse,
} from "../types/dashboard.types";

export const dashboardService = {
  myArticles: (params: ManagedArticleListParams = {}) =>
    apiClient
      .get<PaginatedResponse<ManagedArticle>>(endpoints.dashboard.managedArticles, {
        params,
      })
      .then((res) => res.data),

  updateArticleStatus: (articleId: string, payload: UpdateArticleStatusRequest) =>
    apiClient
      .patch<UpdateArticleStatusResponse>(
        endpoints.dashboard.updateArticleStatus(articleId),
        payload,
      )
      .then((res) => res.data),

  analyticsOverview: (params: { from?: string; to?: string } = {}) =>
    apiClient
      .get<AnalyticsOverview>(endpoints.dashboard.analyticsOverview, { params })
      .then((res) => res.data),
};
