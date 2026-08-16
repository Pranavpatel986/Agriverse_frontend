"use client";

import { slugifyHeading } from "@/shared/lib/utils";
import type { ArticleContentBlock } from "@/features/articles/types/article.types";

interface TableOfContentsProps {
  blocks: ArticleContentBlock[];
  className?: string;
}

export function TableOfContents({ blocks, className }: TableOfContentsProps) {
  const headings = blocks.filter(
    (block): block is Extract<ArticleContentBlock, { type: "heading" }> =>
      block.type === "heading" && block.level <= 3,
  );

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={className}>
      <h2 className="text-foreground mb-2 text-sm font-semibold">On this page</h2>
      <ul className="border-border space-y-1.5 border-l pl-3 text-sm">
        {headings.map((heading) => (
          <li key={heading.text} style={{ paddingLeft: (heading.level - 2) * 12 }}>
            <a
              href={`#${slugifyHeading(heading.text)}`}
              className="link-underline text-muted-foreground hover:text-foreground focus-visible:text-foreground block"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
