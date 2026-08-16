import { cn } from "@/shared/lib/utils";

/**
 * Base skeleton block. The Frontend Technical Specification mandates
 * skeletons over spinners for every content area — feature-specific
 * skeletons (ArticleCardSkeleton, TableSkeleton, etc., in
 * shared/components/feedback) compose this rather than each
 * reimplementing the shimmer.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
