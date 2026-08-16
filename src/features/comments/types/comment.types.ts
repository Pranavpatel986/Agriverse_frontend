import type { IsoDateTime, PublicId } from "@/shared/types/api";

export interface CommentAuthor {
  displayName: string;
  avatarUrl?: string;
}

export interface Comment {
  id: PublicId;
  body: string;
  user: CommentAuthor;
  likeCount: number;
  replyCount: number;
  createdAt: IsoDateTime;
  /** Client-only, derived from a like/unlike response the current user
   *  triggered this session — the list endpoint doesn't say whether the
   *  viewer has already liked a comment, so this starts undefined and is
   *  only set optimistically once the viewer acts. */
  viewerHasLiked?: boolean;
}

export interface CreateCommentRequest {
  body: string;
}

export interface CreateCommentResponse {
  id: PublicId;
  status: "visible" | "flagged";
}

export interface Reply {
  id: PublicId;
  body: string;
  user: CommentAuthor;
  likeCount: number;
  createdAt: IsoDateTime;
}

export interface CreateReplyRequest {
  body: string;
}

export interface CreateReplyResponse {
  id: PublicId;
}

export interface LikeResponse {
  likeCount: number;
}
