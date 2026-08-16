import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import type { ArticleAuthorRef } from "@/features/articles/types/article.types";

export function AuthorCard({ author }: { author: ArticleAuthorRef }) {
  const initials = author.displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10">
        {author.avatarUrl && <AvatarImage src={author.avatarUrl} alt="" />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-foreground text-sm font-medium">{author.displayName}</p>
        {author.bio && (
          <p className="text-muted-foreground line-clamp-1 text-xs">{author.bio}</p>
        )}
      </div>
    </div>
  );
}
