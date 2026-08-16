"use client";

import { useState } from "react";
import { StepItem } from "./step-item";
import { useUpdateRoadmapProgress } from "../hooks/use-roadmaps";
import type { RoadmapStep } from "../types/roadmap.types";

interface RoadmapStepListProps {
  roadmapId: string;
  slug: string;
  steps: RoadmapStep[];
  completedSteps: number;
}

/**
 * The API's progress model (RoadmapProgressResponse) is just a COUNT —
 * `completedSteps` — not a set of which specific step ids are done.
 * There's no way to know from the response alone whether steps were
 * completed in order or arbitrarily. This infers a sequential model
 * (steps ordered 1..completedSteps are "done", the next one is
 * "current" and interactive, the rest are "upcoming" and locked) since
 * that's the only consistent reading of a count-only progress field. If
 * the backend actually supports free-order completion, this needs a
 * per-step-completed field added to RoadmapStepResponse to do properly.
 */
export function RoadmapStepList({
  roadmapId,
  slug,
  steps,
  completedSteps,
}: RoadmapStepListProps) {
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const updateProgress = useUpdateRoadmapProgress(roadmapId, slug);
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  function statusFor(index: number): "done" | "current" | "upcoming" {
    if (index < completedSteps) return "done";
    if (index === completedSteps) return "current";
    return "upcoming";
  }

  function handleToggle(step: RoadmapStep, completed: boolean) {
    setStepErrors((prev) => ({ ...prev, [step.id]: "" }));
    updateProgress.mutate(
      { stepId: step.id, completed },
      {
        onError: (error) => {
          setStepErrors((prev) => ({ ...prev, [step.id]: error.message }));
        },
      },
    );
  }

  return (
    <ol className="border-border relative space-y-3 border-l pl-4 sm:pl-6">
      {sortedSteps.map((step, index) => (
        <StepItem
          key={step.id}
          step={step}
          status={statusFor(index)}
          isUpdating={
            updateProgress.isPending && updateProgress.variables?.stepId === step.id
          }
          error={stepErrors[step.id]}
          onToggleComplete={(completed) => handleToggle(step, completed)}
        />
      ))}
    </ol>
  );
}
