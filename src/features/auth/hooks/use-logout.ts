import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/auth-context";

/**
 * Thin wrapper over AuthContext.logout() that also clears the TanStack
 * Query cache — every piece of personalized data (bookmarks, dashboard,
 * recommendations) must disappear from cache on logout, not just the
 * session, or the next user on a shared device could see stale data for
 * a flash before their own fetches resolve.
 */
export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
    },
  });
}
