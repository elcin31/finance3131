import { notFound } from "next/navigation";
import {
  fetchCompanyFinancials,
  fetchCompanyList,
  fetchCompanyProfile,
} from "@/lib/data/financial-data-service";
import {
  buildDerivedFinancialSeries,
  buildValuationRatios,
} from "@/lib/calculations/ratios";
import { buildBusinessAnalysisBlocks } from "@/lib/ai/explain";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { CompanySelector } from "@/components/company/CompanySelector";
import {
  FinancialBarChart,
  FinancialLineChart,
} from "@/components/company/FinancialsChart";
import { RatiosTable } from "@/components/company/RatiosTable";
import { BusinessAnalysis } from "@/components/company/BusinessAnalysis";
import { formatCurrency, formatCurrencyMillions } from "@/lib/utils/format";
import { StatTile } from "@/components/ui/StatTile";
import Link from "next/link";

export default async function CompanyPage({
  params,
}: {
  params: { ticker: string };
}) {
  const ticker = params.ticker.toUpperCase();
  const [profile, financials, companies] = await Promise.all([
    fetchCompanyProfile(ticker),
    fetchCompanyFinancials(ticker),
    fetchCompanyList(),
  ]);

  if (!profile || !financials) notFound();

  const derivedSeries = buildDerivedFinancialSeries(financials);
  const valuationSeries = buildValuationRatios(
    financials,
    profile.currentPrice,
    profile.sharesOutstanding
  );
  const analysisBlocks = buildBusinessAnalysisBlocks(derivedSeries);
  const latestRatio = valuationSeries[valuationSeries.length - 1];
  const latestDerived = derivedSeries[derivedSeries.length - 1];

  const revenueData = financials.history.map((y) => ({
    fiscalYear: y.fiscalYear,
    value: y.revenue,
  }));
  const fcfData = financials.history.map((y, i) => ({
    fiscalYear: y.fiscalYear,
    value: derivedSeries[i].freeCashFlow,
  }));
  const marginData = derivedSeries.map((d) => ({
    fiscalYear: d.fiscalYear,
    grossMargin: d.grossMargin,
    operatingMargin: d.operatingMargin,
    netMargin: d.netMargin,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-ink-900">
              {profile.name}
            </h1>
            <span className="font-mono text-xs text-ink-400">
              {profile.ticker}
            </span>
          </div>
          <p className="mt-0.5 text-2xs text-ink-400">
            {profile.sector} · {profile.region}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CompanySelector companies={companies} activeTicker={ticker} />
          <Link
            href={`/dcf?ticker=${ticker}`}
            className="whitespace-nowrap rounded-md bg-navy-900 px-3 py-1.5 text-xs font-medium text-white"
          >
            Run DCF →
          </Link>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-ink-600">
        {profile.description}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatTile
          label="Price"
          value={formatCurrency(profile.currentPrice)}
        />
        <StatTile label="P/E" value={latestRatio.pe ? `${latestRatio.pe.toFixed(1)}x` : "—"} />
        <StatTile
          label="ROIC"
          value={`${(latestDerived.roic * 100).toFixed(1)}%`}
        />
        <StatTile
          label="FCF Margin"
          value={`${(latestDerived.fcfMargin * 100).toFixed(1)}%`}
        />
      </div>

      <Card>
        <CardHeader title="Revenue" subtitle="Historical, USD millions" />
        <CardBody>
          <FinancialBarChart data={revenueData} dataKey="value" label="Revenue" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Free Cash Flow" subtitle="Operating Cash Flow − CapEx" />
        <CardBody>
          <FinancialBarChart data={fcfData} dataKey="value" label="FCF" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Margins" subtitle="Gross / Operating / Net" />
        <CardBody>
          <FinancialLineChart
            data={marginData}
            series={[
              { key: "grossMargin", label: "Gross", color: "#2563eb" },
              { key: "operatingMargin", label: "Operating", color: "#16a34a" },
              { key: "netMargin", label: "Net", color: "#d97706" },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Financial Statement History"
          subtitle="USD millions unless noted"
        />
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full min-w-max text-xs">
            <thead>
              <tr className="border-b border-ink-200">
                <th className="px-2.5 py-2 text-left font-medium text-ink-400">
                  Metric
                </th>
                {financials.history.map((y) => (
                  <th
                    key={y.fiscalYear}
                    className="px-2.5 py-2 text-right font-medium text-ink-400"
                  >
                    FY{y.fiscalYear}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                { label: "Revenue", get: (y: typeof financials.history[0]) => y.revenue },
                { label: "Gross Profit", get: (y: typeof financials.history[0]) => y.grossProfit },
                { label: "Operating Income", get: (y: typeof financials.history[0]) => y.operatingIncome },
                { label: "EBITDA", get: (y: typeof financials.history[0]) => y.ebitda },
                { label: "Net Income", get: (y: typeof financials.history[0]) => y.netIncome },
                { label: "Operating Cash Flow", get: (y: typeof financials.history[0]) => y.operatingCashFlow },
                { label: "CapEx", get: (y: typeof financials.history[0]) => y.capex },
                { label: "Cash", get: (y: typeof financials.history[0]) => y.cash },
                { label: "Total Debt", get: (y: typeof financials.history[0]) => y.totalDebt },
                { label: "Shareholders' Equity", get: (y: typeof financials.history[0]) => y.shareholdersEquity },
              ].map((row) => (
                <tr key={row.label} className="border-b border-ink-100 last:border-0">
                  <td className="px-2.5 py-1.5 text-ink-600">{row.label}</td>
                  {financials.history.map((y) => (
                    <td key={y.fiscalYear} className="px-2.5 py-1.5 text-right text-ink-900">
                      {formatCurrencyMillions(row.get(y))}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-2.5 py-1.5 text-ink-600">EPS</td>
                {financials.history.map((y) => (
                  <td key={y.fiscalYear} className="px-2.5 py-1.5 text-right text-ink-900">
                    ${y.eps.toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Valuation & Efficiency Ratios" />
        <CardBody className="p-0">
          <RatiosTable derivedSeries={derivedSeries} valuationSeries={valuationSeries} />
        </CardBody>
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-ink-900">
          Business Analysis
        </h2>
        <BusinessAnalysis blocks={analysisBlocks} />
      </div>
    </div>
  );
}
