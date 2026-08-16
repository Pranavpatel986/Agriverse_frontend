import { RoadmapCard } from "./roadmap-card";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import type { RoadmapSummary } from "../types/roadmap.types";

export function RoadmapGrid({ roadmaps }: { roadmaps: RoadmapSummary[] }) {
  if (roadmaps.length === 0) {
    return (
      <EmptyState
        title="Learning roadmaps for this topic are coming soon."
        description="Check back soon, or explore our articles in the meantime."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roadmaps.map((roadmap) => (
        <RoadmapCard key={roadmap.id} roadmap={roadmap} />
      ))}
    </div>
  );
}
