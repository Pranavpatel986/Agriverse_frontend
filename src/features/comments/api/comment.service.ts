import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { ContentListResponse, PaginationParams } from "@/shared/types/api";
import type {
  Comment,
  CreateCommentRequest,
  CreateCommentResponse,
  CreateReplyRequest,
  CreateReplyResponse,
  LikeResponse,
} from "../types/comment.types";

export const commentService = {
  // GET /articles/{articleId}/comments accepts page/size params but its
  // response (ContentListResponseCommentResponse) is just {content} —
  // no totalElements/totalPages back, confirmed against the real
  // OpenAPI schema. There's no way to know if more pages exist without
  // guessing from a full page, so CommentsSection uses a simpler
  // "load more" pattern rather than numbered Pagination.
  list: (articleId: string, params: PaginationParams = {}) =>
    apiClient
      .get<ContentListResponse<Comment>>(endpoints.comments.listForArticle(articleId), {
        params,
      })
      .then((res) => res.data),

  create: (articleId: string, payload: CreateCommentRequest) =>
    apiClient
      .post<CreateCommentResponse>(
        endpoints.comments.createForArticle(articleId),
        payload,
      )
      .then((res) => res.data),

  remove: (commentId: string) =>
    apiClient
      .delete<{ message: string }>(endpoints.comments.remove(commentId))
      .then((res) => res.data),

  reply: (commentId: string, payload: CreateReplyRequest) =>
    apiClient
      .post<CreateReplyResponse>(endpoints.comments.replies(commentId), payload)
      .then((res) => res.data),

  like: (commentId: string) =>
    apiClient
      .post<LikeResponse>(endpoints.comments.like(commentId))
      .then((res) => res.data),

  unlike: (commentId: string) =>
    apiClient
      .delete<LikeResponse>(endpoints.comments.like(commentId))
      .then((res) => res.data),
};
