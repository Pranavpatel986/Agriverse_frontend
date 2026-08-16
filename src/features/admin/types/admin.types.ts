import type { IsoDateTime, PublicId, Role } from "@/shared/types/api";

// --- Article moderation ---------------------------------------------

export interface AdminArticleAuthor {
  displayName: string;
}

export interface AdminArticleSummary {
  id: PublicId;
  title: string;
  status: string;
  author: AdminArticleAuthor;
}

export interface AdminArticleListParams {
  status?: string;
  authorId?: string;
  page?: number;
  size?: number;
}

// Matches AdminArticleService's actual validation exactly: it does
// decision.trim().toLowerCase() and rejects anything except "approve" or
// "reject" with a 400 — not the past-tense "approved"/"rejected" this used
// to send, which is why every review action failed with "decision must be
// 'approve' or 'reject'" no matter what the button said.
export type ReviewDecision = "approve" | "reject";

export interface ArticleReviewRequest {
  decision: ReviewDecision;
  feedback?: string;
}

export interface ArticleReviewResponse {
  id: PublicId;
  status: string;
}

// --- Comment moderation ------------------------------------------------

export interface ModerationQueueItem {
  id: PublicId;
  entityType: string; // "comment" | "reply"
  body: string;
  user: AdminArticleAuthor;
  flagReason?: string;
  createdAt: IsoDateTime;
}

export type ModerationAction = "approve" | "remove";

export interface ModerateCommentRequest {
  action: ModerationAction;
}

export interface ModerateCommentResponse {
  id: PublicId;
  status: string;
}

// --- User management ----------------------------------------------------

export type UserStatus = "active" | "suspended";

export interface AdminUserSummary {
  id: PublicId;
  fullName: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: IsoDateTime;
  lastLoginAt?: IsoDateTime;
}

export interface AdminUserListParams {
  role?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface UpdateUserRoleRequest {
  role: Role;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
  reason?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}
