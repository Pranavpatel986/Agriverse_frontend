import { useMutation } from "@tanstack/react-query";
import { aiService } from "../api/ai.service";
import { AppError, toAppError } from "@/shared/lib/api/error";
import type { AiChatRequest, AiChatResponse } from "../types/ai.types";

/**
 * No client-side fallback here on purpose — the backend doc is explicit
 * that chat "has no reasonable fallback" and returns a clear error on
 * AI-service failure, unlike semantic recommendations which silently
 * degrade. The widget should surface that error plainly, not pretend to
 * have an answer.
 */
export function useAiChat() {
  return useMutation<AiChatResponse, AppError, AiChatRequest>({
    mutationFn: async (payload) => {
      try {
        return await aiService.chat(payload);
      } catch (error) {
        throw toAppError(error);
      }
    },
  });
}
