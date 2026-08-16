"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { BookmarkIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/config/routes";
import { useCurrentUser } from "@/features/auth/hooks/use-role";
import { useCreateBookmark } from "@/features/bookmarks/hooks/use-bookmarks";
import type { ArticleSummary } from "@/features/articles/types/article.types";

interface ArticleCardProps {
  article: ArticleSummary;
  className?: string;
}

/**
 * The one card component reused across Home, Category, and Bookmarks.
 * Search results use a dedicated SearchResultCard instead — the search
 * DTO doesn't carry heroImageUrl/author/readingTime/publishedAt, so
 * forcing it through this component would mean faking those fields.
 */
export function ArticleCard({ article, className }: ArticleCardProps) {
  const { isAuthenticated } = useCurrentUser();
  const createBookmark = useCreateBookmark();

  return (
    <article
      className={cn(
        "group border-border bg-card flex flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md",
        className,
      )}
    >
      <Link
        href={ROUTES.article(article.slug)}
        className="bg-muted relative aspect-video w-full overflow-hidden"
      >
        <Image
          src={article.heroImageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Link href={ROUTES.category(article.category.slug)}>
            <Badge variant="secondary" className="hover:bg-loam-300/60">
              {article.category.name}
            </Badge>
          </Link>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-accent -mr-1.5 size-8"
              aria-label="Bookmark this article"
              onClick={() =>
                createBookmark.mutate({ entityType: "article", entityId: article.id })
              }
            >
              <BookmarkIcon className="size-4" />
            </Button>
          )}
        </div>

        <h3 className="font-display line-clamp-2 text-base leading-snug font-semibold">
          <Link href={ROUTES.article(article.slug)} className="link-underline">
            {article.title}
          </Link>
        </h3>

        <p className="text-muted-foreground line-clamp-2 text-sm">{article.excerpt}</p>

        <div className="text-muted-foreground mt-auto flex items-center justify-between pt-2 text-xs">
          <span>{article.author.displayName}</span>
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3.5" />
            {article.readingTimeMinutes} min ·{" "}
            {format(new Date(article.publishedAt), "MMM d")}
          </span>
        </div>
      </div>
    </article>
  );
}
