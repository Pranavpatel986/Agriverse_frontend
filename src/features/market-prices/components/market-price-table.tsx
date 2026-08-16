import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatInr } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/components/feedback/empty-state";
import type { MarketPriceEntry } from "../types/market-price.types";

export function MarketPriceTable({ prices }: { prices: MarketPriceEntry[] }) {
  if (prices.length === 0) {
    return (
      <EmptyState
        title="No recent price data for this crop"
        description="Try a different crop or market."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Market</TableHead>
          <TableHead>State</TableHead>
          <TableHead className="text-right">Min</TableHead>
          <TableHead className="text-right">Max</TableHead>
          <TableHead className="text-right">Modal</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prices.map((entry, i) => (
          <TableRow key={`${entry.marketName}-${entry.priceDate}-${i}`}>
            <TableCell className="font-medium">{entry.marketName}</TableCell>
            <TableCell className="text-muted-foreground">{entry.state}</TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {formatInr(entry.minPrice)}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {formatInr(entry.maxPrice)}
            </TableCell>
            <TableCell className="text-right font-mono font-semibold tabular-nums">
              {formatInr(entry.modalPrice)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {format(new Date(entry.priceDate), "MMM d, yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
