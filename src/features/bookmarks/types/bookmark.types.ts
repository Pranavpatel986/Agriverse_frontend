import type { IsoDateTime, PaginationParams, PublicId } from "@/shared/types/api";

export type BookmarkEntityType = "article" | "roadmap" | "quiz";

/** Shape of `entitySummary` varies by entityType; article is the only
 *  Phase 1 case, so it's modeled directly — extend with a discriminated
 *  union once Roadmap/Quiz bookmarking ships. */
export interface BookmarkArticleSummary {
  title: string;
  slug: string;
}

export interface Bookmark {
  id: PublicId;
  entityType: BookmarkEntityType;
  entityId: PublicId;
  entitySummary: BookmarkArticleSummary;
  createdAt: IsoDateTime;
}

export interface BookmarkListParams extends PaginationParams {
  entityType?: BookmarkEntityType;
}

export interface CreateBookmarkRequest {
  entityType: BookmarkEntityType;
  entityId: PublicId;
}

export interface CreateBookmarkResponse {
  id: PublicId;
}
