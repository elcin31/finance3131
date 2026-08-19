import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DCFResult } from "@/lib/types";
import { formatCurrency, formatCurrencyMillions, formatPercent } from "@/lib/utils/format";

export function ResultsSummary({ result }: { result: DCFResult }) {
  const isAttractive = result.marginOfSafety > 0.1;
  const isExpensive = result.marginOfSafety < -0.1;

  return (
    <Card>
      <CardHeader title="Valuation Output" />
      <CardBody>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Fair Value / Share" value={formatCurrency(result.fairValuePerShare)} highlight />
          <Metric label="Current Price" value={formatCurrency(result.currentSharePrice)} />
          <Metric
            label="Margin of Safety"
            value={formatPercent(result.marginOfSafety)}
            badge={
              isAttractive ? (
                <Badge tone="positive">Above Price</Badge>
              ) : isExpensive ? (
                <Badge tone="negative">Below Price</Badge>
              ) : (
                <Badge tone="neutral">Near Price</Badge>
              )
            }
          />
          <Metric label="Upside / Downside" value={formatPercent(result.upsideDownside)} />
          <Metric label="Enterprise Value" value={formatCurrencyMillions(result.enterpriseValue)} />
          <Metric label="Equity Value" value={formatCurrencyMillions(result.equityValue)} />
          <Metric label="PV of Forecast FCF" value={formatCurrencyMillions(result.sumPVForecastFCF)} />
          <Metric label="Terminal Value" value={formatCurrencyMillions(result.terminalValue)} />
          <Metric label="PV of Terminal Value" value={formatCurrencyMillions(result.presentValueTerminalValue)} />
        </div>

        <div className="mt-3 rounded-md bg-ink-50 p-2.5 text-2xs leading-relaxed text-ink-500">
          Fair value is derived entirely from the assumptions above using a
          standard discounted cash flow methodology (forecast FCF + Gordon
          Growth terminal value, discounted at WACC). This is a model output,
          not a price target or prediction.
        </div>
      </CardBody>
    </Card>
  );
}

function Metric({
  label,
  value,
  highlight,
  badge,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p
        className={
          highlight
            ? "mt-0.5 font-mono text-xl font-bold text-accent"
            : "mt-0.5 font-mono text-sm font-semibold text-ink-900"
        }
      >
        {value}
      </p>
      {badge && <div className="mt-1">{badge}</div>}
    </div>
  );
}
