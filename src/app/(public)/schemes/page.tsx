import type { Metadata } from "next";
import { Suspense } from "react";
import { schemeService } from "@/features/schemes/api/scheme.service";
import { SchemeFinderContent } from "@/features/schemes/components/scheme-finder-content";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Government Scheme Finder",
  description: "Search government agricultural schemes by state, crop, and eligibility.",
  alternates: { canonical: "/schemes" },
};

export default async function SchemeFinderPage() {
  const initialPage = await schemeService
    .list({ page: 0, size: 12 })
    .catch(() => ({ content: [], totalElements: 0, totalPages: 0, page: 0 }));

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <SchemeFinderContent initialPage={initialPage} />
    </Suspense>
  );
}
