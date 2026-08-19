"use client";

import { useMemo, useState } from "react";
import { AssumptionsPanel } from "./AssumptionsPanel";
import { ResultsSummary } from "./ResultsSummary";
import { SensitivityTable } from "./SensitivityTable";
import { ForecastChart } from "./ForecastChart";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import {
  buildRange,
  buildSensitivityGrid,
  calculateDCF,
} from "@/lib/calculations/dcf";
import { DCFInputs } from "@/lib/types";

export function DCFWorkspace({ initialInputs }: { initialInputs: DCFInputs }) {
  const [inputs, setInputs] = useState<DCFInputs>(initialInputs);

  const result = useMemo(() => calculateDCF(inputs), [inputs]);

  const sensitivityGrid = useMemo(() => {
    const waccRange = buildRange(inputs.wacc, 0.01, 5);
    const growthRange = buildRange(inputs.terminalGrowthRate, 0.005, 5).filter(
      (g) => g >= 0
    );
    return buildSensitivityGrid(inputs, waccRange, growthRange);
  }, [inputs]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
      <div className="order-2 lg:order-1">
        <AssumptionsPanel inputs={inputs} onChange={setInputs} />
      </div>

      <div className="order-1 space-y-4 lg:order-2">
        <ResultsSummary result={result} />

        <Card>
          <CardHeader
            title="Forecast Free Cash Flow"
            subtitle="Gray: forecast FCF · Blue: present value"
          />
          <CardBody>
            <ForecastChart forecast={result.forecast} />
          </CardBody>
        </Card>

        <SensitivityTable grid={sensitivityGrid} currentPrice={inputs.currentSharePrice} />
      </div>
    </div>
  );
}
