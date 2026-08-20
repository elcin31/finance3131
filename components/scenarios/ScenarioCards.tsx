import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScenarioResult } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function ScenarioCards({ results }: { results: ScenarioResult[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {results.map((r) => (
        <Card
          key={r.name}
          className={cn(
            r.name === "Bear Case" && "border-loss/30",
            r.name === "Bull Case" && "border-gain/30"
          )}
        >
          <CardHeader
            title={r.name}
            action={
              <Badge
                tone={
                  r.name === "Bear Case"
                    ? "negative"
                    : r.name === "Bull Case"
                    ? "positive"
                    : "neutral"
                }
              >
                Hypothetical
              </Badge>
            }
          />
          <CardBody className="space-y-2.5">
            <div>
              <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
                Fair Value / Share
              </p>
              <p className="font-mono text-lg font-bold text-ink-900">
                {formatCurrency(r.fairValuePerShare)}
              </p>
            </div>
            <div>
              <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
                Portfolio Value
              </p>
              <p className="font-mono text-sm font-semibold text-ink-900">
                {formatCurrency(r.portfolioValue)}
              </p>
            </div>
            <div>
              <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
                Portfolio Return
              </p>
              <p
                className={cn(
                  "font-mono text-sm font-semibold",
                  r.portfolioReturn >= 0 ? "text-gain" : "text-loss"
                )}
              >
                {r.portfolioReturn >= 0 ? "+" : ""}
                {formatPercent(r.portfolioReturn)}
              </p>
            </div>
            {r.potentialDrawdown < 0 && (
              <div>
                <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
                  Potential Drawdown
                </p>
                <p className="font-mono text-sm font-semibold text-loss">
                  {formatPercent(r.potentialDrawdown)}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
