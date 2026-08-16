import type { Metadata } from "next";
import { Suspense } from "react";
import { diseaseService } from "@/features/diseases/api/disease.service";
import { DiseaseLibraryContent } from "@/features/diseases/components/disease-library-content";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Plant Disease Library",
  description:
    "Look up crop diseases by symptom — causes, treatment, and prevention for common plant diseases.",
  alternates: { canonical: "/diseases" },
};

export default async function DiseaseLibraryPage() {
  const initialPage = await diseaseService
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
      <DiseaseLibraryContent initialPage={initialPage} />
    </Suspense>
  );
}
