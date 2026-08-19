import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { formatPercent } from "@/lib/utils/format";

export function ConcentrationBreakdown({
  title,
  data,
  maxThreshold,
}: {
  title: string;
  data: Record<string, number>;
  maxThreshold?: number;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader title={title} />
      <CardBody className="space-y-2.5">
        {entries.map(([key, weight]) => {
          const exceeds = maxThreshold !== undefined && weight > maxThreshold;
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-700">{key}</span>
                <span
                  className={
                    exceeds ? "font-semibold text-warn-dark" : "font-medium text-ink-900"
                  }
                >
                  {formatPercent(weight)}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className={exceeds ? "h-full bg-warn" : "h-full bg-accent"}
                  style={{ width: `${Math.min(100, weight * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
