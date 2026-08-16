import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/query/query-keys";
import { AppError, toAppError } from "@/shared/lib/api/error";
import { useCurrentUser, useHasMinimumRole } from "@/features/auth/hooks/use-role";
import { dashboardService } from "../api/dashboard.service";
import type {
  ManagedArticleListParams,
  UpdateArticleStatusRequest,
  UpdateArticleStatusResponse,
} from "../types/dashboard.types";

/**
 * Scoped by role per the Software Architecture Document's §10.1 Role &
 * Permission Matrix: Authors can only "edit own" articles, so their
 * queries are always filtered to `authorId: user.id`; Editor/Admin can
 * "publish/edit any article", so the filter is omitted entirely for
 * them rather than also being locked to their own id.
 *
 * ASSUMPTION (flagged, not silently guessed on): this enforces the
 * ownership rule from the frontend by choosing which query params to
 * send. Whether GET /admin/articles ALSO enforces "own only" for an
 * Author server-side (defense in depth) isn't confirmed anywhere in the
 * API docs — worth checking with the backend team.
 */
export function useMyArticles(params: Omit<ManagedArticleListParams, "authorId"> = {}) {
  const { user } = useCurrentUser();
  const canManageAllArticles = useHasMinimumRole("EDITOR");
  const fullParams = canManageAllArticles ? params : { ...params, authorId: user?.id };

  return useQuery({
    queryKey: queryKeys.dashboard.myArticles(fullParams),
    queryFn: () => dashboardService.myArticles(fullParams),
    enabled: canManageAllArticles || Boolean(user?.id),
  });
}

export function useUpdateArticleStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateArticleStatusResponse,
    AppError,
    { articleId: string; payload: UpdateArticleStatusRequest }
  >({
    mutationFn: async ({ articleId, payload }) => {
      try {
        return await dashboardService.updateArticleStatus(articleId, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "my-articles"] });
      toast.success("Article status updated.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useAnalyticsOverview(params: { from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.dashboard.analytics(params),
    queryFn: () => dashboardService.analyticsOverview(params),
  });
}
