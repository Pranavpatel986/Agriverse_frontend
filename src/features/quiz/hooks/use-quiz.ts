import { useMutation, useQuery } from "@tanstack/react-query";
import { quizService } from "../api/quiz.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import { useCurrentUser } from "@/features/auth/hooks/use-role";
import type {
  QuizAttemptResult,
  SubmitQuizAttemptRequest,
  CreateQuizInput,
} from "../types/quiz.types";

export function useQuiz(id: string) {
  return useQuery({
    queryKey: ["quiz", "detail", id],
    queryFn: () => quizService.byId(id),
    enabled: Boolean(id),
  });
}

export function useSubmitQuizAttempt(id: string) {
  return useMutation<QuizAttemptResult, AppError, SubmitQuizAttemptRequest>({
    mutationFn: async (payload) => {
      try {
        return await quizService.submitAttempt(id, payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
  });
}

/** Past-attempts panel is only shown for signed-in users revisiting a
 *  quiz — disabled entirely for logged-out visitors rather than firing
 *  a request that would 401. */
export function useMyQuizAttempts(id: string) {
  const { isAuthenticated } = useCurrentUser();
  return useQuery({
    queryKey: ["quiz", "my-attempts", id],
    queryFn: () => quizService.myAttempts(id),
    enabled: Boolean(id) && isAuthenticated,
  });
}

export function useCreateQuiz() {
  return useMutation<{ id: string }, AppError, CreateQuizInput>({
    mutationFn: async (payload) => {
      try {
        return await quizService.create(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
  });
}
