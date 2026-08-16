import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { WeatherParams, WeatherResult } from "../types/weather.types";

export const weatherService = {
  lookup: (params: WeatherParams) =>
    apiClient
      .get<WeatherResult>(endpoints.weather.lookup, { params })
      .then((res) => res.data),
};
