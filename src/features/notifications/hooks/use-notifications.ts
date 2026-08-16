import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../api/notification.service";
import { useCurrentUser } from "@/features/auth/hooks/use-role";

const NOTIFICATIONS_KEY = ["notifications"] as const;

/**
 * Polls every 60s while the tab is active. A push channel (WebSocket/SSE)
 * would be the real answer, but nothing like that exists anywhere else in
 * this codebase yet (search results, comments, everything else is
 * fetch-on-navigate) — polling is consistent with that, not a shortcut
 * specific to this feature.
 */
export function useNotifications() {
  const { isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => notificationService.list({ size: 20 }),
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}
