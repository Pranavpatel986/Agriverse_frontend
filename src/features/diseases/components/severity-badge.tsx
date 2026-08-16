import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { Severity } from "../types/disease.types";

const SEVERITY_STYLES: Record<string, string> = {
  low: "bg-canopy-100 text-canopy-800",
  medium: "bg-harvest-100 text-harvest-700",
  high: "bg-clay-100 text-clay-700",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const style =
    SEVERITY_STYLES[severity.toLowerCase()] ?? "bg-muted text-muted-foreground";
  return (
    <Badge variant="secondary" className={cn(style, "capitalize")}>
      {severity}
    </Badge>
  );
}
