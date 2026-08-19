"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { InputSlider } from "@/components/ui/InputSlider";
import { PortfolioRiskSettings } from "@/lib/types";

export function RiskSettingsPanel({
  settings,
  onChange,
}: {
  settings: PortfolioRiskSettings;
  onChange: (settings: PortfolioRiskSettings) => void;
}) {
  return (
    <Card>
      <CardHeader title="Risk Limits" subtitle="Applied across all positions" />
      <CardBody className="space-y-4">
        <InputSlider
          label="Maximum Position Size"
          value={settings.maxPositionSize}
          onChange={(v) => onChange({ ...settings, maxPositionSize: v })}
          min={0.02}
          max={0.3}
          step={0.01}
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <InputSlider
          label="Maximum Sector Concentration"
          value={settings.maxSectorConcentration}
          onChange={(v) => onChange({ ...settings, maxSectorConcentration: v })}
          min={0.1}
          max={0.6}
          step={0.01}
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
        />
      </CardBody>
    </Card>
  );
}
