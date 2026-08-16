import { apiClient } from "@/shared/lib/api/client";
import type { AiChatRequest, AiChatResponse } from "../types/ai.types";

export const aiService = {
  chat: (payload: AiChatRequest) =>
    apiClient.post<AiChatResponse>("/ai/chat", payload).then((res) => res.data),
};
