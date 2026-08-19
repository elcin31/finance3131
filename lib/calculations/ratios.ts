/**
 * Deterministic financial ratio calculations.
 * These functions never call an LLM. They take raw statement data and
 * produce derived metrics using plain arithmetic — this is the layer that
 * guarantees numbers in the app are trustworthy and reproducible.
 */

import {
  CompanyFinancials,
  DerivedFinancialYear,
  FinancialStatementYear,
  ValuationRatios,
} from "@/lib/types";

export function freeCashFlow(year: FinancialStatementYear): number {
  return year.operatingCashFlow - year.capex;
}

export function fcfMargin(year: FinancialStatementYear): number {
  if (year.revenue === 0) return 0;
  return freeCashFlow(year) / year.revenue;
}

export function grossMargin(year: FinancialStatementYear): number {
  if (year.revenue === 0) return 0;
  return year.grossProfit / year.revenue;
}

export function operatingMargin(year: FinancialStatementYear): number {
  if (year.revenue === 0) return 0;
  return year.operatingIncome / year.revenue;
}

export function netMargin(year: FinancialStatementYear): number {
  if (year.revenue === 0) return 0;
  return year.netIncome / year.revenue;
}

export function returnOnEquity(year: FinancialStatementYear): number {
  if (year.shareholdersEquity === 0) return 0;
  return year.netIncome / year.shareholdersEquity;
}

/**
 * Simplified ROIC: NOPAT (approximated via operating income, untaxed) /
 * Invested Capital (debt + equity - cash). A standard simplification used
 * when explicit tax rate / lease data isn't available.
 */
export function returnOnInvestedCapital(
  year: FinancialStatementYear,
  assumedTaxRate = 0.21
): number {
  const investedCapital = year.totalDebt + year.shareholdersEquity - year.cash;
  if (investedCapital <= 0) return 0;
  const nopat = year.operatingIncome * (1 - assumedTaxRate);
  return nopat / investedCapital;
}

export function debtToEquity(year: FinancialStatementYear): number {
  if (year.shareholdersEquity === 0) return 0;
  return year.totalDebt / year.shareholdersEquity;
}

export function netDebtToEbitda(year: FinancialStatementYear): number {
  if (year.ebitda === 0) return 0;
  const netDebt = year.totalDebt - year.cash;
  return netDebt / year.ebitda;
}

export function revenueGrowth(
  current: FinancialStatementYear,
  prior: FinancialStatementYear | undefined
): number | null {
  if (!prior || prior.revenue === 0) return null;
  return (current.revenue - prior.revenue) / prior.revenue;
}

/**
 * Builds the full derived-metrics series for a company's financial history.
 * This is the canonical source for every margin/return/leverage ratio shown
 * in the UI — components should never recompute these independently.
 */
export function buildDerivedFinancialSeries(
  financials: CompanyFinancials
): DerivedFinancialYear[] {
  return financials.history.map((year, idx) => {
    const prior = idx > 0 ? financials.history[idx - 1] : undefined;
    return {
      fiscalYear: year.fiscalYear,
      revenueGrowth: revenueGrowth(year, prior),
      freeCashFlow: freeCashFlow(year),
      fcfMargin: fcfMargin(year),
      grossMargin: grossMargin(year),
      operatingMargin: operatingMargin(year),
      netMargin: netMargin(year),
      roe: returnOnEquity(year),
      roic: returnOnInvestedCapital(year),
      debtToEquity: debtToEquity(year),
      netDebtToEbitda: netDebtToEbitda(year),
    };
  });
}

/**
 * Valuation multiples require market data (price, shares outstanding) in
 * addition to the financial statements, so they're computed separately.
 */
export function buildValuationRatios(
  financials: CompanyFinancials,
  currentPrice: number,
  sharesOutstanding: number
): ValuationRatios[] {
  const marketCap = currentPrice * sharesOutstanding;

  return financials.history.map((year) => {
    const netDebt = year.totalDebt - year.cash;
    const enterpriseValue = marketCap + netDebt;
    const fcf = freeCashFlow(year);

    return {
      fiscalYear: year.fiscalYear,
      pe: year.eps > 0 ? currentPrice / year.eps : null,
      ps: year.revenue > 0 ? marketCap / year.revenue : null,
      evToEbitda: year.ebitda > 0 ? enterpriseValue / year.ebitda : null,
      evToFcf: fcf > 0 ? enterpriseValue / fcf : null,
    };
  });
}
