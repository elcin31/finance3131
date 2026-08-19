/**
 * AI / narrative explanation layer.
 *
 * CRITICAL BOUNDARY: functions in this file NEVER compute financial figures.
 * They only receive already-calculated numbers (from lib/calculations/*)
 * and turn them into readable text. This keeps a hard separation between
 * "what the math says" (deterministic, auditable) and "how we explain it"
 * (narrative).
 *
 * This MVP ships with rule-based template generation so the app works with
 * zero external dependencies. To upgrade to real LLM-generated prose:
 *   1. Add an app/api/explain/route.ts server route.
 *   2. Inside it, call the Anthropic API, passing the SAME structured
 *      numbers this file already receives (never let the model invent
 *      figures — always pass computed values in the prompt and instruct it
 *      to only narrate them).
 *   3. Store your API key in Vercel Environment Variables, read via
 *      process.env on the server only.
 *   4. Have UI components call your new route instead of these local
 *      functions, keeping the same return shape (a string or string[]).
 */

import { DerivedFinancialYear, BusinessAnalysisBlock } from "@/lib/types";

export function explainGrowth(history: DerivedFinancialYear[]): string {
  const recent = history[history.length - 1];
  if (!recent || recent.revenueGrowth === null) {
    return "Insufficient history to characterize the growth trend.";
  }
  const g = recent.revenueGrowth;
  if (g > 0.15) return `Revenue growth is strong at ${(g * 100).toFixed(1)}% in the most recent fiscal year.`;
  if (g > 0.05) return `Revenue growth is moderate at ${(g * 100).toFixed(1)}% in the most recent fiscal year.`;
  if (g > 0) return `Revenue growth has slowed to ${(g * 100).toFixed(1)}% in the most recent fiscal year.`;
  return `Revenue declined ${Math.abs(g * 100).toFixed(1)}% in the most recent fiscal year.`;
}

export function explainProfitability(history: DerivedFinancialYear[]): string {
  const recent = history[history.length - 1];
  if (!recent) return "No data available.";
  const margin = recent.operatingMargin;
  if (margin > 0.25) return `Operating margin is strong at ${(margin * 100).toFixed(1)}%, indicating solid pricing power or cost discipline.`;
  if (margin > 0.1) return `Operating margin is healthy at ${(margin * 100).toFixed(1)}%.`;
  if (margin > 0) return `Operating margin is thin at ${(margin * 100).toFixed(1)}%, suggesting limited operating leverage or competitive pressure.`;
  return `Operating margin is negative (${(margin * 100).toFixed(1)}%), meaning core operations are not currently profitable.`;
}

export function explainBalanceSheet(history: DerivedFinancialYear[]): string {
  const recent = history[history.length - 1];
  if (!recent) return "No data available.";
  const de = recent.netDebtToEbitda;
  if (de < 0) return `Net debt is negative relative to EBITDA (${de.toFixed(1)}x), meaning the company holds more cash than debt.`;
  if (de < 1.5) return `Net Debt/EBITDA of ${de.toFixed(1)}x indicates a conservative balance sheet.`;
  if (de < 3) return `Net Debt/EBITDA of ${de.toFixed(1)}x is moderate leverage.`;
  return `Net Debt/EBITDA of ${de.toFixed(1)}x indicates elevated leverage worth monitoring.`;
}

export function explainCashFlowQuality(history: DerivedFinancialYear[]): string {
  const recent = history[history.length - 1];
  if (!recent) return "No data available.";
  const margin = recent.fcfMargin;
  if (margin > 0.2) return `Free cash flow margin of ${(margin * 100).toFixed(1)}% is strong, indicating high cash conversion.`;
  if (margin > 0.08) return `Free cash flow margin of ${(margin * 100).toFixed(1)}% is reasonable.`;
  if (margin > 0) return `Free cash flow margin of ${(margin * 100).toFixed(1)}% is thin — a large share of earnings is being reinvested or consumed by working capital.`;
  return `Free cash flow is negative, meaning the business is currently consuming cash.`;
}

export function identifyMainRisks(
  history: DerivedFinancialYear[]
): string[] {
  const risks: string[] = [];
  const recent = history[history.length - 1];
  const prior = history[history.length - 2];
  if (!recent) return ["Insufficient data to assess risks."];

  if (recent.netDebtToEbitda > 3) {
    risks.push("Elevated leverage relative to EBITDA increases sensitivity to rate or earnings shocks.");
  }
  if (recent.fcfMargin < 0.05) {
    risks.push("Thin free cash flow margin limits flexibility for buybacks, dividends, or debt paydown.");
  }
  if (prior && recent.operatingMargin < prior.operatingMargin - 0.02) {
    risks.push("Operating margin has compressed versus the prior year, worth monitoring for a trend.");
  }
  if (prior && recent.revenueGrowth !== null && prior.revenueGrowth !== null && recent.revenueGrowth < prior.revenueGrowth - 0.03) {
    risks.push("Revenue growth has decelerated compared to the prior year.");
  }
  if (risks.length === 0) {
    risks.push("No major red flags identified in the available financial history; monitor competitive and macro factors independently.");
  }
  return risks;
}

export function buildBusinessAnalysisBlocks(
  history: DerivedFinancialYear[]
): BusinessAnalysisBlock[] {
  return [
    {
      title: "Growth",
      summary: explainGrowth(history),
      points: [],
    },
    {
      title: "Profitability",
      summary: explainProfitability(history),
      points: [],
    },
    {
      title: "Balance Sheet",
      summary: explainBalanceSheet(history),
      points: [],
    },
    {
      title: "Cash Flow Quality",
      summary: explainCashFlowQuality(history),
      points: [],
    },
    {
      title: "Main Risks",
      summary: "Key items to monitor based on reported financials:",
      points: identifyMainRisks(history),
    },
  ];
}
