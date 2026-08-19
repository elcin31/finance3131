/**
 * Data service abstraction layer.
 *
 * Every part of the app that needs company/price data goes through these
 * functions instead of importing mock data directly. Today they read from
 * lib/mock-data. Later, swap the internals to call a real financial data
 * API (e.g. server-side in a Next.js Route Handler, keeping API keys in
 * Vercel Environment Variables) — consumers of this module won't need to
 * change at all, since the function signatures stay the same.
 *
 * To connect a real API:
 *   1. Create app/api/company/[ticker]/route.ts etc. as server routes.
 *   2. Read process.env.YOUR_API_KEY there (set in Vercel dashboard).
 *   3. Replace the function bodies below with fetch() calls to your route.
 *   4. Keep the same return types so nothing else in the app breaks.
 */

import { CompanyFinancials, CompanyProfile, HistoricalPriceSeries, Position } from "@/lib/types";
import { getCompanyProfile, MOCK_COMPANIES } from "@/lib/mock-data/companies";
import { getCompanyFinancials } from "@/lib/mock-data/financials";
import { getBenchmarkReturns, getHistoricalPrices } from "@/lib/mock-data/prices";
import { MOCK_PORTFOLIO } from "@/lib/mock-data/portfolio";

export const DATA_SOURCE_MODE: "mock" | "live" = "mock";

export async function fetchCompanyList(): Promise<CompanyProfile[]> {
  return MOCK_COMPANIES;
}

export async function fetchCompanyProfile(
  ticker: string
): Promise<CompanyProfile | null> {
  return getCompanyProfile(ticker) ?? null;
}

export async function fetchCompanyFinancials(
  ticker: string
): Promise<CompanyFinancials | null> {
  return getCompanyFinancials(ticker) ?? null;
}

export async function fetchHistoricalPrices(
  ticker: string
): Promise<HistoricalPriceSeries | null> {
  return getHistoricalPrices(ticker);
}

export async function fetchBenchmarkReturns(): Promise<number[]> {
  return getBenchmarkReturns();
}

export async function fetchStarterPortfolio(): Promise<Position[]> {
  return MOCK_PORTFOLIO;
}
