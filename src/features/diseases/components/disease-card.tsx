import { SeverityBadge } from "./severity-badge";
import type { DiseaseSummary } from "../types/disease.types";

export function DiseaseCard({
  disease,
  onSelect,
}: {
  disease: DiseaseSummary;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="border-border bg-card flex w-full flex-col gap-2 rounded-lg border p-4 text-left transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold">{disease.name}</h3>
        <SeverityBadge severity={disease.severity} />
      </div>
      <p className="text-muted-foreground text-xs capitalize">{disease.pathogenType}</p>
      {disease.crops.length > 0 && (
        <p className="text-muted-foreground text-xs">
          Affects: {disease.crops.map((c) => c.name).join(", ")}
        </p>
      )}
    </button>
  );
}
