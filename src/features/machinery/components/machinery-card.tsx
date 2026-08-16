import { formatPriceRange } from "@/shared/lib/utils";
import type { MachinerySummary } from "../types/machinery.types";

export function MachineryCard({
  machinery,
  onSelect,
}: {
  machinery: MachinerySummary;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="border-border bg-card flex w-full flex-col gap-2 rounded-lg border p-4 text-left transition-shadow hover:shadow-md"
    >
      <h3 className="font-display text-base font-semibold">{machinery.name}</h3>
      <p className="text-muted-foreground text-xs">{machinery.category}</p>
      <p className="text-foreground font-mono text-sm tabular-nums">
        {formatPriceRange(machinery.priceRangeMin, machinery.priceRangeMax)}
      </p>
    </button>
  );
}
