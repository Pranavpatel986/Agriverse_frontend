"use client";

import type { ReactNode } from "react";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { Sheet, SheetContent, SheetTitle } from "@/shared/components/ui/sheet";
import { VisuallyHidden } from "@/shared/components/ui/visually-hidden";

interface DetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

/**
 * The one drawer/side-panel component behind DiseaseDetailPanel,
 * SchemeDetailPanel, and MachineryDetailPanel — all three call for the
 * identical pattern (bottom drawer on mobile, fixed side panel on
 * desktop, focus-trapped, restores focus to the triggering card on
 * close). Built once here rather than three times.
 *
 * Focus trap and return-focus-on-close come for free from Sheet's
 * underlying Radix Dialog primitive — no extra wiring needed.
 */
export function DetailPanel({ open, onOpenChange, title, children }: DetailPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isDesktop ? "right" : "bottom"} className="overflow-y-auto">
        <VisuallyHidden>
          <SheetTitle>{title}</SheetTitle>
        </VisuallyHidden>
        <div className="px-1 py-2">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
