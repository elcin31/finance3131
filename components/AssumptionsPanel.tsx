"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { InputSlider, NumberField } from "@/components/ui/InputSlider";
import { DCFInputs } from "@/lib/types";

export function AssumptionsPanel({
  inputs,
  onChange,
}: {
  inputs: DCFInputs;
  onChange: (inputs: DCFInputs) => void;
}) {
  function set<K extends keyof DCFInputs>(key: K, value: DCFInputs[K]) {
    onChange({ ...inputs, [key]: value });
  }

  return (
    <Card>
      <CardHeader
        title="Assumptions"
        subtitle="Adjust to explore fair value sensitivity"
      />
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Current Revenue"
            value={inputs.currentRevenue}
            onChange={(v) => set("currentRevenue", v)}
            step={100}
            prefix="$"
            suffix="M"
          />
          <NumberField
            label="Current FCF"
            value={inputs.currentFCF}
            onChange={(v) => set("currentFCF", v)}
            step={100}
            prefix="$"
            suffix="M"
          />
        </div>

        <InputSlider
          label="Revenue Growth Rate"
          value={inputs.revenueGrowthRate}
          onChange={(v) => set("revenueGrowthRate", v)}
          min={-0.1}
          max={0.4}
          step={0.005}
          formatValue={(v) => `${(v * 100).toFixed(1)}%`}
        />

        <InputSlider
          label="FCF Margin"
          value={inputs.fcfMargin}
          onChange={(v) => set("fcfMargin", v)}
          min={0.02}
          max={0.5}
          step={0.005}
          formatValue={(v) => `${(v * 100).toFixed(1)}%`}
        />

        <InputSlider
          label="Forecast Period"
          value={inputs.forecastYears}
          onChange={(v) => set("forecastYears", Math.round(v))}
          min={3}
          max={15}
          step={1}
          formatValue={(v) => `${v} years`}
        />

        <InputSlider
          label="WACC (Discount Rate)"
          value={inputs.wacc}
          onChange={(v) => set("wacc", v)}
          min={0.04}
          max={0.16}
          step={0.0025}
          formatValue={(v) => `${(v * 100).toFixed(2)}%`}
        />

        <InputSlider
          label="Terminal Growth Rate"
          value={inputs.terminalGrowthRate}
          onChange={(v) => set("terminalGrowthRate", v)}
          min={0}
          max={Math.min(0.04, inputs.wacc - 0.005)}
          step={0.0025}
          formatValue={(v) => `${(v * 100).toFixed(2)}%`}
          helperText="Must stay below WACC"
        />

        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Net Debt"
            value={inputs.netDebt}
            onChange={(v) => set("netDebt", v)}
            step={100}
            prefix="$"
            suffix="M"
          />
          <NumberField
            label="Shares Outstanding"
            value={inputs.sharesOutstanding}
            onChange={(v) => set("sharesOutstanding", v)}
            step={10}
            suffix="M"
          />
        </div>

        <NumberField
          label="Current Share Price"
          value={inputs.currentSharePrice}
          onChange={(v) => set("currentSharePrice", v)}
          step={0.5}
          prefix="$"
        />
      </CardBody>
    </Card>
  );
}
