import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roadmapService } from "../api/roadmap.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { RoadmapDetail, RoadmapListParams, CreateRoadmapInput } from "../types/roadmap.types";

export function useRoadmaps(params: RoadmapListParams = {}) {
  return useQuery({
    queryKey: ["roadmaps", "list", params],
    queryFn: () => roadmapService.list(params),
  });
}

export function useRoadmap(slug: string) {
  return useQuery({
    queryKey: ["roadmaps", "detail", slug],
    queryFn: () => roadmapService.bySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();
  return useMutation<{ id: string; slug: string }, AppError, CreateRoadmapInput>({
    mutationFn: async (payload) => {
      try {
        return await roadmapService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roadmaps", "list"] }),
  });
}

/**
 * Optimistically updates the cached RoadmapDetail's progress and (for
 * "completed") the count, then rolls back on failure — per the spec:
 * "updates the progress bar and step state optimistically... a failed
 * update reverts the optimistic UI change and shows an inline error on
 * that step only." The rollback is scoped to this one roadmap's query
 * key, so a failure never touches unrelated cached data.
 */
export function useUpdateRoadmapProgress(roadmapId: string, slug: string) {
  const queryClient = useQueryClient();
  const queryKey = ["roadmaps", "detail", slug] as const;

  return useMutation<
    { completedSteps: number; isCompleted: boolean },
    AppError,
    { stepId: string; completed: boolean },
    { previous: RoadmapDetail | undefined }
  >({
    mutationFn: async (payload) => {
      try {
        return await roadmapService.updateProgress(roadmapId, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onMutate: async ({ completed }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<RoadmapDetail>(queryKey);

      queryClient.setQueryData<RoadmapDetail>(queryKey, (old) =>
        old
          ? {
              ...old,
              progress: {
                completedSteps: Math.max(
                  0,
                  (old.progress?.completedSteps ?? 0) + (completed ? 1 : -1),
                ),
                isCompleted: false, // server confirms true completion; see onSuccess
              },
            }
          : old,
      );

      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<RoadmapDetail>(queryKey, (old) =>
        old ? { ...old, progress: data } : old,
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });
}
