import type { Metadata } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { ClockIcon } from "lucide-react";
import { articleService } from "@/features/articles/api/article.service";
import { Breadcrumb } from "@/shared/components/composite/breadcrumb";
import { AuthorCard } from "@/shared/components/composite/author-card";
import { TableOfContents } from "@/shared/components/composite/table-of-contents";
import { RichTextViewer } from "@/shared/components/composite/rich-text-viewer";
import { ShareButtons } from "@/shared/components/composite/share-buttons";
import { TagList } from "@/shared/components/composite/tag-list";
import { BookmarkButton } from "@/shared/components/composite/bookmark-button";
import { RelatedArticlesRail } from "@/shared/components/composite/related-articles-rail";
import { CommentsSection } from "@/features/comments/components/comments-section";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";

export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  try {
    return await articleService.bySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article" };

  return {
    title: article.seo.metaTitle || article.title,
    description: article.seo.metaDescription,
    alternates: { canonical: article.seo.canonicalUrl || ROUTES.article(slug) },
    openGraph: article.heroImageUrl
      ? { title: article.title, images: [article.heroImageUrl] }
      : { title: article.title },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState
          title="Article unavailable"
          description="We couldn't load this article."
        />
      </div>
    );
  }

  const canonicalUrl =
    article.seo.canonicalUrl || `${env.NEXT_PUBLIC_SITE_URL}${ROUTES.article(slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    author: { "@type": "Person", name: article.author.displayName },
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.heroImageUrl ? { image: [article.heroImageUrl] } : {}),
    mainEntityOfPage: canonicalUrl,
  };

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.home },
          { label: article.category.name, href: ROUTES.category(article.category.slug) },
          { label: article.title },
        ]}
        className="mb-6"
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0 space-y-8">
          {/* ArticleHeader */}
          <header className="space-y-4">
            <h1 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-muted-foreground text-lg text-balance">
                {article.subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <AuthorCard author={article.author} />
              <div className="flex items-center gap-4">
                {(article.readingTimeMinutes || article.publishedAt) && (
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <ClockIcon className="size-4" />
                    {article.readingTimeMinutes && `${article.readingTimeMinutes} min`}
                    {article.readingTimeMinutes && article.publishedAt && " · "}
                    {article.publishedAt &&
                      format(new Date(article.publishedAt), "MMM d, yyyy")}
                  </span>
                )}
                <BookmarkButton articleId={article.id} />
              </div>
            </div>

            {article.heroImageUrl && (
              <div className="bg-muted relative aspect-[21/9] w-full overflow-hidden rounded-xl">
                <Image
                  src={article.heroImageUrl}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </header>

          {/* Mobile-only jump-to-section per spec (sticky ToC is desktop-only) */}
          <details className="border-border rounded-lg border p-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium">
              Jump to section
            </summary>
            <TableOfContents blocks={article.body} className="mt-3" />
          </details>

          <RichTextViewer blocks={article.body} />

          <div className="border-border flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <TagList tags={article.tags} />
            <ShareButtons url={canonicalUrl} title={article.title} />
          </div>

          <RelatedArticlesRail articleId={article.id} />

          <CommentsSection articleId={article.id} />
        </div>

        {/* Sticky desktop TableOfContents */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents blocks={article.body} />
          </div>
        </aside>
      </div>
    </article>
  );
}
