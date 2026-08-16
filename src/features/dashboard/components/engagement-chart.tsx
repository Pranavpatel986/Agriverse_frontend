"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAnalyticsOverview } from "../hooks/use-dashboard";

/**
 * GET /admin/analytics/overview (per the REST API Specification) returns
 * five aggregate totals — no daily/weekly breakdown array. A genuine
 * "engagement over time" line chart isn't buildable against that
 * documented contract, so this renders a bar comparison of the
 * available aggregates instead of fabricating a fake trend line. If a
 * real time series is wanted, the endpoint needs a `series`/`timeline`
 * field added — worth raising with the backend team.
 */
export function EngagementChart() {
  const { data, isLoading, isError } = useAnalyticsOverview();

  if (isError) return null;

  const chartData = data
    ? [
        { metric: "Articles", value: data.totalArticles },
        { metric: "Users", value: data.totalUsers },
        { metric: "New users", value: data.newUsers },
        { metric: "Pending", value: data.pendingModeration },
      ]
    : [];

  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <h2 className="text-foreground mb-4 text-sm font-semibold">Overview breakdown</h2>
      {isLoading ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={224}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="metric"
              tick={{ fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" fill="var(--color-canopy-500)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
