import Image from "next/image";
import Link from "next/link";
import { SparklesIcon, FileTextIcon } from "lucide-react";
import { ROUTES } from "@/config/routes";
import type {
  ArticleSummary,
  RecommendedArticle,
} from "@/features/articles/types/article.types";

interface RecommendationCardProps {
  /**
   * Two real shapes flow through here: RelatedArticlesRail passes a full
   * ArticleSummary (has heroImageUrl/category, no reason), and
   * RecommendationRail passes a RecommendedArticle (id/title/slug/reason
   * only, per the actual /recommendations response — no image or
   * category). Both are handled explicitly rather than assuming either
   * field set is always present.
   */
  article: ArticleSummary | RecommendedArticle;
  reason?: string;
}

export function RecommendationCard({ article, reason }: RecommendationCardProps) {
  const heroImageUrl = "heroImageUrl" in article ? article.heroImageUrl : undefined;

  return (
    <Link
      href={ROUTES.article(article.slug)}
      className="group border-border bg-card flex gap-3 rounded-lg border p-3 transition-shadow hover:shadow-md"
    >
      <div className="bg-muted relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md">
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt="" fill sizes="64px" className="object-cover" />
        ) : (
          <FileTextIcon className="text-muted-foreground size-6" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="group-hover:text-primary line-clamp-2 text-sm leading-snug font-medium">
          {article.title}
        </h3>
        {reason && (
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <SparklesIcon className="text-accent size-3 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{reason}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
