import {
  fetchBenchmarkReturns,
  fetchStarterPortfolio,
} from "@/lib/data/financial-data-service";
import { getHistoricalPrices } from "@/lib/mock-data/prices";
import { HistoricalPriceSeries } from "@/lib/types";
import { PortfolioWorkspace } from "@/components/risk/PortfolioWorkspace";

export default async function PortfolioPage() {
  const [positions, benchmarkReturns] = await Promise.all([
    fetchStarterPortfolio(),
    fetchBenchmarkReturns(),
  ]);

  const priceHistories: Record<string, HistoricalPriceSeries> = {};
  for (const p of positions) {
    const history = getHistoricalPrices(p.ticker);
    if (history) priceHistories[p.ticker] = history;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">
          Risk Management
        </h1>
        <p className="mt-0.5 text-2xs text-ink-400">
          Portfolio-level risk metrics, position sizing, and concentration
          limits. Add or remove positions to see limits update live.
        </p>
      </div>
      <PortfolioWorkspace
        initialPositions={positions}
        priceHistories={priceHistories}
        benchmarkReturns={benchmarkReturns}
      />
    </div>
  );
}
