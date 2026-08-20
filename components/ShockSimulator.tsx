"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { NumberField } from "@/components/ui/InputSlider";
import { DataTable, DataTableColumn } from "@/components/ui/DataTable";
import { ManualShock, ShockImpactResult } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function ShockSimulator({
  availableTickers,
  onRunShocks,
  result,
}: {
  availableTickers: string[];
  onRunShocks: (shocks: ManualShock[]) => void;
  result: ShockImpactResult | null;
}) {
  const [shocks, setShocks] = useState<ManualShock[]>([
    { id: "s1", targetTicker: availableTickers[0] ?? "MARKET", shockPct: -0.3, label: "" },
  ]);

  function updateShock(id: string, patch: Partial<ManualShock>) {
    setShocks((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addShock() {
    setShocks((prev) => [
      ...prev,
      { id: `s${Date.now()}`, targetTicker: "MARKET", shockPct: -0.2, label: "" },
    ]);
  }

  function removeShock(id: string) {
    setShocks((prev) => prev.filter((s) => s.id !== id));
  }

  const columns: DataTableColumn<ShockImpactResult["positionImpacts"][0]>[] = [
    { key: "ticker", header: "Asset", render: (r) => r.ticker },
    {
      key: "original",
      header: "Original Value",
      align: "right",
      render: (r) => formatCurrency(r.originalValue),
    },
    {
      key: "shocked",
      header: "Shocked Value",
      align: "right",
      render: (r) => formatCurrency(r.shockedValue),
    },
    {
      key: "impact",
      header: "Impact",
      align: "right",
      render: (r) => (
        <span className={r.impactAmount >= 0 ? "text-gain" : "text-loss"}>
          {r.impactAmount >= 0 ? "+" : ""}
          {formatCurrency(r.impactAmount)}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Manual Shock Simulator"
        subtitle="Apply hypothetical price shocks to specific holdings or the whole market"
      />
      <CardBody className="space-y-3">
        {shocks.map((shock) => (
          <div key={shock.id} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs font-medium text-ink-600">Target</label>
              <select
                value={shock.targetTicker}
                onChange={(e) => updateShock(shock.id, { targetTicker: e.target.value })}
                className="mt-1 w-full rounded-md border border-ink-200 px-2 py-1.5 text-xs outline-none focus:border-accent"
              >
                <option value="MARKET">All Equity (Market)</option>
                {availableTickers.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <NumberField
                label="Shock %"
                value={shock.shockPct * 100}
                onChange={(v) => updateShock(shock.id, { shockPct: v / 100 })}
                step={5}
                suffix="%"
              />
            </div>
            <button
              onClick={() => removeShock(shock.id)}
              className="mb-1.5 rounded-md border border-ink-200 px-2 py-1.5 text-2xs text-ink-500"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <button
            onClick={addShock}
            className="flex-1 rounded-md border border-dashed border-ink-300 py-1.5 text-xs font-medium text-ink-500"
          >
            + Add Shock
          </button>
          <button
            onClick={() => onRunShocks(shocks)}
            className="flex-1 rounded-md bg-navy-900 py-1.5 text-xs font-semibold text-white"
          >
            Run Simulation
          </button>
        </div>

        {result && (
          <div className="mt-3 space-y-3 border-t border-ink-100 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
                  Original Portfolio Value
                </p>
                <p className="font-mono text-sm font-semibold text-ink-900">
                  {formatCurrency(result.originalPortfolioValue)}
                </p>
              </div>
              <div>
                <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
                  Shocked Portfolio Value
                </p>
                <p className="font-mono text-sm font-semibold text-ink-900">
                  {formatCurrency(result.shockedPortfolioValue)}
                </p>
              </div>
              <div>
                <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
                  Total Impact
                </p>
                <p
                  className={cn(
                    "font-mono text-sm font-semibold",
                    result.impactAmount >= 0 ? "text-gain" : "text-loss"
                  )}
                >
                  {formatCurrency(result.impactAmount)} (
                  {formatPercent(result.impactPct)})
                </p>
              </div>
            </div>
            <DataTable
              columns={columns}
              rows={result.positionImpacts}
              keyExtractor={(r) => r.ticker}
            />
            <p className="text-2xs text-ink-400">
              This is a simplified, hypothetical linear repricing. It does not
              account for correlation, liquidity, or second-order market
              effects.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
