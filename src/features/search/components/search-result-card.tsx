import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { ROUTES } from "@/config/routes";
import type { SearchResultItem } from "../types/search.types";

/**
 * A deliberately separate component from ArticleCard: the search
 * response (SearchResultItem) only carries {id, title, slug, excerpt,
 * highlightedSnippet, category} — no heroImageUrl/author/readingTime/
 * publishedAt — so forcing it through ArticleCard would mean faking
 * those fields (and next/image rejects an empty src outright).
 */
export function SearchResultCard({ result }: { result: SearchResultItem }) {
  return (
    <article className="border-border bg-card rounded-lg border p-4 transition-shadow hover:shadow-md">
      <Link href={ROUTES.category(result.category.slug)}>
        <Badge variant="secondary" className="mb-2">
          {result.category.name}
        </Badge>
      </Link>
      <h3 className="font-display text-base leading-snug font-semibold">
        <Link href={ROUTES.article(result.slug)} className="link-underline">
          {result.title}
        </Link>
      </h3>
      <p
        className="text-muted-foreground [&_em]:bg-harvest-100 [&_em]:text-harvest-700 mt-1.5 line-clamp-2 text-sm [&_em]:font-medium [&_em]:not-italic"
        // Server-controlled search-highlight markup (<em> around matched
        // terms), not user input — safe to render as HTML.
        dangerouslySetInnerHTML={{ __html: result.highlightedSnippet || result.excerpt }}
      />
    </article>
  );
}
