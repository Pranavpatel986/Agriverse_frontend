import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/config/routes";
import { formatPriceRange } from "@/shared/lib/utils";
import { useMachinery } from "../hooks/use-machinery";

export function MachineryDetailPanelContent({ machineryId }: { machineryId: string }) {
  const { data, isLoading, isError, refetch } = useMachinery(machineryId);

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
      <h2 className="font-display text-xl font-semibold">{data.name}</h2>
      <p className="text-muted-foreground text-xs">{data.category}</p>
      <p className="font-mono text-lg tabular-nums">
        {formatPriceRange(data.priceRangeMin, data.priceRangeMax)}
      </p>

      <section>
        <h3 className="mb-1 text-sm font-semibold">Description</h3>
        <p className="text-muted-foreground text-sm">{data.description}</p>
      </section>

      {data.applicableCrop && (
        <section>
          <h3 className="mb-1 text-sm font-semibold">Applicable crop</h3>
          <p className="text-muted-foreground text-sm">{data.applicableCrop.name}</p>
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
