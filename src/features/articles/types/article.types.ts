import type { IsoDateTime, PaginationParams, PublicId } from "@/shared/types/api";

export interface ArticleCategoryRef {
  name: string;
  slug: string;
}

export interface ArticleAuthorRef {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

/** GET /articles — one item of `content[]`. */
export interface ArticleSummary {
  id: PublicId;
  title: string;
  slug: string;
  excerpt: string;
  heroImageUrl: string;
  category: ArticleCategoryRef;
  author: ArticleAuthorRef;
  readingTimeMinutes: number;
  publishedAt: IsoDateTime;
}

/** Structured content blocks — headings, paragraphs, images, tables, FAQs.
 *  Modeled as a discriminated union so RichTextViewer can switch on
 *  `type` exhaustively; extend as the backend adds block types. */
export type ArticleContentBlock =
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "paragraph"; html: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "faq"; items: { question: string; answer: string }[] };

export interface ArticleSeo {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

/** Exact wire shape of GET /articles/{slug} — note `body` is wrapped in
 *  `{ blocks }`, not a bare array; article.service normalizes this away
 *  (see ArticleDetail) so nothing else in the app has to know about it. */
export interface RawArticleDetailResponse {
  id: PublicId;
  title: string;
  body: { blocks: ArticleContentBlock[] };
  tags: string[];
  category: ArticleCategoryRef;
  author: ArticleAuthorRef;
  seo: ArticleSeo;
  /** NOT in the REST API Specification's documented response for this
   *  endpoint, but the Frontend Technical Specification's ArticleHeader
   *  ("reading time, published date") and SEO requirements (OG/Twitter
   *  image, Article JSON-LD datePublished/image) both need them. Modeled
   *  as optional so the page degrades gracefully instead of crashing if
   *  the backend doesn't send them yet — worth confirming with the
   *  backend team which spec is authoritative. */
  heroImageUrl?: string;
  publishedAt?: IsoDateTime;
  readingTimeMinutes?: number;
  subtitle?: string;
}

/** Normalized shape every component in the app actually consumes. */
export interface ArticleDetail {
  id: PublicId;
  title: string;
  subtitle?: string;
  body: ArticleContentBlock[];
  tags: string[];
  category: ArticleCategoryRef;
  author: ArticleAuthorRef;
  seo: ArticleSeo;
  heroImageUrl?: string;
  publishedAt?: IsoDateTime;
  readingTimeMinutes?: number;
}

export interface ArticleListParams extends PaginationParams {
  categorySlug?: string;
  tag?: string;
  authorId?: PublicId;
  sort?: "latest" | "popular";
}

/** POST /articles. Matches CreateArticleRequest exactly — `body` is the
 *  wire format ({blocks}), not the flattened array ArticleDetail uses
 *  elsewhere, since this is what we SEND, not what normalizeArticleDetail
 *  produces from a response. `tagIds` requires real tag UUIDs, but no
 *  endpoint exists anywhere in the API to list or create tags — so this
 *  always sends an empty array for now. See the Roadmap in README.md. */
export interface CreateArticleRequest {
  title: string;
  subtitle?: string;
  categoryId: string;
  tagIds: string[];
  body: { blocks: ArticleContentBlock[] };
  heroImageUrl?: string;
}

export interface CreateArticleResponse {
  id: PublicId;
  slug: string;
  status: string;
}

export type UpdateArticleRequest = Partial<CreateArticleRequest>;

/** GET /articles/{id}/edit — full detail for the edit form, any status.
 *  Distinct from ArticleDetail (the public reader view): carries raw
 *  categoryId/tagIds so the form can round-trip them back into
 *  UpdateArticleRequest, not just display names. */
export interface ArticleEditDetail {
  id: PublicId;
  title: string;
  subtitle?: string;
  slug: string;
  heroImageUrl?: string;
  body: { blocks: ArticleContentBlock[] };
  status: string;
  categoryId: PublicId;
  categoryName: string;
  tagIds: PublicId[];
  tagNames: string[];
  authorId: PublicId;
  authorDisplayName: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  publishedAt?: IsoDateTime;
}

/** GET /recommendations (current user) — matches RecommendedArticleResponse
 *  exactly: just enough to link to the article, plus why it was picked.
 *  Deliberately NOT a full ArticleSummary — no image/category/author.
 *  (GET /articles/{id}/recommendations, used by RelatedArticlesRail, is a
 *  different endpoint that DOES return full ArticleSummaryResponse[],
 *  just without a `reason` field — see recommendation.service.ts.) */
export interface RecommendedArticle {
  id: PublicId;
  title: string;
  slug: string;
  reason: string;
}
