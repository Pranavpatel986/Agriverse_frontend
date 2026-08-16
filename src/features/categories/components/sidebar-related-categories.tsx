import Link from "next/link";
import { ROUTES } from "@/config/routes";
import type { CategoryTreeNode } from "../types/category.types";

interface SidebarRelatedCategoriesProps {
  categories: CategoryTreeNode[];
  currentSlug: string;
}

export function SidebarRelatedCategories({
  categories,
  currentSlug,
}: SidebarRelatedCategoriesProps) {
  const related = categories.filter((c) => c.slug !== currentSlug).slice(0, 8);
  if (related.length === 0) return null;

  return (
    <aside aria-labelledby="related-categories-heading" className="space-y-3">
      <h2
        id="related-categories-heading"
        className="text-foreground text-sm font-semibold"
      >
        Other categories
      </h2>
      <ul className="space-y-2">
        {related.map((category) => (
          <li key={category.id}>
            <Link
              href={ROUTES.category(category.slug)}
              className="link-underline text-muted-foreground hover:text-foreground text-sm"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
