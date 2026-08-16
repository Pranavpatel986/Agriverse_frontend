import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../api/admin.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type {
  AdminArticleListParams,
  AdminUserListParams,
  ArticleReviewRequest,
  ArticleReviewResponse,
  CreateUserRequest,
  ModerateCommentRequest,
  ModerateCommentResponse,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
} from "../types/admin.types";

export function useArticlesInReview(params: AdminArticleListParams = {}) {
  return useQuery({
    queryKey: ["admin", "articles", params],
    queryFn: () => adminService.articlesInReview({ status: "in_review", ...params }),
  });
}

/**
 * Deliberately NOT optimistic — per the spec, "a failed moderation
 * action shows an inline error on that row and leaves the item in the
 * queue rather than optimistically removing it." The row only
 * disappears once the server confirms, via the list refetch below.
 */
export function useReviewArticle() {
  const queryClient = useQueryClient();
  return useMutation<
    ArticleReviewResponse,
    AppError,
    { articleId: string; payload: ArticleReviewRequest }
  >({
    mutationFn: async ({ articleId, payload }) => {
      try {
        return await adminService.reviewArticle(articleId, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
    },
  });
}

export function useCommentQueue() {
  return useQuery({
    queryKey: ["admin", "comment-queue"],
    queryFn: () => adminService.commentQueue({ size: 50 }),
  });
}

export function useModerateComment() {
  const queryClient = useQueryClient();
  return useMutation<
    ModerateCommentResponse,
    AppError,
    { commentId: string; payload: ModerateCommentRequest }
  >({
    mutationFn: async ({ commentId, payload }) => {
      try {
        return await adminService.moderateComment(commentId, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "comment-queue"] });
    },
  });
}

export function useAdminUsers(params: AdminUserListParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminService.users(params),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    AppError,
    { userId: string; payload: UpdateUserRoleRequest }
  >({
    mutationFn: async ({ userId, payload }) => {
      try {
        return await adminService.updateUserRole(userId, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    AppError,
    { userId: string; payload: UpdateUserStatusRequest }
  >({
    mutationFn: async ({ userId, payload }) => {
      try {
        return await adminService.updateUserStatus(userId, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation<unknown, AppError, CreateUserRequest>({
    mutationFn: async (payload) => {
      try {
        return await adminService.createUser(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
