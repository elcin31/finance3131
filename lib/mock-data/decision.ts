/**
 * Connects valuation output (DCF) with risk/portfolio constraints to produce
 * a structured, factual explanation of the tension between the two.
 *
 * IMPORTANT: This module never outputs a BUY/SELL recommendation. It only
 * describes, in plain factual terms, what the numbers show. Any narrative
 * text is template-based and deterministic — not LLM-generated — so it can
 * be trusted to accurately reflect the calculated figures.
 */

import { DCFResult, PortfolioRiskSettings, PositionWithMetrics } from "@/lib/types";

export interface DecisionFactor {
  label: string;
  detail: string;
  tone: "positive" | "neutral" | "caution";
}

export interface InvestmentContext {
  ticker: string;
  dcfResult: DCFResult;
  position: PositionWithMetrics | null;
  settings: PortfolioRiskSettings;
  sectorConcentration: number; // decimal, this position's sector weight
  volatility: number | null;
}

export interface DecisionSummary {
  factors: DecisionFactor[];
  narrative: string;
}

export function buildDecisionSummary(ctx: InvestmentContext): DecisionSummary {
  const factors: DecisionFactor[] = [];
  const { dcfResult, position, settings, sectorConcentration, volatility } = ctx;

  // Valuation factor
  if (dcfResult.marginOfSafety > 0.15) {
    factors.push({
      label: "Valuation",
      detail: `DCF fair value implies a ${(dcfResult.marginOfSafety * 100).toFixed(
        1
      )}% margin of safety versus the current price.`,
      tone: "positive",
    });
  } else if (dcfResult.marginOfSafety < -0.1) {
    factors.push({
      label: "Valuation",
      detail: `Current price is ${Math.abs(
        dcfResult.marginOfSafety * 100
      ).toFixed(1)}% above the estimated fair value.`,
      tone: "caution",
    });
  } else {
    factors.push({
      label: "Valuation",
      detail: `Current price is close to estimated fair value (margin of safety ${(
        dcfResult.marginOfSafety * 100
      ).toFixed(1)}%).`,
      tone: "neutral",
    });
  }

  // Volatility factor
  if (volatility !== null) {
    if (volatility > 0.4) {
      factors.push({
        label: "Volatility",
        detail: `Annualized volatility is elevated at ${(volatility * 100).toFixed(
          1
        )}%.`,
        tone: "caution",
      });
    } else {
      factors.push({
        label: "Volatility",
        detail: `Annualized volatility is ${(volatility * 100).toFixed(
          1
        )}%, within a moderate range.`,
        tone: "neutral",
      });
    }
  }

  // Position size / concentration factor
  if (position) {
    if (position.exceedsMaxPosition) {
      factors.push({
        label: "Position Size",
        detail: `Position is ${(position.portfolioWeight * 100).toFixed(
          1
        )}% of the portfolio, exceeding the ${(
          settings.maxPositionSize * 100
        ).toFixed(0)}% limit.`,
        tone: "caution",
      });
    } else {
      factors.push({
        label: "Position Size",
        detail: `Position is ${(position.portfolioWeight * 100).toFixed(
          1
        )}% of the portfolio, within the ${(
          settings.maxPositionSize * 100
        ).toFixed(0)}% limit.`,
        tone: "neutral",
      });
    }
  }

  // Sector concentration factor
  if (sectorConcentration > settings.maxSectorConcentration) {
    factors.push({
      label: "Sector Concentration",
      detail: `This sector already represents ${(
        sectorConcentration * 100
      ).toFixed(1)}% of the portfolio, above the ${(
        settings.maxSectorConcentration * 100
      ).toFixed(0)}% guideline.`,
      tone: "caution",
    });
  }

  const cautionCount = factors.filter((f) => f.tone === "caution").length;
  const positiveCount = factors.filter((f) => f.tone === "positive").length;

  let narrative: string;
  if (positiveCount > 0 && cautionCount === 0) {
    narrative =
      "Valuation appears attractive and risk/concentration factors do not currently constrain position size.";
  } else if (positiveCount > 0 && cautionCount > 0) {
    narrative =
      "Valuation appears attractive, but portfolio risk and concentration factors may limit the appropriate position size.";
  } else if (positiveCount === 0 && cautionCount > 0) {
    narrative =
      "Valuation does not currently show a clear margin of safety, and risk factors warrant caution.";
  } else {
    narrative =
      "Valuation is roughly in line with the current price, with no major risk constraints flagged.";
  }

  return { factors, narrative };
}
