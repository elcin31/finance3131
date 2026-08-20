"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ScenarioCards } from "./ScenarioCards";
import { ShockSimulator } from "./ShockSimulator";
import { CompanySelector } from "@/components/company/CompanySelector";
import { runAllScenarios, applyManualShocks } from "@/lib/calculations/scenarios";
import { buildPositionsWithMetrics } from "@/lib/calculations/risk";
import {
  CompanyProfile,
  DCFInputs,
  ManualShock,
  PortfolioRiskSettings,
  Position,
  ShockImpactResult,
} from "@/lib/types";

export function ScenarioWorkspace({
  companies,
  activeTicker,
  baseDcfInputs,
  positions,
}: {
  companies: CompanyProfile[];
  activeTicker: string;
  baseDcfInputs: DCFInputs;
  positions: Position[];
}) {
  const [shockResult, setShockResult] = useState<ShockImpactResult | null>(null);

  const settings: PortfolioRiskSettings = {
    maxPositionSize: 0.1,
    maxSectorConcentration: 0.35,
  };

  const positionsWithMetrics = useMemo(
    () => buildPositionsWithMetrics(positions, settings),
    [positions]
  );

  const currentPortfolioValue = positionsWithMetrics.reduce(
    (sum, p) => sum + p.marketValue,
    0
  );

  const activePosition = positionsWithMetrics.find(
    (p) => p.ticker === activeTicker
  );
  const positionMarketValue = activePosition?.marketValue ?? 0;
  const positionShares = activePosition?.quantity ?? 0;

  const scenarioResults = useMemo(
    () =>
      runAllScenarios(
        baseDcfInputs,
        currentPortfolioValue,
        positionMarketValue,
        positionShares
      ),
    [baseDcfInputs, currentPortfolioValue, positionMarketValue, positionShares]
  );

  function handleRunShocks(shocks: ManualShock[]) {
    setShockResult(applyManualShocks(positionsWithMetrics, shocks));
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Scenario Company"
          subtitle="DCF scenarios apply to this company's valuation"
          action={<CompanySelector companies={companies} activeTicker={activeTicker} />}
        />
        <CardBody>
          <p className="text-2xs leading-relaxed text-ink-500">
            All scenarios below are explicitly hypothetical — they are not
            forecasts or predictions of what will happen, only illustrations
            of how the valuation and portfolio would look under different
            assumption sets.
          </p>
        </CardBody>
      </Card>

      <ScenarioCards results={scenarioResults} />

      <ShockSimulator
        availableTickers={positions
          .filter((p) => p.assetType !== "Cash")
          .map((p) => p.ticker)}
        onRunShocks={handleRunShocks}
        result={shockResult}
      />
    </div>
  );
}
