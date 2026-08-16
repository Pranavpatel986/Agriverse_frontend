"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { CategoryPicker } from "@/features/categories/components/category-picker";
import { BlockEditor } from "./block-editor";
import { useCreateArticle, useUpdateArticle } from "../hooks/use-articles";
import { ROUTES } from "@/config/routes";
import type { ArticleContentBlock, ArticleEditDetail } from "../types/article.types";

interface ArticleFormProps {
  /** Present only when editing an existing article — prefills the form
   *  and switches the submit action from create to update. */
  editing?: ArticleEditDetail;
}

export function ArticleForm({ editing }: ArticleFormProps) {
  const router = useRouter();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle(editing?.id ?? "");
  const mutation = editing ? updateArticle : createArticle;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [subtitle, setSubtitle] = useState(editing?.subtitle ?? "");
  const [categoryId, setCategoryId] = useState<string | undefined>(editing?.categoryId);
  const [heroImageUrl, setHeroImageUrl] = useState(editing?.heroImageUrl ?? "");
  const [blocks, setBlocks] = useState<ArticleContentBlock[]>(editing?.body.blocks ?? []);

  const canSubmit = title.trim().length >= 5 && Boolean(categoryId) && blocks.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) return;

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      categoryId,
      // No /tags endpoint exists anywhere in the API to resolve tag
      // names to the UUIDs this field requires — always empty until
      // one exists. See the Roadmap in README.md. When editing, this
      // means saving currently drops any tags the article already had;
      // flagged rather than silently done, since it's a real regression
      // for an article that had tags before this edit UI existed.
      tagIds: [],
      heroImageUrl: heroImageUrl.trim() || undefined,
      body: { blocks },
    };

    if (editing) {
      updateArticle.mutate(payload, { onSuccess: () => router.push(ROUTES.dashboard) });
    } else {
      createArticle.mutate(payload, { onSuccess: () => router.push(ROUTES.dashboard) });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {editing?.tagNames && editing.tagNames.length > 0 && (
        <Alert>
          <AlertDescription>
            This article has existing tags ({editing.tagNames.join(", ")}) that aren&apos;t
            editable here yet and will be cleared if you save changes.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="article-title">Title</Label>
        <Input
          id="article-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="At least 5 characters"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="article-subtitle">Subtitle (optional)</Label>
        <Input
          id="article-subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <CategoryPicker value={categoryId} onChange={setCategoryId} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="article-hero">
            Hero image URL{" "}
            <span className="text-muted-foreground font-normal">
              (no upload endpoint yet)
            </span>
          </Label>
          <Input
            id="article-hero"
            value={heroImageUrl}
            onChange={(e) => setHeroImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Content</Label>
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </div>

      {mutation.isError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{mutation.error.message}</AlertDescription>
        </Alert>
      )}

      <div className="border-border flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit || mutation.isPending}>
          {mutation.isPending && <Loader2Icon className="animate-spin" />}
          {editing ? "Save changes" : "Save as draft"}
        </Button>
      </div>
    </form>
  );
}
