import Link from "next/link";
import { ROUTES } from "@/config/routes";

export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`${ROUTES.search}?q=${encodeURIComponent(tag)}`}
            className="bg-loam-100 text-loam-700 hover:bg-loam-300/60 rounded-full px-3 py-1 text-xs font-medium transition-colors"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
