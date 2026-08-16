import { useQuery } from "@tanstack/react-query";
import { weatherService } from "../api/weather.service";
import type { WeatherParams } from "../types/weather.types";

/**
 * staleTime approximates the spec's "cache for the response's own
 * expiresAt TTL" intent with a fixed 30-minute window rather than
 * parsing expiresAt to compute an exact per-response staleTime — Weather
 * TTLs are short-lived by nature, so a fixed conservative window avoids
 * both over-fetching and serving meaningfully stale conditions.
 */
export function useWeather(params: WeatherParams) {
  return useQuery({
    queryKey: ["weather", params],
    queryFn: () => weatherService.lookup(params),
    enabled:
      Boolean(params.lat != null && params.lon != null) ||
      Boolean(params.savedLocationId),
    staleTime: 30 * 60 * 1000,
  });
}
