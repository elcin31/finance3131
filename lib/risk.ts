/**
 * Portfolio & position risk calculations.
 * All deterministic. Historical-price-based metrics (volatility, beta,
 * drawdown, correlation) gracefully return null when price history isn't
 * available rather than fabricating a number.
 */

import {
  HistoricalPriceSeries,
  PortfolioAlert,
  PortfolioRiskMetrics,
  PortfolioRiskSettings,
  Position,
  PositionWithMetrics,
  PricePoint,
  RiskLevel,
} from "@/lib/types";

const TRADING_DAYS_PER_YEAR = 252;

export function marketValue(position: Position): number {
  return position.quantity * position.currentPrice;
}

export function costBasis(position: Position): number {
  return position.quantity * position.averagePurchasePrice;
}

/** Simple daily returns from a price series, ordered oldest -> newest. */
export function dailyReturns(prices: PricePoint[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1].price;
    const curr = prices[i].price;
    if (prev > 0) returns.push((curr - prev) / prev);
  }
  return returns;
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) /
    (values.length - 1);
  return Math.sqrt(variance);
}

/** Annualized volatility from daily returns. */
export function annualizedVolatility(returns: number[]): number | null {
  if (returns.length < 2) return null;
  return stdDev(returns) * Math.sqrt(TRADING_DAYS_PER_YEAR);
}

/** Annualized expected return from daily returns (arithmetic mean, annualized). */
export function annualizedReturn(returns: number[]): number | null {
  if (returns.length === 0) return null;
  return mean(returns) * TRADING_DAYS_PER_YEAR;
}

export function covariance(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const aSlice = a.slice(-n);
  const bSlice = b.slice(-n);
  const meanA = mean(aSlice);
  const meanB = mean(bSlice);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += (aSlice[i] - meanA) * (bSlice[i] - meanB);
  }
  return sum / (n - 1);
}

export function correlation(a: number[], b: number[]): number | null {
  const n = Math.min(a.length, b.length);
  if (n < 2) return null;
  const cov = covariance(a, b);
  const sdA = stdDev(a.slice(-n));
  const sdB = stdDev(b.slice(-n));
  if (sdA === 0 || sdB === 0) return null;
  return cov / (sdA * sdB);
}

/** Beta of an asset's returns relative to a benchmark's returns. */
export function beta(
  assetReturns: number[],
  benchmarkReturns: number[]
): number | null {
  const n = Math.min(assetReturns.length, benchmarkReturns.length);
  if (n < 2) return null;
  const benchSlice = benchmarkReturns.slice(-n);
  const benchVariance = Math.pow(stdDev(benchSlice), 2);
  if (benchVariance === 0) return null;
  const cov = covariance(assetReturns.slice(-n), benchSlice);
  return cov / benchVariance;
}

/** Sharpe ratio using annualized return, volatility, and a risk-free rate. */
export function sharpeRatio(
  annReturn: number | null,
  annVolatility: number | null,
  riskFreeRate: number
): number | null {
  if (annReturn === null || annVolatility === null || annVolatility === 0)
    return null;
  return (annReturn - riskFreeRate) / annVolatility;
}

/** Maximum drawdown (most negative peak-to-trough decline) from a price series. */
export function maxDrawdown(prices: PricePoint[]): number | null {
  if (prices.length < 2) return null;
  let peak = prices[0].price;
  let maxDD = 0;
  for (const p of prices) {
    if (p.price > peak) peak = p.price;
    const dd = (p.price - peak) / peak;
    if (dd < maxDD) maxDD = dd;
  }
  return maxDD;
}

function classifyConcentration(weight: number): RiskLevel {
  if (weight >= 0.2) return "High";
  if (weight >= 0.12) return "Elevated";
  if (weight >= 0.06) return "Moderate";
  return "Low";
}

/**
 * Enriches raw positions with computed portfolio-weight and risk metrics.
 * bearShockByAssetType provides a rough potential-downside estimate per
 * asset type when no historical price data is available for that ticker.
 */
export function buildPositionsWithMetrics(
  positions: Position[],
  settings: PortfolioRiskSettings,
  priceHistories: Record<string, HistoricalPriceSeries> = {},
  bearShockDefault = -0.3
): PositionWithMetrics[] {
  const totalValue = positions.reduce((sum, p) => sum + marketValue(p), 0);

  return positions.map((position) => {
    const mv = marketValue(position);
    const cb = costBasis(position);
    const weight = totalValue > 0 ? mv / totalValue : 0;

    const history = priceHistories[position.ticker];
    let potentialDownside = bearShockDefault;
    if (history && history.prices.length > 1) {
      const dd = maxDrawdown(history.prices);
      if (dd !== null) potentialDownside = dd;
    }

    const unrealizedGainLoss = mv - cb;
    const unrealizedGainLossPct = cb > 0 ? unrealizedGainLoss / cb : 0;

    // Approximate contribution to portfolio risk: weight scaled by relative
    // downside severity vs. the default bear shock — a simplified proxy
    // used in the absence of a full covariance matrix across all holdings.
    const contributionToRisk =
      weight * (Math.abs(potentialDownside) / Math.abs(bearShockDefault));

    const potentialLossAmount = Math.abs(potentialDownside) * mv;
    const potentialGainAmount = Math.max(unrealizedGainLoss, mv * 0.3); // simplified upside proxy
    const riskRewardRatio =
      potentialLossAmount > 0 ? potentialGainAmount / potentialLossAmount : null;

    return {
      ...position,
      marketValue: mv,
      costBasis: cb,
      unrealizedGainLoss,
      unrealizedGainLossPct,
      portfolioWeight: weight,
      contributionToRisk,
      potentialDownside,
      riskRewardRatio,
      concentrationRisk: classifyConcentration(weight),
      exceedsMaxPosition: weight > settings.maxPositionSize,
    };
  });
}

export function buildPortfolioRiskMetrics(
  positionsWithMetrics: PositionWithMetrics[],
  benchmarkReturns: number[] = [],
  priceHistories: Record<string, HistoricalPriceSeries> = {},
  riskFreeRate = 0.045
): PortfolioRiskMetrics {
  const totalValue = positionsWithMetrics.reduce(
    (sum, p) => sum + p.marketValue,
    0
  );

  const sectorConcentration: Record<string, number> = {};
  const geographicConcentration: Record<string, number> = {};

  for (const p of positionsWithMetrics) {
    sectorConcentration[p.sector] =
      (sectorConcentration[p.sector] || 0) + p.portfolioWeight;
    geographicConcentration[p.region] =
      (geographicConcentration[p.region] || 0) + p.portfolioWeight;
  }

  const sortedByWeight = [...positionsWithMetrics].sort(
    (a, b) => b.portfolioWeight - a.portfolioWeight
  );
  const largestPositionWeight = sortedByWeight[0]?.portfolioWeight ?? 0;
  const top3ConcentrationWeight = sortedByWeight
    .slice(0, 3)
    .reduce((sum, p) => sum + p.portfolioWeight, 0);
  const top5ConcentrationWeight = sortedByWeight
    .slice(0, 5)
    .reduce((sum, p) => sum + p.portfolioWeight, 0);

  const cashAllocation = positionsWithMetrics
    .filter((p) => p.assetType === "Cash")
    .reduce((sum, p) => sum + p.portfolioWeight, 0);

  // Attempt portfolio-level historical metrics only if we have price
  // histories covering at least one meaningful position.
  const tickersWithHistory = positionsWithMetrics.filter(
    (p) => priceHistories[p.ticker]?.prices?.length > 1
  );

  let volatility: number | null = null;
  let expectedReturn: number | null = null;
  let portfolioBeta: number | null = null;
  let sharpe: number | null = null;
  let drawdown: number | null = null;

  if (tickersWithHistory.length > 0) {
    // Weighted blend of individual volatilities as a simplified portfolio
    // volatility proxy (ignores cross-asset correlation effects).
    let weightedVarianceProxy = 0;
    let weightedReturn = 0;
    let weightedBeta = 0;
    let weightSum = 0;
    let worstDrawdown = 0;

    for (const p of tickersWithHistory) {
      const returns = dailyReturns(priceHistories[p.ticker].prices);
      const vol = annualizedVolatility(returns);
      const ret = annualizedReturn(returns);
      const b =
        benchmarkReturns.length > 1 ? beta(returns, benchmarkReturns) : null;
      const dd = maxDrawdown(priceHistories[p.ticker].prices);

      if (vol !== null) weightedVarianceProxy += p.portfolioWeight * vol;
      if (ret !== null) weightedReturn += p.portfolioWeight * ret;
      if (b !== null) weightedBeta += p.portfolioWeight * b;
      weightSum += p.portfolioWeight;
      if (dd !== null && dd < worstDrawdown) worstDrawdown = dd;
    }

    if (weightSum > 0) {
      volatility = weightedVarianceProxy;
      expectedReturn = weightedReturn;
      portfolioBeta = benchmarkReturns.length > 1 ? weightedBeta : null;
      sharpe = sharpeRatio(expectedReturn, volatility, riskFreeRate);
      drawdown = worstDrawdown;
    }
  }

  return {
    totalValue,
    expectedReturn,
    volatility,
    beta: portfolioBeta,
    sharpeRatio: sharpe,
    maxDrawdown: drawdown,
    sectorConcentration,
    geographicConcentration,
    largestPositionWeight,
    top3ConcentrationWeight,
    top5ConcentrationWeight,
    cashAllocation,
  };
}

export function generatePortfolioAlerts(
  positionsWithMetrics: PositionWithMetrics[],
  metrics: PortfolioRiskMetrics,
  settings: PortfolioRiskSettings
): PortfolioAlert[] {
  const alerts: PortfolioAlert[] = [];

  for (const p of positionsWithMetrics) {
    if (p.exceedsMaxPosition) {
      alerts.push({
        id: `max-pos-${p.ticker}`,
        severity: "warning",
        message: `${p.ticker} exceeds maximum allocation (${(
          p.portfolioWeight * 100
        ).toFixed(1)}% vs ${(settings.maxPositionSize * 100).toFixed(
          0
        )}% limit)`,
        relatedTicker: p.ticker,
      });
    }
  }

  for (const [sector, weight] of Object.entries(metrics.sectorConcentration)) {
    if (weight > settings.maxSectorConcentration) {
      alerts.push({
        id: `sector-${sector}`,
        severity: "warning",
        message: `${sector} sector concentration is high (${(
          weight * 100
        ).toFixed(1)}% of portfolio)`,
      });
    }
  }

  if (metrics.maxDrawdown !== null && metrics.maxDrawdown < -0.25) {
    alerts.push({
      id: "drawdown",
      severity: "critical",
      message: `Portfolio risk increased — largest observed drawdown reached ${(
        metrics.maxDrawdown * 100
      ).toFixed(1)}%`,
    });
  }

  if (metrics.cashAllocation < 0.02) {
    alerts.push({
      id: "cash-low",
      severity: "info",
      message: "Cash allocation is minimal — limited dry powder for opportunities",
    });
  }

  return alerts;
}
