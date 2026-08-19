import { DataTable, DataTableColumn } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { PositionWithMetrics } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function PositionsTable({
  positions,
  onRemove,
}: {
  positions: PositionWithMetrics[];
  onRemove?: (id: string) => void;
}) {
  const columns: DataTableColumn<PositionWithMetrics>[] = [
    {
      key: "ticker",
      header: "Asset",
      render: (p) => (
        <div>
          <div className="font-mono font-semibold text-ink-900">{p.ticker}</div>
          <div className="text-2xs text-ink-400">{p.sector}</div>
        </div>
      ),
    },
    {
      key: "weight",
      header: "Weight",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5">
          {p.exceedsMaxPosition && <Badge tone="warning">!</Badge>}
          <span className={cn(p.exceedsMaxPosition && "font-semibold text-warn-dark")}>
            {formatPercent(p.portfolioWeight)}
          </span>
        </div>
      ),
    },
    {
      key: "value",
      header: "Market Value",
      align: "right",
      render: (p) => formatCurrency(p.marketValue),
    },
    {
      key: "gainLoss",
      header: "Unrealized P/L",
      align: "right",
      render: (p) => (
        <span className={p.unrealizedGainLoss >= 0 ? "text-gain" : "text-loss"}>
          {p.unrealizedGainLoss >= 0 ? "+" : ""}
          {formatPercent(p.unrealizedGainLossPct)}
        </span>
      ),
    },
    {
      key: "downside",
      header: "Potential Downside",
      align: "right",
      render: (p) => (
        <span className="text-loss">{formatPercent(p.potentialDownside)}</span>
      ),
    },
    {
      key: "concentration",
      header: "Concentration",
      align: "right",
      render: (p) => (
        <Badge
          tone={
            p.concentrationRisk === "High"
              ? "critical"
              : p.concentrationRisk === "Elevated"
              ? "warning"
              : p.concentrationRisk === "Moderate"
              ? "neutral"
              : "positive"
          }
        >
          {p.concentrationRisk}
        </Badge>
      ),
    },
    ...(onRemove
      ? [
          {
            key: "actions",
            header: "",
            align: "right" as const,
            render: (p: PositionWithMetrics) => (
              <button
                onClick={() => onRemove(p.id)}
                className="text-2xs font-medium text-loss hover:underline"
              >
                Remove
              </button>
            ),
          },
        ]
      : []),
  ];

  return <DataTable columns={columns} rows={positions} keyExtractor={(p) => p.id} />;
}
