"use client";

import { useState } from "react";
import { LocateIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface LocationPickerProps {
  onLocationChange: (coords: { lat: number; lon: number }) => void;
}

/**
 * The Frontend Spec describes this as "saved locations (if logged in)
 * or manual lat/lon" — but the real OpenAPI has no endpoint to list or
 * manage saved locations, only a `savedLocationId` query param on
 * /weather itself (implying the concept exists server-side with no
 * discoverable way to populate a picker for it). Built here with what
 * IS fully supported: browser geolocation + manual entry. Add a saved-
 * locations dropdown once a list/manage endpoint exists.
 */
export function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);

  function useMyLocation() {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation isn't available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => setGeoError("Couldn't access your location. Enter it manually instead."),
    );
  }

  function submitManual(e: React.FormEvent) {
    e.preventDefault();
    const lat = Number(manualLat);
    const lon = Number(manualLon);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      onLocationChange({ lat, lon });
    }
  }

  return (
    <div className="border-border bg-card space-y-3 rounded-lg border p-4">
      <Button type="button" variant="outline" onClick={useMyLocation} className="w-full">
        <LocateIcon />
        Use my current location
      </Button>
      {geoError && <p className="text-destructive text-sm">{geoError}</p>}

      <form onSubmit={submitManual} className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="manual-lat" className="text-xs">
            Latitude
          </Label>
          <Input
            id="manual-lat"
            inputMode="decimal"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="manual-lon" className="text-xs">
            Longitude
          </Label>
          <Input
            id="manual-lon"
            inputMode="decimal"
            value={manualLon}
            onChange={(e) => setManualLon(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm" variant="secondary" className="col-span-2">
          Set location
        </Button>
      </form>
    </div>
  );
}
