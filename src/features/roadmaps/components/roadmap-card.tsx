import Link from "next/link";
import { MapIcon } from "lucide-react";
import { ROUTES } from "@/config/routes";
import type { RoadmapSummary } from "../types/roadmap.types";

export function RoadmapCard({ roadmap }: { roadmap: RoadmapSummary }) {
  return (
    <Link
      href={ROUTES.roadmap(roadmap.slug)}
      className="group border-border bg-card flex flex-col gap-2 rounded-lg border p-4 transition-shadow hover:shadow-md"
    >
      <span className="bg-canopy-100 text-canopy-700 flex size-9 items-center justify-center rounded-full">
        <MapIcon className="size-4" aria-hidden="true" />
      </span>
      <h3 className="font-display group-hover:text-primary text-base font-semibold">
        {roadmap.title}
      </h3>
      {roadmap.description && (
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {roadmap.description}
        </p>
      )}
      <p className="text-muted-foreground text-xs">{roadmap.stepCount} steps</p>
    </Link>
  );
}
