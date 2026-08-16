"use client";

import { CropPicker } from "@/shared/components/composite/crop-picker";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

export interface SchemeFilters {
  state?: string;
  beneficiaryType?: string;
  cropId?: string;
}

// No enum constraint in the OpenAPI schema (plain string) — plausible
// values pending confirmation from the backend team.
const BENEFICIARY_TYPES = ["smallholder", "women", "sc_st", "general"];

export function SchemeFilterBar({
  filters,
  onChange,
}: {
  filters: SchemeFilters;
  onChange: (next: SchemeFilters) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="scheme-state">State</Label>
        <Input
          id="scheme-state"
          placeholder="e.g. Maharashtra"
          value={filters.state ?? ""}
          onChange={(e) => onChange({ ...filters, state: e.target.value || undefined })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Beneficiary type</Label>
        <Select
          value={filters.beneficiaryType ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, beneficiaryType: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {BENEFICIARY_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace("_", "/")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Crop</Label>
        <CropPicker
          value={filters.cropId}
          onChange={(cropId) => onChange({ ...filters, cropId })}
        />
      </div>
    </div>
  );
}
