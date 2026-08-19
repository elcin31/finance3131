import {
  fetchCompanyFinancials,
  fetchCompanyList,
  fetchCompanyProfile,
  fetchStarterPortfolio,
} from "@/lib/data/financial-data-service";
import { freeCashFlow, fcfMargin, revenueGrowth } from "@/lib/calculations/ratios";
import { ScenarioWorkspace } from "@/components/scenarios/ScenarioWorkspace";
import { DCFInputs } from "@/lib/types";

export default async function ScenariosPage({
  searchParams,
}: {
  searchParams: { ticker?: string };
}) {
  const ticker = (searchParams.ticker ?? "NVDA").toUpperCase();
  const [profile, financials, companies, positions] = await Promise.all([
    fetchCompanyProfile(ticker),
    fetchCompanyFinancials(ticker),
    fetchCompanyList(),
    fetchStarterPortfolio(),
  ]);

  let baseDcfInputs: DCFInputs;

  if (profile && financials) {
    const latest = financials.history[financials.history.length - 1];
    const prior = financials.history[financials.history.length - 2];
    const growth = revenueGrowth(latest, prior);

    baseDcfInputs = {
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
    baseDcfInputs = {
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
        <h1 className="text-lg font-semibold text-ink-900">
          Scenario Analysis
        </h1>
        <p className="mt-0.5 text-2xs text-ink-400">
          Bear / Base / Bull cases and manual shock simulation. All figures
          are hypothetical illustrations, not predictions.
        </p>
      </div>
      <ScenarioWorkspace
        companies={companies}
        activeTicker={ticker}
        baseDcfInputs={baseDcfInputs}
        positions={positions}
      />
    </div>
  );
}
