"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  GripVerticalIcon,
  HeadingIcon,
  ImageIcon,
  ListIcon,
  TableIcon,
  TrashIcon,
  TypeIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  FaqBlockFields,
  HeadingBlockFields,
  ImageBlockFields,
  ParagraphBlockFields,
  TableBlockFields,
} from "./block-field-editors";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import type { ArticleContentBlock } from "../types/article.types";

const BLOCK_TEMPLATES: Record<ArticleContentBlock["type"], () => ArticleContentBlock> = {
  heading: () => ({ type: "heading", level: 2, text: "" }),
  paragraph: () => ({ type: "paragraph", html: "" }),
  image: () => ({ type: "image", url: "", alt: "" }),
  table: () => ({ type: "table", headers: ["Column 1", "Column 2"], rows: [["", ""]] }),
  faq: () => ({ type: "faq", items: [{ question: "", answer: "" }] }),
};

const BLOCK_LABELS: Record<
  ArticleContentBlock["type"],
  { label: string; icon: typeof TypeIcon }
> = {
  heading: { label: "Heading", icon: HeadingIcon },
  paragraph: { label: "Paragraph", icon: TypeIcon },
  image: { label: "Image", icon: ImageIcon },
  table: { label: "Table", icon: TableIcon },
  faq: { label: "FAQ", icon: ListIcon },
};

interface BlockEditorProps {
  blocks: ArticleContentBlock[];
  onChange: (blocks: ArticleContentBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  function addBlock(type: ArticleContentBlock["type"]) {
    onChange([...blocks, BLOCK_TEMPLATES[type]()]);
  }

  function updateBlock(index: number, next: ArticleContentBlock) {
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <EmptyState
          title="No content yet"
          description="Add your first block below to get started."
        />
      )}

      {blocks.map((block, index) => {
        const { label, icon: Icon } = BLOCK_LABELS[block.type];
        return (
          <div key={index} className="border-border bg-card rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <GripVerticalIcon className="size-3.5" />
                <Icon className="size-3.5" />
                {label}
              </span>
              <div className="flex gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  disabled={index === 0}
                  aria-label="Move block up"
                  onClick={() => moveBlock(index, -1)}
                >
                  <ChevronUpIcon className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  disabled={index === blocks.length - 1}
                  aria-label="Move block down"
                  onClick={() => moveBlock(index, 1)}
                >
                  <ChevronDownIcon className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive size-7"
                  aria-label="Remove block"
                  onClick={() => removeBlock(index)}
                >
                  <TrashIcon className="size-3.5" />
                </Button>
              </div>
            </div>

            {block.type === "heading" && (
              <HeadingBlockFields block={block} onChange={(b) => updateBlock(index, b)} />
            )}
            {block.type === "paragraph" && (
              <ParagraphBlockFields
                block={block}
                onChange={(b) => updateBlock(index, b)}
              />
            )}
            {block.type === "image" && (
              <ImageBlockFields block={block} onChange={(b) => updateBlock(index, b)} />
            )}
            {block.type === "table" && (
              <TableBlockFields block={block} onChange={(b) => updateBlock(index, b)} />
            )}
            {block.type === "faq" && (
              <FaqBlockFields block={block} onChange={(b) => updateBlock(index, b)} />
            )}
          </div>
        );
      })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline">
            + Add block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {(Object.keys(BLOCK_LABELS) as ArticleContentBlock["type"][]).map((type) => {
            const { label, icon: Icon } = BLOCK_LABELS[type];
            return (
              <DropdownMenuItem key={type} onClick={() => addBlock(type)}>
                <Icon className="size-4" />
                {label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
