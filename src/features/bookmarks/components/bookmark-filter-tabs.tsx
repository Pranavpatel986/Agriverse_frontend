"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import type { BookmarkEntityType } from "../types/bookmark.types";

export type BookmarkFilter = BookmarkEntityType | "all";

const FILTERS: { value: BookmarkFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "article", label: "Articles" },
  { value: "roadmap", label: "Roadmaps" },
  { value: "quiz", label: "Quizzes" },
];

export function BookmarkFilterTabs({
  value,
  onChange,
}: {
  value: BookmarkFilter;
  onChange: (value: BookmarkFilter) => void;
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as BookmarkFilter)}>
      <TabsList>
        {FILTERS.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
