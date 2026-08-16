import type { Metadata } from "next";
import { roadmapService } from "@/features/roadmaps/api/roadmap.service";
import { RoadmapGrid } from "@/features/roadmaps/components/roadmap-grid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Learning Roadmaps",
  description: "Structured, step-by-step learning paths for agricultural topics.",
  alternates: { canonical: "/roadmaps" },
};

export default async function RoadmapListPage() {
  const page = await roadmapService
    .list({ page: 0, size: 24 })
    .catch(() => ({ content: [], totalElements: 0, totalPages: 0, page: 0 }));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <header className="max-w-2xl space-y-1">
        <h1 className="font-display text-2xl font-semibold">Learning Roadmaps</h1>
        <p className="text-muted-foreground text-sm">
          Follow a structured path — read, practice, and test your understanding.
        </p>
      </header>
      <RoadmapGrid roadmaps={page.content} />
    </div>
  );
}
