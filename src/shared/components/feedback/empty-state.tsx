import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Used wherever a list/section legitimately has zero items (no featured
 * articles yet, no bookmarks, no search results) — distinct from
 * ErrorState, which is for failures. Conflating the two would tell a
 * user who searched for something obscure that something is "broken."
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-muted-foreground [&_svg]:size-10">{icon}</div>}
      <div className="space-y-1">
        <p className="font-display text-foreground text-lg font-medium">{title}</p>
        {description && (
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
