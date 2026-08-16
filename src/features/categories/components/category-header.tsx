import Link from "next/link";
import { ROUTES } from "@/config/routes";
import type { CategoryDetail } from "../types/category.types";

export function CategoryHeader({ category }: { category: CategoryDetail }) {
  return (
    <header className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-semibold">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{category.description}</p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          {category.articleCount} article{category.articleCount === 1 ? "" : "s"}
        </p>
      </div>

      {category.children.length > 0 && (
        <nav aria-label="Subcategories">
          <h2 className="sr-only">Subcategories</h2>
          <ul className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {category.children.map((child) => (
              <li key={child.id} className="shrink-0">
                <Link
                  href={ROUTES.category(child.slug)}
                  className="border-border bg-card text-foreground hover:border-primary hover:bg-canopy-50 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
