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

export interface MachineryFilters {
  category?: string;
  cropId?: string;
}

// No enum constraint in the OpenAPI schema — plausible categories
// pending confirmation from the backend team.
const CATEGORIES = ["tractor", "harvester", "irrigation", "tillage", "sprayer"];

export function MachineryFilterBar({
  filters,
  onChange,
}: {
  filters: MachineryFilters;
  onChange: (next: MachineryFilters) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select
          value={filters.category ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, category: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Applicable crop</Label>
        <CropPicker
          value={filters.cropId}
          onChange={(cropId) => onChange({ ...filters, cropId })}
        />
      </div>
    </div>
  );
}
