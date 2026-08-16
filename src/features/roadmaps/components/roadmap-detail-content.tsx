"use client";

import { RoadmapHeader } from "./roadmap-header";
import { RoadmapStepList } from "./roadmap-step-list";
import { useRoadmap } from "../hooks/use-roadmaps";
import type { RoadmapDetail } from "../types/roadmap.types";

interface RoadmapDetailContentProps {
  slug: string;
  /** Server-fetched at build/revalidation time (see the page.tsx server
   *  component) — rendered immediately so roadmap structure is never
   *  blocked, per the spec's performance requirement. The client-side
   *  useRoadmap(slug) call below refetches on mount to pick up this
   *  specific signed-in user's actual current progress, which an
   *  ISR-cached response can't reflect (it was built without this
   *  user's auth context); once that resolves, its fresher data
   *  replaces this initial prop. */
  initialRoadmap: RoadmapDetail;
}

export function RoadmapDetailContent({
  slug,
  initialRoadmap,
}: RoadmapDetailContentProps) {
  const { data } = useRoadmap(slug);
  const roadmap = data ?? initialRoadmap;
  const completedSteps = roadmap.progress?.completedSteps ?? 0;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      <RoadmapHeader
        title={roadmap.title}
        completedSteps={completedSteps}
        totalSteps={roadmap.steps.length}
      />
      <RoadmapStepList
        roadmapId={roadmap.id}
        slug={slug}
        steps={roadmap.steps}
        completedSteps={completedSteps}
      />
    </div>
  );
}
