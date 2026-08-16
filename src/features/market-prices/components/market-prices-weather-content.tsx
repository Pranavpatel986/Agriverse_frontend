"use client";

import { useState } from "react";
import { CropPicker } from "@/shared/components/composite/crop-picker";
import { MarketPriceTable } from "@/features/market-prices/components/market-price-table";
import { PriceTrendSparkline } from "@/features/market-prices/components/price-trend-sparkline";
import { useMarketPrices } from "@/features/market-prices/hooks/use-market-prices";
import { LocationPicker } from "@/features/weather/components/location-picker";
import { WeatherCard } from "@/features/weather/components/weather-card";
import { useWeather } from "@/features/weather/hooks/use-weather";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { ErrorState } from "@/shared/components/feedback/error-state";
import { CardGridSkeleton } from "@/shared/components/feedback/skeletons";

export function MarketPricesWeatherContent() {
  const [cropId, setCropId] = useState<string | undefined>();
  const [state, setState] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | undefined>();

  // Independent queries — neither blocks the other, per the spec's
  // "both API calls fire in parallel" performance requirement.
  const pricesQuery = useMarketPrices(
    cropId ? { cropId, state: state || undefined } : undefined,
  );
  const weatherQuery = useWeather(coords ?? {});

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="max-w-2xl space-y-1">
        <h1 className="font-display text-2xl font-semibold">
          Market Prices &amp; Weather
        </h1>
        <p className="text-muted-foreground text-sm">
          Check current mandi prices and local weather conditions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <section aria-labelledby="prices-heading" className="space-y-4">
          <h2 id="prices-heading" className="text-lg font-semibold">
            Market prices
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="max-w-xs flex-1 space-y-1.5">
              <Label>Crop</Label>
              <CropPicker value={cropId} onChange={setCropId} />
            </div>
            <div className="max-w-xs flex-1 space-y-1.5">
              <Label htmlFor="market-state">State (optional)</Label>
              <Input
                id="market-state"
                placeholder="e.g. Punjab"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          {!cropId ? (
            <p className="text-muted-foreground text-sm">
              Select a crop to see current prices.
            </p>
          ) : pricesQuery.isError ? (
            <ErrorState
              description="Prices unavailable for this crop right now."
              onRetry={() => pricesQuery.refetch()}
            />
          ) : pricesQuery.isLoading ? (
            <CardGridSkeleton count={4} className="grid-cols-1" />
          ) : (
            <div className="space-y-4">
              <PriceTrendSparkline prices={pricesQuery.data?.prices ?? []} />
              <MarketPriceTable prices={pricesQuery.data?.prices ?? []} />
            </div>
          )}
        </section>

        <section aria-labelledby="weather-heading" className="space-y-4">
          <h2 id="weather-heading" className="text-lg font-semibold">
            Weather
          </h2>
          <LocationPicker onLocationChange={setCoords} />
          {coords && (
            <WeatherCard
              data={weatherQuery.data}
              isLoading={weatherQuery.isLoading}
              isError={weatherQuery.isError}
              onRetry={() => weatherQuery.refetch()}
            />
          )}
        </section>
      </div>
    </div>
  );
}
