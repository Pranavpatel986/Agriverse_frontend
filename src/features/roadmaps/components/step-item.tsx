"use client";

import Link from "next/link";
import { CheckIcon, FileTextIcon, HelpCircleIcon } from "lucide-react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/config/routes";
import type { RoadmapStep } from "../types/roadmap.types";

interface StepItemProps {
  step: RoadmapStep;
  /** "done" | "current" | "upcoming" — see RoadmapStepList's doc comment
   *  for why this is inferred from a count rather than a per-step flag. */
  status: "done" | "current" | "upcoming";
  onToggleComplete: (completed: boolean) => void;
  isUpdating: boolean;
  error?: string;
}

export function StepItem({
  step,
  status,
  onToggleComplete,
  isUpdating,
  error,
}: StepItemProps) {
  const isInteractive = status === "current" || status === "done";

  return (
    <li className="border-border bg-card flex gap-3 rounded-lg border p-4">
      <Checkbox
        checked={status === "done"}
        disabled={!isInteractive || isUpdating}
        onCheckedChange={(checked) => onToggleComplete(Boolean(checked))}
        aria-label={`Mark "${step.title}" as ${status === "done" ? "incomplete" : "complete"}`}
        className="mt-0.5"
      />
      <div className="flex-1 space-y-1.5">
        <p
          className={cn(
            "text-sm font-medium",
            status === "upcoming" && "text-muted-foreground",
          )}
        >
          {step.order}. {step.title}
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          {step.articleSlug && (
            <Link
              href={ROUTES.article(step.articleSlug)}
              className="link-underline text-primary flex items-center gap-1"
            >
              <FileTextIcon className="size-3.5" />
              Read article
            </Link>
          )}
          {step.quizId && (
            <Link
              href={ROUTES.quiz(step.quizId)}
              className="link-underline text-primary flex items-center gap-1"
            >
              <HelpCircleIcon className="size-3.5" />
              Take quiz
            </Link>
          )}
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
      {status === "done" && (
        <CheckIcon className="text-canopy-600 size-4 shrink-0" aria-hidden="true" />
      )}
    </li>
  );
}
