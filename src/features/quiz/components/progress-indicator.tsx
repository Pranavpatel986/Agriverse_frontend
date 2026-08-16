export function ProgressIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <p aria-live="polite" className="text-muted-foreground text-sm font-medium">
      Question {current} of {total}
    </p>
  );
}
