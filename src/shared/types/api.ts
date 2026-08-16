/**
 * Types that mirror the REST API Specification's "Common Conventions"
 * section exactly. These are the only shapes that should appear at the
 * boundary between the Axios client and feature-level service methods —
 * every endpoint's request/response DTOs live in that feature's
 * `api/*.types.ts` file and compose these where relevant.
 */

/** All client-facing identifiers are opaque UUID strings (never raw PKs). */
export type PublicId = string;

/** ISO 8601 UTC timestamp string, e.g. "2026-07-25T10:15:00Z". */
export type IsoDateTime = string;

/**
 * Standard paginated list envelope returned by every list endpoint,
 * using zero-indexed `page`.
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
}

/**
 * The OTHER list envelope some endpoints use — just `{content}`, no
 * pagination metadata at all (confirmed against the real OpenAPI schema
 * for bookmarks, comments, and the category tree). Do not assume every
 * list endpoint is PaginatedResponse; check the actual schema per
 * endpoint, since these two shapes are used inconsistently across the
 * API.
 */
export interface ContentListResponse<T> {
  content: T[];
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

/** Field-level validation error, part of the standard error envelope. */
export interface ApiFieldError {
  field: string;
  message: string;
}

/**
 * Standard error response shape returned by every non-2xx response.
 * `details` is only present for 400 validation failures.
 */
export interface ApiErrorResponse {
  timestamp: IsoDateTime;
  status: number;
  error: string;
  requestId: string;
  details?: ApiFieldError[];
}

/**
 * Roles referenced throughout the API, matching the Software Architecture
 * Document's Role/Permission model (Section 10).
 */
export const ROLES = ["READER", "AUTHOR", "EDITOR", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];
