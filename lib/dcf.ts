/**
 * Discounted Cash Flow valuation engine.
 * Pure, deterministic arithmetic. No LLM involvement anywhere in this file.
 * Given identical inputs, this always produces identical outputs.
 */

import {
  DCFForecastYear,
  DCFInputs,
  DCFResult,
  SensitivityGrid,
} from "@/lib/types";

export function calculateDCF(inputs: DCFInputs): DCFResult {
  const {
    currentRevenue,
    revenueGrowthRate,
    fcfMargin,
    forecastYears,
    wacc,
    terminalGrowthRate,
    netDebt,
    sharesOutstanding,
    currentSharePrice,
  } = inputs;

  const forecast: DCFForecastYear[] = [];
  let revenue = currentRevenue;
  let sumPVForecastFCF = 0;

  for (let year = 1; year <= forecastYears; year++) {
    revenue = revenue * (1 + revenueGrowthRate);
    const fcf = revenue * fcfMargin;
    const discountFactor = 1 / Math.pow(1 + wacc, year);
    const presentValueFCF = fcf * discountFactor;

    sumPVForecastFCF += presentValueFCF;

    forecast.push({
      year,
      revenue,
      fcf,
      discountFactor,
      presentValueFCF,
    });
  }

  const finalYearFCF = forecast[forecast.length - 1].fcf;

  // Gordon Growth terminal value, discounted back using the final year's
  // discount factor.
  const terminalValue =
    (finalYearFCF * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate);
  const finalDiscountFactor = forecast[forecast.length - 1].discountFactor;
  const presentValueTerminalValue = terminalValue * finalDiscountFactor;

  const enterpriseValue = sumPVForecastFCF + presentValueTerminalValue;
  const equityValue = enterpriseValue - netDebt;
  const fairValuePerShare =
    sharesOutstanding > 0 ? equityValue / sharesOutstanding : 0;

  const marginOfSafety =
    fairValuePerShare > 0
      ? (fairValuePerShare - currentSharePrice) / fairValuePerShare
      : 0;
  const upsideDownside =
    currentSharePrice > 0
      ? (fairValuePerShare - currentSharePrice) / currentSharePrice
      : 0;

  return {
    forecast,
    sumPVForecastFCF,
    terminalValue,
    presentValueTerminalValue,
    enterpriseValue,
    equityValue,
    fairValuePerShare,
    currentSharePrice,
    marginOfSafety,
    upsideDownside,
  };
}

/**
 * Builds a WACC x Terminal Growth sensitivity grid of Fair Value per Share.
 * waccRange and growthRange should be arrays of decimal rates, ascending.
 */
export function buildSensitivityGrid(
  baseInputs: DCFInputs,
  waccRange: number[],
  growthRange: number[]
): SensitivityGrid {
  return waccRange.map((wacc) =>
    growthRange.map((terminalGrowth) => {
      const result = calculateDCF({
        ...baseInputs,
        wacc,
        terminalGrowthRate: terminalGrowth,
      });
      return {
        wacc,
        terminalGrowth,
        fairValuePerShare: result.fairValuePerShare,
      };
    })
  );
}

/** Convenience helper to generate a symmetric range around a center value. */
export function buildRange(
  center: number,
  step: number,
  count: number
): number[] {
  const half = Math.floor(count / 2);
  const start = center - half * step;
  return Array.from({ length: count }, (_, i) => start + i * step);
}
