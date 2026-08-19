import Link from "next/link";
import { DataTable, DataTableColumn } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/utils/format";
import { RiskLevel } from "@/lib/types";

export interface WatchlistRow {
  ticker: string;
  name: string;
  currentPrice: number;
  fairValue: number;
  marginOfSafety: number;
  pe: number | null;
  roic: number;
  revenueGrowth: number | null;
  riskLevel: RiskLevel;
}

export function Watchlist({ rows }: { rows: WatchlistRow[] }) {
  const columns: DataTableColumn<WatchlistRow>[] = [
    {
      key: "ticker",
      header: "Company",
      render: (r) => (
        <Link href={`/company/${r.ticker}`} className="block">
          <div className="font-mono font-semibold text-accent">{r.ticker}</div>
          <div className="text-2xs text-ink-400">{r.name}</div>
        </Link>
      ),
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      render: (r) => formatCurrency(r.currentPrice),
    },
    {
      key: "fairValue",
      header: "Fair Value",
      align: "right",
      render: (r) => formatCurrency(r.fairValue),
    },
    {
      key: "mos",
      header: "Margin of Safety",
      align: "right",
      render: (r) => (
        <span className={r.marginOfSafety >= 0 ? "text-gain" : "text-loss"}>
          {formatPercent(r.marginOfSafety)}
        </span>
      ),
    },
    { key: "pe", header: "P/E", align: "right", render: (r) => formatMultiple(r.pe) },
    { key: "roic", header: "ROIC", align: "right", render: (r) => formatPercent(r.roic) },
    {
      key: "growth",
      header: "Rev Growth",
      align: "right",
      render: (r) => formatPercent(r.revenueGrowth),
    },
    {
      key: "risk",
      header: "Risk",
      align: "right",
      render: (r) => (
        <Badge
          tone={
            r.riskLevel === "High"
              ? "critical"
              : r.riskLevel === "Elevated"
              ? "warning"
              : r.riskLevel === "Moderate"
              ? "neutral"
              : "positive"
          }
        >
          {r.riskLevel}
        </Badge>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} keyExtractor={(r) => r.ticker} />;
}
