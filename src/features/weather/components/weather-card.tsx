import { CloudIcon, ThermometerIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/feedback/error-state";
import type { WeatherResult } from "../types/weather.types";

/**
 * `forecast` is an arbitrary JsonNode in the OpenAPI schema — no fixed
 * fields documented. This reads the plausible common shape
 * (temperature/condition) defensively via optional chaining, and falls
 * back to a plain summary rather than crashing if the real shape
 * differs. Tighten this once the backend team confirms the actual
 * forecast payload shape.
 */
interface PlausibleForecastShape {
  temperatureCelsius?: number;
  condition?: string;
  humidity?: number;
}

interface WeatherCardProps {
  data?: WeatherResult;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function WeatherCard({ data, isLoading, isError, onRetry }: WeatherCardProps) {
  if (isError) {
    return (
      <div className="border-border bg-card rounded-lg border p-4">
        <ErrorState
          variant="inline"
          description="Weather unavailable right now."
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="border-border bg-card space-y-2 rounded-lg border p-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-20" />
      </div>
    );
  }

  const forecast = data.forecast as PlausibleForecastShape | null;

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <h3 className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
        <CloudIcon className="size-4 text-sky-500" aria-hidden="true" />
        {data.regionName}
      </h3>

      {forecast?.temperatureCelsius != null ? (
        <div className="flex items-center gap-2">
          <ThermometerIcon className="text-harvest-500 size-6" aria-hidden="true" />
          <span className="font-mono text-3xl font-semibold tabular-nums">
            {Math.round(forecast.temperatureCelsius)}°C
          </span>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Conditions data unavailable.</p>
      )}

      {/* Icon-only conditions always paired with a text equivalent, per
          the a11y requirement — never icon/color alone. */}
      {forecast?.condition && (
        <p className="text-muted-foreground mt-1 text-sm">{forecast.condition}</p>
      )}
      {forecast?.humidity != null && (
        <p className="text-muted-foreground text-xs">Humidity: {forecast.humidity}%</p>
      )}
    </div>
  );
}
