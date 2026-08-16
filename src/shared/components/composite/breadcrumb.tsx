import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit on the final (current) item
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * A real <nav aria-label="Breadcrumb"> with an ordered list — per the
 * Category page spec's explicit accessibility requirement — plus
 * BreadcrumbList JSON-LD so it's also eligible for breadcrumb rich
 * results in search, matching the same page's SEO requirement.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="link-underline hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-foreground"
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
