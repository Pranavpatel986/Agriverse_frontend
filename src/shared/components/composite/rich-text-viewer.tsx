import Image from "next/image";
import { slugifyHeading } from "@/shared/lib/utils";
import type { ArticleContentBlock } from "@/features/articles/types/article.types";

/**
 * Deliberately switches on `block.type` exhaustively (the `never` in
 * default) so adding a new block type without updating this renderer is
 * a compile error, not a silently-dropped block in production.
 */
export function RichTextViewer({ blocks }: { blocks: ArticleContentBlock[] }) {
  return (
    <div className="prose-agriverse space-y-6">
      {blocks.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}
    </div>
  );
}

function ContentBlock({ block }: { block: ArticleContentBlock }) {
  switch (block.type) {
    case "heading": {
      const id = slugifyHeading(block.text);
      const Tag = `h${block.level}` as const;
      return (
        <Tag id={id} className="font-display scroll-mt-24 font-semibold">
          {block.text}
        </Tag>
      );
    }
    case "paragraph":
      // Trusted, editorially-authored HTML from the CMS (per the Article
      // page spec: "alt text enforced at authoring time in the editorial
      // workflow") — not user-submitted input, unlike comment bodies
      // (which are always rendered as plain text, never HTML).
      return (
        <p
          className="text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case "image":
      return (
        <figure>
          <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={block.url}
              alt={block.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="text-muted-foreground mt-2 text-center text-sm">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-border border-b">
                {block.headers.map((header) => (
                  <th key={header} scope="col" className="p-2 text-left font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-border border-b">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-3">
          {block.items.map((item) => (
            <details key={item.question} className="border-border rounded-lg border p-4">
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="text-muted-foreground mt-2 text-sm">{item.answer}</p>
            </details>
          ))}
        </div>
      );
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
