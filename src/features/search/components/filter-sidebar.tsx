"use client";

import { useCategoryTree } from "@/features/categories/hooks/use-categories";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface FilterSidebarProps {
  selectedCategory: string | null;
  onChange: (categorySlug: string | null) => void;
}

export function FilterSidebar({ selectedCategory, onChange }: FilterSidebarProps) {
  const { data: categories, isLoading } = useCategoryTree();

  return (
    <fieldset className="space-y-3">
      <legend className="text-foreground text-sm font-semibold">Category</legend>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {categories?.map((category) => {
            const checkboxId = `filter-category-${category.slug}`;
            const isChecked = selectedCategory === category.slug;
            return (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={checkboxId}
                  checked={isChecked}
                  onCheckedChange={(checked) => onChange(checked ? category.slug : null)}
                />
                <Label htmlFor={checkboxId} className="text-sm font-normal">
                  {category.name}
                </Label>
              </div>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
