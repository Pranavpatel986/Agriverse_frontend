"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { SearchIcon, TagIcon, FileTextIcon, FolderIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useAutocomplete } from "@/features/search/hooks/use-search";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { ROUTES } from "@/config/routes";
import { cn } from "@/shared/lib/utils";
import type { AutocompleteSuggestionType } from "@/features/search/types/search.types";

const SUGGESTION_ICONS: Record<AutocompleteSuggestionType, typeof FileTextIcon> = {
  article: FileTextIcon,
  category: FolderIcon,
  tag: TagIcon,
};

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  className,
  placeholder = "Search crops, diseases, schemes…",
  autoFocus,
}: SearchBarProps) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 250);
  const { data: suggestions } = useAutocomplete(debouncedQuery);

  function submitSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    setIsOpen(false);
    router.push(`${ROUTES.search}?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <Popover open={isOpen && !!suggestions?.length} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <form
          role="search"
          className={cn("relative w-full", className)}
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(query);
          }}
        >
          <label htmlFor={inputId} className="sr-only">
            Search AgriVerse
          </label>
          <SearchIcon
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            id={inputId}
            type="search"
            autoFocus={autoFocus}
            placeholder={placeholder}
            value={query}
            className="pl-9"
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
          />
        </form>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[--radix-popover-trigger-width] p-1"
      >
        <ul role="listbox" aria-label="Search suggestions">
          {suggestions?.map((suggestion) => {
            const Icon = SUGGESTION_ICONS[suggestion.type];
            return (
              <li key={`${suggestion.type}-${suggestion.text}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="hover:bg-muted flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm"
                  onClick={() => submitSearch(suggestion.text)}
                >
                  <Icon className="text-muted-foreground size-4" />
                  {suggestion.text}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
