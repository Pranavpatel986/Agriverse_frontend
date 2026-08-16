import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { articleService } from "@/features/articles/api/article.service";
import { categoryService } from "@/features/categories/api/category.service";
import { ArticleCard } from "@/shared/components/composite/article-card";
import { CategoryCard } from "@/shared/components/composite/category-card";
import { SearchBar } from "@/shared/components/composite/search-bar";
import { TrendingSearchesWidget } from "@/shared/components/composite/trending-searches-widget";
import { RecommendationRail } from "@/shared/components/composite/recommendation-rail";
import { NewsletterSignup } from "@/shared/components/composite/newsletter-signup";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { env } from "@/config/env";
import { ROUTES } from "@/config/routes";

// ISR: rebuilt in the background at most once an hour. A failed
// revalidation fetch (see catch blocks below) keeps serving the last
// good build rather than crashing — the spec's "stale-while-error"
// requirement for this page.
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description:
    "Structured, practical agricultural knowledge — crop guides, disease diagnosis, government schemes, market prices, and learning roadmaps for Indian farmers.",
  openGraph: {
    title: "AgriVerse — Agricultural Knowledge Platform",
    images: ["/og-home.jpg"],
  },
};

const HERO_IMAGE = {
  src: "https://images.agriverse.app/hero/home-hero.jpg",
  alt: "Farmer inspecting a healthy paddy field at sunrise",
};

export default async function HomePage() {
  const [categories, featuredArticles] = await Promise.all([
    categoryService.tree().catch(() => []),
    articleService.list({ sort: "popular", size: 8 }).catch(() => null),
  ]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AgriVerse",
      url: env.NEXT_PUBLIC_SITE_URL,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "AgriVerse",
      url: env.NEXT_PUBLIC_SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  const quickLinkCategories = categories.slice(0, 5);
  const [heroArticle, ...restArticles] = featuredArticles?.content ?? [];

  return (
    <div className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HeroBanner — hero image is the LCP element: priority + explicit
          dimensions to avoid layout shift, per the spec's performance
          requirement. */}
      <section className="relative flex min-h-[460px] items-center overflow-hidden bg-canopy-900 text-canopy-50">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto w-full max-w-3xl space-y-7 px-4 text-center">
          <h1 className="text-balance font-display text-4xl font-semibold sm:text-5xl">
            Practical agricultural knowledge, structured for you
          </h1>
          <p className="mx-auto max-w-xl text-balance text-canopy-100">
            Crop guides, disease diagnosis, government schemes, and market prices — all in
            one place.
          </p>
          <SearchBar className="mx-auto max-w-xl" autoFocus={false} />
          {quickLinkCategories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {quickLinkCategories.map((category) => (
                <Link
                  key={category.id}
                  href={ROUTES.category(category.slug)}
                  className="rounded-full border border-canopy-700 bg-canopy-800/60 px-3.5 py-1.5 text-sm text-canopy-100 transition-colors hover:border-canopy-400 hover:bg-canopy-800"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-16 px-4 pt-16">
        {/* CategoryGridSection */}
        <section aria-labelledby="categories-heading" className="space-y-5">
          <div className="flex items-end justify-between">
            <h2 id="categories-heading" className="font-display text-2xl font-semibold">
              Browse by category
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} name={category.name} slug={category.slug} />
            ))}
          </div>
        </section>

        {/* FeaturedArticlesSection — first article gets a larger
            treatment on wide screens for visual hierarchy, rather than
            an undifferentiated uniform grid. */}
        <section aria-labelledby="featured-heading" className="space-y-5">
          <div className="flex items-end justify-between">
            <h2 id="featured-heading" className="font-display text-2xl font-semibold">
              Featured articles
            </h2>
            <Link
              href={ROUTES.search}
              className="link-underline flex items-center gap-1 text-sm font-medium text-primary"
            >
              Browse all
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
          {heroArticle ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 lg:row-span-2">
                <ArticleCard article={heroArticle} className="h-full" />
              </div>
              {restArticles.slice(0, 6).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="New content is on its way"
              description="We're publishing new guides regularly — check back soon."
            />
          )}
        </section>

        <TrendingSearchesWidget />

        <RecommendationRail />

        <NewsletterSignup />
      </div>
    </div>
  );
}
