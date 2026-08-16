import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/query/query-keys";
import { AppError, toAppError } from "@/shared/lib/api/error";
import { commentService } from "../api/comment.service";
import type { Comment, CreateCommentResponse } from "../types/comment.types";
import type { ContentListResponse } from "@/shared/types/api";

export function useComments(articleId: string, page = 0) {
  return useQuery({
    queryKey: queryKeys.comments.forArticle(articleId, { page }),
    queryFn: () => commentService.list(articleId, { page, size: 20 }),
    enabled: Boolean(articleId),
  });
}

export function useCreateComment(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation<CreateCommentResponse, AppError, string>({
    mutationFn: async (body) => {
      try {
        return await commentService.create(articleId, { body });
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", "article", articleId] });
    },
  });
}

/**
 * Optimistic like/unlike toggle: the UI flips immediately (per the
 * Article page spec's BookmarkButton pattern, applied the same way
 * here) and rolls back on failure rather than waiting on the round trip.
 */
export function useToggleCommentLike(articleId: string) {
  const queryClient = useQueryClient();
  const queryKeyPrefix = ["comments", "article", articleId] as const;

  return useMutation<
    { likeCount: number },
    AppError,
    { commentId: string; currentlyLiked: boolean },
    { previous: [readonly unknown[], ContentListResponse<Comment> | undefined][] }
  >({
    mutationFn: async ({ commentId, currentlyLiked }) => {
      try {
        return currentlyLiked
          ? await commentService.unlike(commentId)
          : await commentService.like(commentId);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onMutate: async ({ commentId, currentlyLiked }) => {
      await queryClient.cancelQueries({ queryKey: queryKeyPrefix });
      const previous = queryClient.getQueriesData<ContentListResponse<Comment>>({
        queryKey: queryKeyPrefix,
      });

      queryClient.setQueriesData<ContentListResponse<Comment>>(
        { queryKey: queryKeyPrefix },
        (old) =>
          old
            ? {
                ...old,
                content: old.content.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        viewerHasLiked: !currentlyLiked,
                        likeCount: comment.likeCount + (currentlyLiked ? -1 : 1),
                      }
                    : comment,
                ),
              }
            : old,
      );

      return { previous };
    },
    onError: (error, _vars, context) => {
      context?.previous?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(error.message);
    },
  });
}
