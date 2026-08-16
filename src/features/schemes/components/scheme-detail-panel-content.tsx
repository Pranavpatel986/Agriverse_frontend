import { format } from "date-fns";
import { DeadlineBadge } from "./deadline-badge";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useScheme } from "../hooks/use-schemes";

export function SchemeDetailPanelContent({ schemeId }: { schemeId: string }) {
  const { data, isLoading, isError, refetch } = useScheme(schemeId);

  if (isError) {
    return (
      <ErrorState description="Couldn't load this scheme." onRetry={() => refetch()} />
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-display text-xl font-semibold">{data.name}</h2>
        <DeadlineBadge deadline={data.applicationDeadline} />
      </div>
      <p className="text-muted-foreground text-xs">
        {data.beneficiaryType}
        {data.state && ` · ${data.state}`}
        {data.crop && ` · ${data.crop.name}`}
      </p>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Description</h3>
        <p className="text-muted-foreground text-sm">{data.description}</p>
      </section>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Benefit</h3>
        <p className="text-muted-foreground text-sm">{data.benefitSummary}</p>
      </section>

      {/* Real, crawlable outbound link per the SEO requirement — never a
          JS-only click handler standing in for a link. */}
      <a
        href={data.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline text-primary block text-sm font-medium"
      >
        View official source ({data.source}) →
      </a>

      {data.lastVerifiedAt && (
        <p className="text-muted-foreground text-xs">
          Last verified {format(new Date(data.lastVerifiedAt), "MMM d, yyyy")}
        </p>
      )}
    </div>
  );
}
