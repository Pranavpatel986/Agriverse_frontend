import { differenceInCalendarDays, format } from "date-fns";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

export function DeadlineBadge({ deadline }: { deadline?: string }) {
  if (!deadline) return null;

  const daysLeft = differenceInCalendarDays(new Date(deadline), new Date());
  const isUrgent = daysLeft >= 0 && daysLeft <= 14;
  const isPast = daysLeft < 0;

  return (
    <Badge
      variant="secondary"
      className={cn(
        isPast && "bg-muted text-muted-foreground",
        isUrgent && "bg-clay-100 text-clay-700",
        !isPast && !isUrgent && "bg-sky-100 text-sky-700",
      )}
    >
      {isPast
        ? "Deadline passed"
        : `Apply by ${format(new Date(deadline), "MMM d, yyyy")}`}
    </Badge>
  );
}
