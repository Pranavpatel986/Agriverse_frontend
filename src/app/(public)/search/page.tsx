import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageContent } from "@/features/search/components/search-page-content";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
