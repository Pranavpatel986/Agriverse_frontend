interface RoadmapHeaderProps {
  title: string;
  completedSteps: number;
  totalSteps: number;
}

export function RoadmapHeader({ title, completedSteps, totalSteps }: RoadmapHeaderProps) {
  const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <header className="space-y-3">
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
      <div className="space-y-1.5">
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            {completedSteps} of {totalSteps} steps complete
          </span>
          <span>{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={completedSteps}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-label={`Roadmap progress: ${percent}%`}
          className="bg-muted h-2 w-full overflow-hidden rounded-full"
        >
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </header>
  );
}
