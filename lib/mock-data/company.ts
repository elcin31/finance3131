// Core company & financial statement types.
// AI must never populate these directly — only deterministic data sources /
// calculations may produce values that flow into these shapes.

export type Sector =
  | "Technology"
  | "Financials"
  | "Healthcare"
  | "Energy"
  | "Consumer Discretionary"
  | "Consumer Staples"
  | "Industrials"
  | "Utilities"
  | "Materials"
  | "Real Estate"
  | "Communication Services";

export type Region =
  | "North America"
  | "Europe"
  | "Asia Pacific"
  | "Emerging Markets"
  | "Global";

export type AssetType = "Equity" | "ETF" | "Bond" | "Cash" | "Commodity";

export interface CompanyProfile {
  ticker: string;
  name: string;
  sector: Sector;
  region: Region;
  currency: string;
  sharesOutstanding: number; // most recent, in millions
  currentPrice: number;
  description: string;
}

/**
 * One fiscal year of reported financial statement data.
 * All values in millions of the company's reporting currency unless noted.
 */
export interface FinancialStatementYear {
  fiscalYear: number;
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  ebitda: number;
  netIncome: number;
  eps: number;
  operatingCashFlow: number;
  capex: number; // positive number representing capital expenditure outflow
  cash: number;
  totalDebt: number;
  shareholdersEquity: number;
}

export interface CompanyFinancials {
  ticker: string;
  history: FinancialStatementYear[]; // ordered oldest -> newest
}

/** Derived (calculated) figures — never entered manually, always computed. */
export interface DerivedFinancialYear {
  fiscalYear: number;
  revenueGrowth: number | null; // % YoY, null for first year in series
  freeCashFlow: number;
  fcfMargin: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  roe: number;
  roic: number;
  debtToEquity: number;
  netDebtToEbitda: number;
}

export interface ValuationRatios {
  fiscalYear: number;
  pe: number | null;
  ps: number | null;
  evToEbitda: number | null;
  evToFcf: number | null;
}

export type RiskLevel = "Low" | "Moderate" | "Elevated" | "High";

export interface BusinessAnalysisBlock {
  title: string;
  summary: string;
  points: string[];
}
