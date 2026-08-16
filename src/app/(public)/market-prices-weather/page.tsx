import type { Metadata } from "next";
import { MarketPricesWeatherContent } from "@/features/market-prices/components/market-prices-weather-content";

// Intentionally excluded from static generation — prices and weather
// must always be current, per the spec.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Market Prices & Weather",
  description: "Check current mandi prices and local weather conditions.",
  robots: { index: false, follow: true }, // always-changing data, not a canonical indexable page
};

export default function MarketPricesWeatherPage() {
  return <MarketPricesWeatherContent />;
}
