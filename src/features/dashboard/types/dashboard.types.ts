import type { IsoDateTime, PaginationParams, PublicId } from "@/shared/types/api";

export type ArticleStatus = "draft" | "in_review" | "published" | "archived";

export interface ManagedArticleAuthor {
  displayName: string;
}

/** Matches AdminArticleSummaryResponse exactly — confirmed against the
 *  real OpenAPI schema, this list is much leaner than a typical CMS
 *  table: no view count, no updatedAt. If those are wanted, they need
 *  adding to the endpoint; MyArticlesTable only renders what's here. */
export interface ManagedArticle {
  id: PublicId;
  title: string;
  status: ArticleStatus;
  author: ManagedArticleAuthor;
}

export interface ManagedArticleListParams extends PaginationParams {
  authorId?: string;
  status?: ArticleStatus;
}

export interface UpdateArticleStatusRequest {
  // Matches ArticleService.updateStatus's actual transition map on the
  // backend: DRAFT -> IN_REVIEW; IN_REVIEW -> PUBLISHED or back to DRAFT
  // (reviewer rejection); PUBLISHED -> ARCHIVED. "draft" is a valid
  // target (reviewer sending an article back), just never a starting
  // status you'd PATCH to from itself.
  status: Extract<ArticleStatus, "draft" | "in_review" | "published" | "archived">;
}

export interface UpdateArticleStatusResponse {
  id: PublicId;
  status: ArticleStatus;
  publishedAt?: IsoDateTime;
}

/**
 * NOTE (spec conflict, flagged rather than silently resolved): the
 * Frontend Technical Specification's Dashboard page describes this as
 * an "author-scoped view" of GET /admin/analytics/overview, but the
 * REST API Specification documents that exact endpoint as ADMIN-only
 * and returns platform-wide totals (totalUsers, totalArticles, etc.),
 * not per-author numbers. Modeled here exactly as the REST spec
 * documents it — worth confirming with the backend team whether Authors
 * should get a different, author-scoped endpoint instead.
 */
export interface AnalyticsOverview {
  totalUsers: number;
  newUsers: number;
  totalArticles: number;
  totalViews: number;
  pendingModeration: number;
}
