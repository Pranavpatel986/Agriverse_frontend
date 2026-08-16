"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SendIcon, SparklesIcon, Loader2Icon, MessageCircleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { useAiChat } from "../hooks/use-ai-chat";
import { useCurrentUser } from "@/features/auth/hooks/use-role";
import { ROUTES } from "@/config/routes";
import type { ChatMessage } from "../types/ai.types";

const GENERIC_DISCLAIMER =
  "AI-generated based on AgriVerse articles — verify anything critical (dosages, deadlines, prices) against the original source.";

export function AiChatWidget() {
  const { isAuthenticated } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chat = useAiChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chat.isPending]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || chat.isPending) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    chat.mutate(
      { message: trimmed },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.answer, sources: data.sources },
          ]);
        },
      },
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-30 size-14 rounded-full shadow-lg"
        aria-label="Ask the AgriVerse AI assistant"
      >
        <SparklesIcon className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <SparklesIcon className="size-4 text-primary" />
              AgriVerse AI Assistant
            </SheetTitle>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
                <MessageCircleIcon className="size-8" />
                <p>Ask about crop care, diseases, schemes, or anything else on AgriVerse.</p>
              </div>
            )}

            {messages.map((message, i) => (
              <div
                key={i}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    message.role === "user"
                      ? "bg-primary text-primary-foreground max-w-[85%] rounded-lg px-3 py-2 text-sm"
                      : "bg-muted max-w-[85%] space-y-2 rounded-lg px-3 py-2 text-sm"
                  }
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.role === "assistant" && (
                    <>
                      {message.sources && message.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {message.sources.map((source) => (
                            <Link
                              key={source.articleId}
                              href={ROUTES.article(source.slug)}
                              className="link-underline text-primary text-xs font-medium"
                            >
                              {source.title}
                            </Link>
                          ))}
                        </div>
                      )}
                      <p className="text-muted-foreground text-xs">{GENERIC_DISCLAIMER}</p>
                    </>
                  )}
                </div>
              </div>
            ))}

            {chat.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}

            {chat.isError && (
              <p role="alert" className="text-destructive text-sm">
                {chat.error.message}
              </p>
            )}
          </div>

          <form onSubmit={handleSend} className="border-border flex gap-2 border-t pt-3">
            <label htmlFor="ai-chat-input" className="sr-only">
              Ask a question
            </label>
            <Input
              id="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              disabled={chat.isPending}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || chat.isPending}>
              <SendIcon className="size-4" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
