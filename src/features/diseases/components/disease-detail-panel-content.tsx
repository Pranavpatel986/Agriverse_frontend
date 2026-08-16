import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { SeverityBadge } from "./severity-badge";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useDisease } from "../hooks/use-diseases";

export function DiseaseDetailPanelContent({ diseaseId }: { diseaseId: string }) {
  const { data, isLoading, isError, refetch } = useDisease(diseaseId);

  if (isError) {
    return (
      <ErrorState description="Couldn't load this entry." onRetry={() => refetch()} />
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
        <SeverityBadge severity={data.severity} />
      </div>
      <p className="text-muted-foreground text-xs capitalize">{data.pathogenType}</p>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Symptoms</h3>
        <p className="text-muted-foreground text-sm">{data.symptoms}</p>
      </section>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Treatment</h3>
        <p className="text-muted-foreground text-sm">{data.treatment}</p>
      </section>

      {data.prevention && (
        <section>
          <h3 className="mb-1 text-sm font-semibold">Prevention</h3>
          <p className="text-muted-foreground text-sm">{data.prevention}</p>
        </section>
      )}

      {data.crops.length > 0 && (
        <section>
          <h3 className="mb-1 text-sm font-semibold">Affected crops</h3>
          <p className="text-muted-foreground text-sm">
            {data.crops.map((c) => c.name).join(", ")}
          </p>
        </section>
      )}

      {data.article && (
        <Button variant="outline" asChild className="w-full">
          <Link href={ROUTES.article(data.article.slug)}>
            Read the full article
            <ArrowRightIcon />
          </Link>
        </Button>
      )}
    </div>
  );
}
