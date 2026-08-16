export interface WeatherResult {
  regionName: string;
  /** The OpenAPI schema types this as an arbitrary JsonNode — no fixed
   *  shape documented. Modeled loosely and read defensively in
   *  WeatherCard rather than assuming specific fields exist. */
  forecast: unknown;
  fetchedAt: string;
  expiresAt: string;
}

export interface WeatherParams {
  lat?: number;
  lon?: number;
  savedLocationId?: string;
}
