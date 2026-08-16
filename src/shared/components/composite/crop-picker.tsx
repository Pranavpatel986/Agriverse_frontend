"use client";

import { useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { useCrops } from "@/features/crops/hooks/use-crops";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";

interface CropPickerProps {
  value: string | undefined;
  onChange: (cropId: string | undefined) => void;
  placeholder?: string;
}

/**
 * The one crop-search-and-select control, reused as-is by Disease
 * Library, Scheme Finder, Machinery Directory, and Market Prices &
 * Weather — the Frontend Spec explicitly calls this a shared pattern
 * across those four pages, so it lives here rather than being
 * reimplemented per page.
 */
export function CropPicker({
  value,
  onChange,
  placeholder = "Select a crop",
}: CropPickerProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const { data, isLoading } = useCrops({ q: debouncedQuery, size: 20 });

  return (
    <Select value={value} onValueChange={(next) => onChange(next || undefined)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-1">
          <Input
            placeholder="Search crops…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            className="h-8"
          />
        </div>
        {isLoading && (
          <div className="text-muted-foreground px-2 py-1.5 text-sm">Searching…</div>
        )}
        {!isLoading && data?.content.length === 0 && (
          <div className="text-muted-foreground px-2 py-1.5 text-sm">No crops found</div>
        )}
        {data?.content.map((crop) => (
          <SelectItem key={crop.id} value={crop.id}>
            {crop.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
