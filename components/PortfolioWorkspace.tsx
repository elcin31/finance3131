"use client";

import { useMemo, useState } from "react";
import {
  buildPortfolioRiskMetrics,
  buildPositionsWithMetrics,
  generatePortfolioAlerts,
} from "@/lib/calculations/risk";
import { HistoricalPriceSeries, PortfolioRiskSettings, Position } from "@/lib/types";
import { PositionsTable } from "./PositionsTable";
import { AddPositionForm } from "./AddPositionForm";
import { RiskMetricsPanel } from "./RiskMetricsPanel";
import { ConcentrationBreakdown } from "./ConcentrationBreakdown";
import { RiskSettingsPanel } from "./RiskSettingsPanel";
import { AlertsPanel } from "./AlertsPanel";

export function PortfolioWorkspace({
  initialPositions,
  priceHistories,
  benchmarkReturns,
}: {
  initialPositions: Position[];
  priceHistories: Record<string, HistoricalPriceSeries>;
  benchmarkReturns: number[];
}) {
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [settings, setSettings] = useState<PortfolioRiskSettings>({
    maxPositionSize: 0.1,
    maxSectorConcentration: 0.35,
  });

  const positionsWithMetrics = useMemo(
    () => buildPositionsWithMetrics(positions, settings, priceHistories),
    [positions, settings, priceHistories]
  );

  const riskMetrics = useMemo(
    () =>
      buildPortfolioRiskMetrics(
        positionsWithMetrics,
        benchmarkReturns,
        priceHistories
      ),
    [positionsWithMetrics, benchmarkReturns, priceHistories]
  );

  const alerts = useMemo(
    () => generatePortfolioAlerts(positionsWithMetrics, riskMetrics, settings),
    [positionsWithMetrics, riskMetrics, settings]
  );

  function handleAdd(position: Position) {
    setPositions((prev) => [...prev, position]);
  }

  function handleRemove(id: string) {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-4">
      <AlertsPanel alerts={alerts} />

      <RiskMetricsPanel metrics={riskMetrics} />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-ink-900">Positions</h2>
        <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
          <PositionsTable positions={positionsWithMetrics} onRemove={handleRemove} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ConcentrationBreakdown
          title="Sector Concentration"
          data={riskMetrics.sectorConcentration}
          maxThreshold={settings.maxSectorConcentration}
        />
        <ConcentrationBreakdown
          title="Geographic Concentration"
          data={riskMetrics.geographicConcentration}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RiskSettingsPanel settings={settings} onChange={setSettings} />
        <AddPositionForm onAdd={handleAdd} />
      </div>
    </div>
  );
}
