"use client";

import type { ReactNode } from "react";
import { FilterIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

export function MobileFilterSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mb-2 w-fit lg:hidden">
          <FilterIcon className="size-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetTitle>Filters</SheetTitle>
        <div className="mt-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
