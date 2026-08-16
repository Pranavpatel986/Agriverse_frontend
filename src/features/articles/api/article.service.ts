import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { PaginatedResponse } from "@/shared/types/api";
import type {
  ArticleDetail,
  ArticleEditDetail,
  ArticleListParams,
  ArticleSummary,
  CreateArticleRequest,
  CreateArticleResponse,
  RawArticleDetailResponse,
  UpdateArticleRequest,
} from "../types/article.types";

export const articleService = {
  list: (params: ArticleListParams = {}) =>
    apiClient
      .get<PaginatedResponse<ArticleSummary>>(endpoints.articles.list, { params })
      .then((res) => res.data),

  bySlug: (slug: string) =>
    apiClient
      .get<RawArticleDetailResponse>(endpoints.articles.bySlug(slug))
      .then((res) => normalizeArticleDetail(res.data)),

  forEdit: (id: string) =>
    apiClient.get<ArticleEditDetail>(endpoints.articles.forEdit(id)).then((res) => res.data),

  create: (payload: CreateArticleRequest) =>
    apiClient
      .post<CreateArticleResponse>(endpoints.articles.create, payload)
      .then((res) => res.data),

  update: (id: string, payload: UpdateArticleRequest) =>
    apiClient
      .put<RawArticleDetailResponse>(endpoints.articles.update(id), payload)
      .then((res) => normalizeArticleDetail(res.data)),

  remove: (id: string) =>
    apiClient
      .delete<{ message: string }>(endpoints.articles.remove(id))
      .then((res) => res.data),
};

/** Flattens the wire format's `body: { blocks }` into a bare array — see
 *  RawArticleDetailResponse's doc comment for why this indirection
 *  exists. This is the one place the rest of the app never has to think
 *  about it again. */
function normalizeArticleDetail(raw: RawArticleDetailResponse): ArticleDetail {
  const { body, ...rest } = raw;
  return { ...rest, body: body.blocks };
}
