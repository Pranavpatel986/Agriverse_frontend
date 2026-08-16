import { AlertTriangleIcon, RotateCwIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  /** Use "inline" for a small widget (e.g. RecommendationRail) embedded
   *  in an otherwise-fine page; "section" for a page section that failed
   *  entirely. Never use this for whole-page failures — that's the
   *  route's error.tsx boundary, not this component. */
  variant?: "inline" | "section";
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this right now.",
  onRetry,
  className,
  variant = "section",
}: ErrorStateProps) {
  if (variant === "inline") {
    return (
      <div
        className={cn("text-muted-foreground flex items-center gap-2 text-sm", className)}
      >
        <span>{description}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="link-underline text-primary inline-flex items-center gap-1 font-medium"
          >
            <RotateCwIcon className="size-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        "border-clay-500/30 bg-clay-100/40 flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-10 text-center",
        className,
      )}
    >
      <AlertTriangleIcon className="text-clay-700 size-8" />
      <div className="space-y-1">
        <p className="text-foreground font-medium">{title}</p>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCwIcon />
          Try again
        </Button>
      )}
    </div>
  );
}
