import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { ContentListResponse, PaginatedResponse } from "@/shared/types/api";
import type {
  AdminArticleListParams,
  AdminArticleSummary,
  AdminUserListParams,
  AdminUserSummary,
  ArticleReviewRequest,
  ArticleReviewResponse,
  CreateUserRequest,
  ModerateCommentRequest,
  ModerateCommentResponse,
  ModerationQueueItem,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
} from "../types/admin.types";

export const adminService = {
  articlesInReview: (params: AdminArticleListParams = {}) =>
    apiClient
      .get<PaginatedResponse<AdminArticleSummary>>(endpoints.admin.articles, { params })
      .then((res) => res.data),

  reviewArticle: (articleId: string, payload: ArticleReviewRequest) =>
    apiClient
      .patch<ArticleReviewResponse>(endpoints.admin.reviewArticle(articleId), payload)
      .then((res) => res.data),

  // ContentListResponse — {content} only, no pagination metadata,
  // confirmed against the real OpenAPI schema (consistent with
  // bookmarks/comments/quiz-attempts).
  commentQueue: (params: { page?: number; size?: number } = {}) =>
    apiClient
      .get<ContentListResponse<ModerationQueueItem>>(endpoints.admin.commentQueue, {
        params,
      })
      .then((res) => res.data),

  moderateComment: (commentId: string, payload: ModerateCommentRequest) =>
    apiClient
      .patch<ModerateCommentResponse>(endpoints.admin.moderateComment(commentId), payload)
      .then((res) => res.data),

  users: (params: AdminUserListParams = {}) =>
    apiClient
      .get<PaginatedResponse<AdminUserSummary>>(endpoints.admin.users, { params })
      .then((res) => res.data),

  updateUserRole: (userId: string, payload: UpdateUserRoleRequest) =>
    apiClient
      .patch<AdminUserSummary>(endpoints.admin.updateUserRole(userId), payload)
      .then((res) => res.data),

  updateUserStatus: (userId: string, payload: UpdateUserStatusRequest) =>
    apiClient
      .patch<AdminUserSummary>(endpoints.admin.updateUserStatus(userId), payload)
      .then((res) => res.data),

  createUser: (payload: CreateUserRequest) =>
    apiClient
      .post<AdminUserSummary>(endpoints.admin.createUser, payload)
      .then((res) => res.data),
};
