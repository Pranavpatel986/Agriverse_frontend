"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { ArticleContentBlock } from "@/features/articles/types/article.types";

type Block = ArticleContentBlock;

interface BlockFieldsProps<T extends Block> {
  block: T;
  onChange: (next: T) => void;
}

export function HeadingBlockFields({
  block,
  onChange,
}: BlockFieldsProps<Extract<Block, { type: "heading" }>>) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      <div className="space-y-1">
        <Label className="text-xs">Level</Label>
        <Select
          value={String(block.level)}
          onValueChange={(v) => onChange({ ...block, level: Number(v) as 2 | 3 | 4 })}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Heading text</Label>
        <Input
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
        />
      </div>
    </div>
  );
}

export function ParagraphBlockFields({
  block,
  onChange,
}: BlockFieldsProps<Extract<Block, { type: "paragraph" }>>) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">
        Paragraph HTML{" "}
        <span className="text-muted-foreground font-normal">
          (basic tags like &lt;strong&gt;, &lt;a&gt; — rendered as-is, no WYSIWYG yet)
        </span>
      </Label>
      <Textarea
        rows={4}
        value={block.html}
        onChange={(e) => onChange({ ...block, html: e.target.value })}
      />
    </div>
  );
}

export function ImageBlockFields({
  block,
  onChange,
}: BlockFieldsProps<Extract<Block, { type: "image" }>>) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label className="text-xs">
          Image URL{" "}
          <span className="text-muted-foreground font-normal">
            (no upload endpoint exists yet — paste a hosted URL)
          </span>
        </Label>
        <Input
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Alt text (required for a11y)</Label>
          <Input
            value={block.alt}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Caption (optional)</Label>
          <Input
            value={block.caption ?? ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export function TableBlockFields({
  block,
  onChange,
}: BlockFieldsProps<Extract<Block, { type: "table" }>>) {
  function updateHeader(index: number, value: string) {
    const headers = [...block.headers];
    headers[index] = value;
    onChange({ ...block, headers });
  }

  function addColumn() {
    onChange({
      ...block,
      headers: [...block.headers, `Column ${block.headers.length + 1}`],
      rows: block.rows.map((row) => [...row, ""]),
    });
  }

  function updateCell(rowIndex: number, colIndex: number, value: string) {
    const rows = block.rows.map((row, r) =>
      r === rowIndex ? row.map((c, ci) => (ci === colIndex ? value : c)) : row,
    );
    onChange({ ...block, rows });
  }

  function addRow() {
    onChange({ ...block, rows: [...block.rows, block.headers.map(() => "")] });
  }

  function removeRow(rowIndex: number) {
    onChange({ ...block, rows: block.rows.filter((_, r) => r !== rowIndex) });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Table</Label>
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="outline" onClick={addColumn}>
            <PlusIcon className="size-3" /> Column
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={addRow}>
            <PlusIcon className="size-3" /> Row
          </Button>
        </div>
      </div>
      <div className="border-border overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {block.headers.map((header, i) => (
                <th key={i} className="p-1">
                  <Input
                    value={header}
                    onChange={(e) => updateHeader(i, e.target.value)}
                    className="h-8 text-xs font-medium"
                  />
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="h-8 text-xs"
                    />
                  </td>
                ))}
                <td>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label="Remove row"
                    onClick={() => removeRow(rowIndex)}
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FaqBlockFields({
  block,
  onChange,
}: BlockFieldsProps<Extract<Block, { type: "faq" }>>) {
  function updateItem(index: number, field: "question" | "answer", value: string) {
    const items = block.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...block, items });
  }

  function addItem() {
    onChange({ ...block, items: [...block.items, { question: "", answer: "" }] });
  }

  function removeItem(index: number) {
    onChange({ ...block, items: block.items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">FAQ items</Label>
        <Button type="button" size="sm" variant="outline" onClick={addItem}>
          <PlusIcon className="size-3" /> Add question
        </Button>
      </div>
      {block.items.map((item, i) => (
        <div key={i} className="border-border space-y-1 rounded-md border p-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Question {i + 1}</Label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6"
              aria-label={`Remove question ${i + 1}`}
              onClick={() => removeItem(i)}
            >
              <TrashIcon className="size-3" />
            </Button>
          </div>
          <Input
            value={item.question}
            onChange={(e) => updateItem(i, "question", e.target.value)}
          />
          <Textarea
            rows={2}
            value={item.answer}
            onChange={(e) => updateItem(i, "answer", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
