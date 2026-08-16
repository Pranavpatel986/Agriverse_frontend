"use client";

import { CropPicker } from "@/shared/components/composite/crop-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

export interface DiseaseFilters {
  cropId?: string;
  pathogenType?: string;
  severity?: string;
}

// The OpenAPI schema types these as plain strings, not enums — no
// backend-enforced value list exists. These are the plausible values
// implied by the domain; confirm the real set with the backend team.
const PATHOGEN_TYPES = ["fungal", "bacterial", "viral", "pest"];
const SEVERITIES = ["low", "medium", "high"];

export function DiseaseFilterBar({
  filters,
  onChange,
}: {
  filters: DiseaseFilters;
  onChange: (next: DiseaseFilters) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Crop</Label>
        <CropPicker
          value={filters.cropId}
          onChange={(cropId) => onChange({ ...filters, cropId })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Pathogen type</Label>
        <Select
          value={filters.pathogenType ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, pathogenType: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {PATHOGEN_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Severity</Label>
        <Select
          value={filters.severity ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, severity: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {SEVERITIES.map((severity) => (
              <SelectItem key={severity} value={severity} className="capitalize">
                {severity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
