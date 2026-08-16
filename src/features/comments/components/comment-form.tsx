"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCreateComment } from "../hooks/use-comments";

export function CommentForm({ articleId }: { articleId: string }) {
  const [body, setBody] = useState("");
  const createComment = useCreateComment(articleId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    // Per spec: if posting fails, the typed text stays in the form
    // (we simply don't clear `body` in onError) rather than being lost.
    createComment.mutate(trimmed, { onSuccess: () => setBody("") });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="new-comment" className="sr-only">
        Write a comment
      </label>
      <Textarea
        id="new-comment"
        placeholder="Ask a question or share your experience…"
        value={body}
        maxLength={2000}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
      />
      {createComment.isError && (
        <p role="alert" className="text-destructive text-sm">
          {createComment.error.message}
        </p>
      )}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={!body.trim() || createComment.isPending}
        >
          {createComment.isPending && <Loader2Icon className="animate-spin" />}
          Post comment
        </Button>
      </div>
    </form>
  );
}
