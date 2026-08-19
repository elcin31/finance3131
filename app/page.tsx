import {
  fetchCompanyFinancials,
  fetchCompanyProfile,
} from "@/lib/data/financial-data-service";
import { freeCashFlow, fcfMargin, revenueGrowth } from "@/lib/calculations/ratios";
import { DCFWorkspace } from "@/components/dcf/DCFWorkspace";
import { DCFInputs } from "@/lib/types";

export default async function DCFPage({
  searchParams,
}: {
  searchParams: { ticker?: string };
}) {
  const ticker = (searchParams.ticker ?? "AAPL").toUpperCase();
  const [profile, financials] = await Promise.all([
    fetchCompanyProfile(ticker),
    fetchCompanyFinancials(ticker),
  ]);

  let initialInputs: DCFInputs;

  if (profile && financials) {
    const latest = financials.history[financials.history.length - 1];
    const prior = financials.history[financials.history.length - 2];
    const growth = revenueGrowth(latest, prior);

    initialInputs = {
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
  } else {
    // Fallback generic defaults if ticker isn't found in mock data
    initialInputs = {
      currentRevenue: 100000,
      currentFCF: 15000,
      revenueGrowthRate: 0.1,
      fcfMargin: 0.15,
      forecastYears: 5,
      wacc: 0.09,
      terminalGrowthRate: 0.025,
      netDebt: 0,
      sharesOutstanding: 1000,
      currentSharePrice: 100,
    };
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">DCF Valuation</h1>
        <p className="mt-0.5 text-2xs text-ink-400">
          {profile ? `${profile.name} (${profile.ticker})` : "Custom inputs"} ·
          All calculations run client-side, deterministically, as you adjust
          assumptions.
        </p>
      </div>
      <DCFWorkspace initialInputs={initialInputs} />
    </div>
  );
}
