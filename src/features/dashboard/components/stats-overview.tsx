import { EyeIcon, FileTextIcon, ShieldAlertIcon, UsersIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAnalyticsOverview } from "../hooks/use-dashboard";

const METRICS = [
  { key: "totalArticles" as const, label: "Total articles", icon: FileTextIcon },
  { key: "totalViews" as const, label: "Total views", icon: EyeIcon },
  { key: "totalUsers" as const, label: "Total users", icon: UsersIcon },
  {
    key: "pendingModeration" as const,
    label: "Pending moderation",
    icon: ShieldAlertIcon,
  },
];

export function StatsOverview() {
  const { data, isLoading, isError } = useAnalyticsOverview();

  if (isError) return null; // non-critical widget; the page still works without it

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {METRICS.map((metric) => (
        <div key={metric.key} className="border-border bg-card rounded-lg border p-4">
          <metric.icon className="text-primary mb-2 size-4" aria-hidden="true" />
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {data?.[metric.key].toLocaleString()}
            </p>
          )}
          <p className="text-muted-foreground text-xs">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
