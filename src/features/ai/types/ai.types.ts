/**
 * POST /api/v1/ai/chat exists and is fully functional per the Backend
 * Reference doc (§6.13/§7) — RAG over published articles, grounded via
 * Anthropic, with a server-enforced disclaimer. It is NOT documented in
 * the OpenAPI spec at all (a gap on the backend's own docs, not
 * something missed here), so this request/response shape is inferred
 * from the prose description, not a checked schema. Verify against the
 * real response the first time this is called and adjust field names
 * if anything doesn't match — same treatment as ArticleEditResponse.
 */
export interface AiChatRequest {
  message: string;
}

export interface AiChatSource {
  articleId: string;
  title: string;
  slug: string;
}

export interface AiChatResponse {
  answer: string;
  /** The doc says the backend "enforces a server-side disclaimer, not
   *  trusted from the LLM's own output" — modeled as optional so the
   *  widget can fall back to its own generic disclaimer text if this
   *  field turns out not to exist or be named differently. */
  disclaimer?: string;
  sources?: AiChatSource[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: AiChatSource[];
}
