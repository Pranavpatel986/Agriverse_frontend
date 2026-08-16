"use client";

import { format } from "date-fns";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatInr } from "@/shared/lib/utils";
import type { MarketPriceEntry } from "../types/market-price.types";

export function PriceTrendSparkline({ prices }: { prices: MarketPriceEntry[] }) {
  if (prices.length < 2) return null;

  const chartData = [...prices]
    .sort((a, b) => new Date(a.priceDate).getTime() - new Date(b.priceDate).getTime())
    .map((p) => ({ date: p.priceDate, modalPrice: p.modalPrice }));

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <h3 className="text-foreground mb-2 text-sm font-semibold">Modal price trend</h3>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tickFormatter={(d) => format(new Date(d), "MMM d")}
            tick={{ fontSize: 11 }}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            tickFormatter={(v) => formatInr(v)}
            tick={{ fontSize: 11 }}
            width={70}
            stroke="var(--muted-foreground)"
          />
          <Tooltip
            formatter={(value) => formatInr(Number(value))}
            labelFormatter={(label) => format(new Date(String(label)), "MMM d, yyyy")}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="modalPrice"
            stroke="var(--color-canopy-500)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
