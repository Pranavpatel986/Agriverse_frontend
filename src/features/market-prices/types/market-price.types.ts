import type { PublicId } from "@/shared/types/api";

export interface MarketPriceEntry {
  marketName: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string; // date
  source: string;
}

export interface MarketPricesResult {
  cropId: PublicId;
  prices: MarketPriceEntry[];
  latestModalPrice?: number;
}

export interface MarketPriceParams {
  cropId: string; // required by the endpoint
  state?: string;
  marketName?: string;
  from?: string;
  to?: string;
}
