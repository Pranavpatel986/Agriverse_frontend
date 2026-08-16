import { useQuery } from "@tanstack/react-query";
import { marketPriceService } from "../api/market-price.service";
import type { MarketPriceParams } from "../types/market-price.types";

export function useMarketPrices(params: MarketPriceParams | undefined) {
  return useQuery({
    queryKey: ["market-prices", params],
    queryFn: () => marketPriceService.lookup(params as MarketPriceParams),
    enabled: Boolean(params?.cropId),
  });
}
