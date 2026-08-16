import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/query/query-keys";
import { AppError, toAppError } from "@/shared/lib/api/error";
import { bookmarkService } from "../api/bookmark.service";
import type {
  BookmarkListParams,
  CreateBookmarkRequest,
  CreateBookmarkResponse,
} from "../types/bookmark.types";

export function useBookmarks(params: BookmarkListParams = {}) {
  return useQuery({
    queryKey: queryKeys.bookmarks.list(params),
    queryFn: () => bookmarkService.list(params),
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation<CreateBookmarkResponse, AppError, CreateBookmarkRequest>({
    mutationFn: async (payload) => {
      try {
        return await bookmarkService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.lists() });
      toast.success("Saved to your bookmarks.");
    },
    onError: (error) => {
      if (error.status === 409) {
        toast.info("Already in your bookmarks.");
        return;
      }
      toast.error(error.message);
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: async (bookmarkId) => {
      try {
        return await bookmarkService.remove(bookmarkId);
      } catch (error) {
        throw toAppError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.lists() });
    },
    onError: (error) => toast.error(error.message),
  });
}
