import { DeadlineBadge } from "./deadline-badge";
import type { SchemeSummary } from "../types/scheme.types";

export function SchemeCard({
  scheme,
  onSelect,
}: {
  scheme: SchemeSummary;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="border-border bg-card flex w-full flex-col gap-2 rounded-lg border p-4 text-left transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold">{scheme.name}</h3>
        <DeadlineBadge deadline={scheme.applicationDeadline} />
      </div>
      <p className="text-muted-foreground text-xs">
        {scheme.beneficiaryType}
        {scheme.state && ` · ${scheme.state}`}
      </p>
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {scheme.benefitSummary}
      </p>
    </button>
  );
}
