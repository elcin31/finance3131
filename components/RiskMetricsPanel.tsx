import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { PortfolioRiskMetrics } from "@/lib/types";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/utils/format";

export function RiskMetricsPanel({ metrics }: { metrics: PortfolioRiskMetrics }) {
  return (
    <Card>
      <CardHeader
        title="Portfolio Risk Metrics"
        subtitle={
          metrics.volatility === null
            ? "Historical price data unavailable for some holdings"
            : "Based on ~2 years of simulated historical prices"
        }
      />
      <CardBody>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile label="Total Value" value={formatCurrency(metrics.totalValue)} />
          <StatTile
            label="Expected Return"
            value={formatPercent(metrics.expectedReturn)}
          />
          <StatTile label="Volatility" value={formatPercent(metrics.volatility)} />
          <StatTile label="Beta" value={formatMultiple(metrics.beta, 2)} />
          <StatTile label="Sharpe Ratio" value={formatMultiple(metrics.sharpeRatio, 2)} />
          <StatTile
            label="Max Drawdown"
            value={formatPercent(metrics.maxDrawdown)}
            deltaTone="negative"
          />
          <StatTile
            label="Largest Position"
            value={formatPercent(metrics.largestPositionWeight)}
          />
          <StatTile label="Cash Allocation" value={formatPercent(metrics.cashAllocation)} />
          <StatTile
            label="Top 3 Concentration"
            value={formatPercent(metrics.top3ConcentrationWeight)}
          />
          <StatTile
            label="Top 5 Concentration"
            value={formatPercent(metrics.top5ConcentrationWeight)}
          />
        </div>
      </CardBody>
    </Card>
  );
}
