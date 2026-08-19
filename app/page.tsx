import {
  fetchBenchmarkReturns,
  fetchCompanyFinancials,
  fetchCompanyList,
  fetchCompanyProfile,
  fetchStarterPortfolio,
} from "@/lib/data/financial-data-service";
import { getHistoricalPrices } from "@/lib/mock-data/prices";
import {
  buildPortfolioRiskMetrics,
  buildPositionsWithMetrics,
  generatePortfolioAlerts,
} from "@/lib/calculations/risk";
import {
  buildDerivedFinancialSeries,
  freeCashFlow,
  fcfMargin,
  revenueGrowth,
} from "@/lib/calculations/ratios";
import { calculateDCF } from "@/lib/calculations/dcf";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Watchlist, WatchlistRow } from "@/components/dashboard/Watchlist";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { DCFInputs, HistoricalPriceSeries, RiskLevel } from "@/lib/types";

const SETTINGS = { maxPositionSize: 0.1, maxSectorConcentration: 0.35 };

function riskLevelFromVolatility(vol: number | null): RiskLevel {
  if (vol === null) return "Moderate";
  if (vol > 0.45) return "High";
  if (vol > 0.3) return "Elevated";
  if (vol > 0.18) return "Moderate";
  return "Low";
}

export default async function DashboardPage() {
  const [positions, benchmarkReturns, companies] = await Promise.all([
    fetchStarterPortfolio(),
    fetchBenchmarkReturns(),
    fetchCompanyList(),
  ]);

  const priceHistories: Record<string, HistoricalPriceSeries> = {};
  for (const p of positions) {
    const history = getHistoricalPrices(p.ticker);
    if (history) priceHistories[p.ticker] = history;
  }

  const positionsWithMetrics = buildPositionsWithMetrics(
    positions,
    SETTINGS,
    priceHistories
  );
  const riskMetrics = buildPortfolioRiskMetrics(
    positionsWithMetrics,
    benchmarkReturns,
    priceHistories
  );
  const alerts = generatePortfolioAlerts(positionsWithMetrics, riskMetrics, SETTINGS);

  // Build watchlist: for each covered company, compute DCF fair value using
  // the same default assumptions as the DCF page, plus current ratios.
  const watchlistRows: WatchlistRow[] = [];
  for (const company of companies) {
    const financials = await fetchCompanyFinancials(company.ticker);
    const profile = await fetchCompanyProfile(company.ticker);
    if (!financials || !profile) continue;

    const latest = financials.history[financials.history.length - 1];
    const prior = financials.history[financials.history.length - 2];
    const growth = revenueGrowth(latest, prior);
    const derived = buildDerivedFinancialSeries(financials);
    const latestDerived = derived[derived.length - 1];

    const dcfInputs: DCFInputs = {
      currentRevenue: latest.revenue,
      currentFCF: freeCashFlow(latest),
      revenueGrowthRate: growth !== null ? Math.max(0, Math.min(0.35, growth)) : 0.08,
      fcfMargin: Math.max(0.02, fcfMargin(latest)),
      forecastYears: 5,
      wacc: 0.09,
      terminalGrowthRate: 0.025,
      netDebt: latest.totalDebt - latest.cash,
      sharesOutstanding: profile.sharesOutstanding,
      currentSharePrice: profile.currentPrice,
    };
    const dcfResult = calculateDCF(dcfInputs);
    const history = getHistoricalPrices(company.ticker);
    const vol =
      history && history.prices.length > 1
        ? (() => {
            const returns: number[] = [];
            for (let i = 1; i < history.prices.length; i++) {
              returns.push(
                (history.prices[i].price - history.prices[i - 1].price) /
                  history.prices[i - 1].price
              );
            }
            const m = returns.reduce((s, r) => s + r, 0) / returns.length;
            const variance =
              returns.reduce((s, r) => s + Math.pow(r - m, 2), 0) /
              (returns.length - 1);
            return Math.sqrt(variance) * Math.sqrt(252);
          })()
        : null;

    watchlistRows.push({
      ticker: company.ticker,
      name: company.name,
      currentPrice: profile.currentPrice,
      fairValue: dcfResult.fairValuePerShare,
      marginOfSafety: dcfResult.marginOfSafety,
      pe: latest.eps > 0 ? profile.currentPrice / latest.eps : null,
      roic: latestDerived.roic,
      revenueGrowth: growth,
      riskLevel: riskLevelFromVolatility(vol),
    });
  }

  const totalCostBasis = positionsWithMetrics.reduce((sum, p) => sum + p.costBasis, 0);
  const totalReturn =
    totalCostBasis > 0
      ? (riskMetrics.totalValue - totalCostBasis) / totalCostBasis
      : 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">
          Portfolio Overview
        </h1>
        <p className="mt-0.5 text-2xs text-ink-400">
          Analyze the Business → Value the Business → Measure the Risk → Size
          the Position → Make a Disciplined Decision
        </p>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-1.5">
          {alerts.slice(0, 3).map((a) => (
            <AlertBanner key={a.id} severity={a.severity} message={a.message} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatTile label="Total Value" value={formatCurrency(riskMetrics.totalValue)} />
        <StatTile
          label="Total Return"
          value={formatPercent(totalReturn)}
          deltaTone={totalReturn >= 0 ? "positive" : "negative"}
        />
        <StatTile label="Volatility" value={formatPercent(riskMetrics.volatility)} />
        <StatTile
          label="Sharpe Ratio"
          value={riskMetrics.sharpeRatio !== null ? riskMetrics.sharpeRatio.toFixed(2) : "—"}
        />
        <StatTile
          label="Max Drawdown"
          value={formatPercent(riskMetrics.maxDrawdown)}
          deltaTone="negative"
        />
        <StatTile
          label="Largest Position"
          value={formatPercent(riskMetrics.largestPositionWeight)}
        />
        <StatTile label="Cash Allocation" value={formatPercent(riskMetrics.cashAllocation)} />
        <StatTile
          label="Positions"
          value={String(positionsWithMetrics.length)}
        />
      </div>

      <Card>
        <CardHeader
          title="Watchlist"
          subtitle="Fair value from default DCF assumptions — adjust per-company on the DCF page"
        />
        <CardBody className="p-0">
          <Watchlist rows={watchlistRows} />
        </CardBody>
      </Card>
    </div>
  );
}
