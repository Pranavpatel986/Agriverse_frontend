import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { ContentListResponse } from "@/shared/types/api";
import type {
  QuizAttemptHistoryItem,
  QuizAttemptResult,
  QuizDetail,
  SubmitQuizAttemptRequest,
  CreateQuizInput,
} from "../types/quiz.types";

export const quizService = {
  byId: (id: string) =>
    apiClient.get<QuizDetail>(endpoints.quizzes.byId(id)).then((res) => res.data),

  submitAttempt: (id: string, payload: SubmitQuizAttemptRequest) =>
    apiClient
      .post<QuizAttemptResult>(endpoints.quizzes.attempts(id), payload)
      .then((res) => res.data),

  // ContentListResponse — {content} only, no pagination metadata,
  // consistent with bookmarks/comments (see shared/types/api.ts).
  myAttempts: (id: string, params: { page?: number; size?: number } = {}) =>
    apiClient
      .get<ContentListResponse<QuizAttemptHistoryItem>>(
        endpoints.quizzes.myAttempts(id),
        {
          params,
        },
      )
      .then((res) => res.data),

  create: (payload: CreateQuizInput) =>
    apiClient.post<{ id: string }>(endpoints.quizzes.create, payload).then((res) => res.data),
};
