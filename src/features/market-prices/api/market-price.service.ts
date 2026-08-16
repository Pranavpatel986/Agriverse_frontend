import { apiClient } from "@/shared/lib/api/client";
import { endpoints } from "@/shared/lib/api/endpoints";
import type { MarketPriceParams, MarketPricesResult } from "../types/market-price.types";

export const marketPriceService = {
  lookup: (params: MarketPriceParams) =>
    apiClient
      .get<MarketPricesResult>(endpoints.marketPrices.lookup, { params })
      .then((res) => res.data),
};
