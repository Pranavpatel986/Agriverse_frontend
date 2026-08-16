import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { NotificationList } from "../types/notification.types";

export const notificationService = {
  list: (params: { unreadOnly?: boolean; page?: number; size?: number } = {}) =>
    apiClient
      .get<NotificationList>(endpoints.notifications.list, { params })
      .then((res) => res.data),

  markRead: (id: string) =>
    apiClient
      .patch<{ id: string; isRead: boolean }>(endpoints.notifications.markRead(id))
      .then((res) => res.data),

  markAllRead: () =>
    apiClient
      .patch<{ updatedCount: number }>(endpoints.notifications.markAllRead)
      .then((res) => res.data),

  remove: (id: string) =>
    apiClient
      .delete<{ message: string }>(endpoints.notifications.remove(id))
      .then((res) => res.data),
};
