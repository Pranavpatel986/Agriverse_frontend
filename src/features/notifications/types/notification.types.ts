import type { IsoDateTime, PublicId } from "@/shared/types/api";

/** payload shape varies by type — see NotificationService.create() call
 *  sites on the backend for what each type actually puts in it. Typed
 *  loosely here and narrowed per-type in the renderer rather than with a
 *  discriminated union, since new notification types are expected to be
 *  added on the backend without a matching frontend release every time. */
export interface NotificationPayload {
  articleId?: string;
  articleSlug?: string;
  articleTitle?: string;
  commentId?: string;
  replierName?: string;
  decision?: "approve" | "reject";
  feedback?: string;
  [key: string]: unknown;
}

export type NotificationType = "comment_reply" | "moderation_status" | string;

export interface AppNotification {
  id: PublicId;
  type: NotificationType;
  payload: NotificationPayload;
  isRead: boolean;
  createdAt: IsoDateTime;
}

export interface NotificationList {
  content: AppNotification[];
  unreadCount: number;
}
