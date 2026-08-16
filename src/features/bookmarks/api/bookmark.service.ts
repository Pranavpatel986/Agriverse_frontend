import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { ContentListResponse } from "@/shared/types/api";
import type {
  Bookmark,
  BookmarkListParams,
  CreateBookmarkRequest,
  CreateBookmarkResponse,
} from "../types/bookmark.types";

export const bookmarkService = {
  // GET /bookmarks returns ContentListResponseBookmarkResponse — just
  // {content}, no totalElements/totalPages/page (confirmed against the
  // real OpenAPI schema; the pagination query params it accepts don't
  // actually come back with any total count).
  list: (params: BookmarkListParams = {}) =>
    apiClient
      .get<ContentListResponse<Bookmark>>(endpoints.bookmarks.list, { params })
      .then((res) => res.data),

  create: (payload: CreateBookmarkRequest) =>
    apiClient
      .post<CreateBookmarkResponse>(endpoints.bookmarks.create, payload)
      .then((res) => res.data),

  remove: (bookmarkId: string) =>
    apiClient.delete<void>(endpoints.bookmarks.remove(bookmarkId)).then(() => undefined),
};
