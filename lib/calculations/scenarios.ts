/**
 * Scenario analysis: Bear / Base / Bull cases and manual shock simulation.
 * All outputs are explicitly hypothetical, deterministic recalculations —
 * never predictions.
 */

import { calculateDCF } from "./dcf";
import {
  DCFInputs,
  ManualShock,
  Position,
  PositionWithMetrics,
  ScenarioAssumptions,
  ScenarioResult,
  ShockImpactResult,
} from "@/lib/types";
import { marketValue } from "./risk";

export const DEFAULT_SCENARIOS: ScenarioAssumptions[] = [
  {
    name: "Bear Case",
    revenueGrowthDelta: -0.06,
    fcfMarginDelta: -0.04,
    waccDelta: 0.015,
    description:
      "Slower growth, margin compression, and a higher discount rate reflecting increased risk aversion.",
  },
  {
    name: "Base Case",
    revenueGrowthDelta: 0,
    fcfMarginDelta: 0,
    waccDelta: 0,
    description: "Current assumptions held constant — the central estimate.",
  },
  {
    name: "Bull Case",
    revenueGrowthDelta: 0.05,
    fcfMarginDelta: 0.03,
    waccDelta: -0.005,
    description:
      "Stronger growth and margin expansion with a modestly lower discount rate.",
  },
];

export function runScenario(
  baseInputs: DCFInputs,
  assumptions: ScenarioAssumptions,
  currentPortfolioValue: number,
  positionMarketValueForTicker: number,
  positionSharesForTicker: number
): ScenarioResult {
  const scenarioInputs: DCFInputs = {
    ...baseInputs,
    revenueGrowthRate: Math.max(
      -0.5,
      baseInputs.revenueGrowthRate + assumptions.revenueGrowthDelta
    ),
    fcfMargin: Math.max(0.01, baseInputs.fcfMargin + assumptions.fcfMarginDelta),
    wacc: Math.max(0.02, baseInputs.wacc + assumptions.waccDelta),
  };

  const result = calculateDCF(scenarioInputs);

  const newPositionValue = result.fairValuePerShare * positionSharesForTicker;
  const valueDelta = newPositionValue - positionMarketValueForTicker;
  const portfolioValue = currentPortfolioValue + valueDelta;
  const portfolioReturn =
    currentPortfolioValue > 0 ? valueDelta / currentPortfolioValue : 0;

  const potentialDrawdown =
    assumptions.name === "Bear Case"
      ? Math.min(0, result.upsideDownside)
      : 0;

  return {
    name: assumptions.name,
    fairValuePerShare: result.fairValuePerShare,
    portfolioValue,
    portfolioReturn,
    potentialDrawdown,
  };
}

export function runAllScenarios(
  baseInputs: DCFInputs,
  currentPortfolioValue: number,
  positionMarketValueForTicker: number,
  positionSharesForTicker: number,
  scenarios: ScenarioAssumptions[] = DEFAULT_SCENARIOS
): ScenarioResult[] {
  return scenarios.map((s) =>
    runScenario(
      baseInputs,
      s,
      currentPortfolioValue,
      positionMarketValueForTicker,
      positionSharesForTicker
    )
  );
}

/**
 * Applies manual percentage shocks to specific tickers (or "MARKET" for all
 * equity positions) and computes the approximate portfolio-level impact.
 * This is a simple linear repricing — it does not model correlation,
 * liquidity, or second-order effects.
 */
export function applyManualShocks(
  positions: PositionWithMetrics[],
  shocks: ManualShock[]
): ShockImpactResult {
  const originalPortfolioValue = positions.reduce(
    (sum, p) => sum + p.marketValue,
    0
  );

  const positionImpacts = positions.map((p) => {
    const relevantShocks = shocks.filter(
      (s) => s.targetTicker === p.ticker || s.targetTicker === "MARKET"
    );

    // If multiple shocks apply, compound them multiplicatively.
    let shockedValue = p.marketValue;
    for (const shock of relevantShocks) {
      if (p.assetType === "Cash") continue; // cash unaffected by market shocks
      shockedValue = shockedValue * (1 + shock.shockPct);
    }

    return {
      ticker: p.ticker,
      originalValue: p.marketValue,
      shockedValue,
      impactAmount: shockedValue - p.marketValue,
    };
  });

  const shockedPortfolioValue = positionImpacts.reduce(
    (sum, p) => sum + p.shockedValue,
    0
  );
  const impactAmount = shockedPortfolioValue - originalPortfolioValue;
  const impactPct =
    originalPortfolioValue > 0 ? impactAmount / originalPortfolioValue : 0;

  return {
    shocks,
    originalPortfolioValue,
    shockedPortfolioValue,
    impactAmount,
    impactPct,
    positionImpacts,
  };
}
