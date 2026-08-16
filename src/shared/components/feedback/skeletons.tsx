import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

export function ArticleCardSkeleton() {
  return (
    <div className="border-border bg-card flex flex-col gap-3 overflow-hidden rounded-lg border">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4 pt-0">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-3 w-24" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-2 rounded-lg border p-4">
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

interface CardGridSkeletonProps {
  count?: number;
  className?: string;
  card?: React.ComponentType;
}

export function CardGridSkeleton({
  count = 8,
  className,
  card: Card = ArticleCardSkeleton,
}: CardGridSkeletonProps) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }, (_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
