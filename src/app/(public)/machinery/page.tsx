import type { Metadata } from "next";
import { Suspense } from "react";
import { machineryService } from "@/features/machinery/api/machinery.service";
import { MachineryDirectoryContent } from "@/features/machinery/components/machinery-directory-content";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Machinery Directory",
  description: "Browse farm machinery and equipment by category, crop, and price range.",
  alternates: { canonical: "/machinery" },
};

export default async function MachineryDirectoryPage() {
  const initialPage = await machineryService
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
      <MachineryDirectoryContent initialPage={initialPage} />
    </Suspense>
  );
}
