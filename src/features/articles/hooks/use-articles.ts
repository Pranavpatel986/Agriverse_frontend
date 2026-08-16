import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import { articleService } from "../api/article.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type {
  ArticleListParams,
  CreateArticleRequest,
  CreateArticleResponse,
  UpdateArticleRequest,
} from "../types/article.types";

/**
 * `params` is included in the query key so distinct filter/sort/page
 * combinations cache independently — e.g. switching category filters
 * never shows a stale previous category's articles while refetching.
 */
export function useArticles(
  params: ArticleListParams = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: () => articleService.list(params),
    enabled: options.enabled ?? true,
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: () => articleService.bySlug(slug),
    enabled: Boolean(slug),
  });
}

// --- Authoring mutations (ArticleForm) --------------------------------

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation<CreateArticleResponse, AppError, CreateArticleRequest>({
    mutationFn: async (payload) => {
      try {
        return await articleService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "my-articles"] });
    },
  });
}

export function useArticleForEdit(id: string) {
  return useQuery({
    queryKey: ["articles", "edit", id],
    queryFn: () => articleService.forEdit(id),
    enabled: Boolean(id),
  });
}

export function useUpdateArticle(id: string) {
  const queryClient = useQueryClient();
  return useMutation<unknown, AppError, UpdateArticleRequest>({
    mutationFn: async (payload) => {
      try {
        return await articleService.update(id, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "my-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles", "edit", id] });
    },
  });
}
