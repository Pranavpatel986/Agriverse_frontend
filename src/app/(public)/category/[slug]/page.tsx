import type { Metadata } from "next";
import { categoryService } from "@/features/categories/api/category.service";
import { articleService } from "@/features/articles/api/article.service";
import { CategoryHeader } from "@/features/categories/components/category-header";
import { SidebarRelatedCategories } from "@/features/categories/components/sidebar-related-categories";
import { CategoryArticleList } from "@/features/articles/components/category-article-list";
import { Breadcrumb } from "@/shared/components/composite/breadcrumb";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { ROUTES } from "@/config/routes";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  try {
    return await categoryService.bySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category" };

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: ROUTES.category(slug) },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, tree] = await Promise.all([
    getCategory(slug),
    categoryService.tree().catch(() => []),
  ]);

  if (!category) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState
          title="Category unavailable"
          description="We couldn't load this category right now."
        />
      </div>
    );
  }

  const firstPage = await articleService
    .list({ categorySlug: slug, page: 0, size: 12 })
    .catch(() => ({ content: [], totalElements: 0, totalPages: 0, page: 0 }));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <Breadcrumb
        items={[{ label: "Home", href: ROUTES.home }, { label: category.name }]}
      />

      <CategoryHeader category={category} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_240px]">
        <section aria-labelledby="articles-heading">
          <h2 id="articles-heading" className="sr-only">
            Articles in {category.name}
          </h2>
          <CategoryArticleList categorySlug={slug} initialPage={firstPage} />
        </section>

        <SidebarRelatedCategories categories={tree} currentSlug={slug} />
      </div>
    </div>
  );
}
