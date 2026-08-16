"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { RoadmapForm } from "./roadmap-form";
import { useRoadmaps } from "../hooks/use-roadmaps";
import { ROUTES } from "@/config/routes";

export function RoadmapManagementPanel() {
  const { data, isLoading, isError, refetch } = useRoadmaps({ size: 50 });
  const [formOpen, setFormOpen] = useState(false);

  if (isError) {
    return <ErrorState description="Couldn't load roadmaps." onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Roadmaps</h2>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <PlusIcon />
          Create roadmap
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : data?.content.length === 0 ? (
        <EmptyState
          title="No roadmaps yet"
          description="Create a step-by-step learning path for a topic."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <PlusIcon />
              Create roadmap
            </Button>
          }
        />
      ) : (
        <div className="divide-border bg-card divide-y rounded-lg border">
          {data?.content.map((roadmap) => (
            <Link
              key={roadmap.id}
              href={`${ROUTES.roadmaps}/${roadmap.slug}`}
              target="_blank"
              className="hover:bg-muted/50 flex items-center justify-between gap-3 px-4 py-3"
            >
              <span className="font-medium">{roadmap.title}</span>
              <Badge variant="secondary">{roadmap.stepCount} steps</Badge>
            </Link>
          ))}
        </div>
      )}

      <RoadmapForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
