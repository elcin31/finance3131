import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SensitivityGrid } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function SensitivityTable({
  grid,
  currentPrice,
}: {
  grid: SensitivityGrid;
  currentPrice: number;
}) {
  const growthHeaders = grid[0]?.map((cell) => cell.terminalGrowth) ?? [];

  return (
    <Card>
      <CardHeader
        title="Sensitivity Analysis"
        subtitle="Fair Value per Share — WACC × Terminal Growth"
      />
      <CardBody className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-ink-200 bg-ink-50 px-2 py-1.5 text-2xs font-medium text-ink-400">
                WACC \ g
              </th>
              {growthHeaders.map((g) => (
                <th
                  key={g}
                  className="border border-ink-200 bg-ink-50 px-2 py-1.5 text-2xs font-medium text-ink-500"
                >
                  {(g * 100).toFixed(2)}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row) => (
              <tr key={row[0]?.wacc}>
                <td className="border border-ink-200 bg-ink-50 px-2 py-1.5 text-2xs font-medium text-ink-500">
                  {(row[0]?.wacc * 100).toFixed(2)}%
                </td>
                {row.map((cell) => {
                  const diff = (cell.fairValuePerShare - currentPrice) / currentPrice;
                  return (
                    <td
                      key={`${cell.wacc}-${cell.terminalGrowth}`}
                      className={cn(
                        "border border-ink-200 px-2 py-1.5 text-right font-mono text-2xs",
                        diff > 0.1 && "bg-gain-light text-gain-dark",
                        diff < -0.1 && "bg-loss-light text-loss-dark",
                        diff >= -0.1 && diff <= 0.1 && "text-ink-700"
                      )}
                    >
                      ${cell.fairValuePerShare.toFixed(0)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-2xs text-ink-400">
          Green: fair value {'>'}10% above current price. Red: fair value {'>'}10% below current price.
        </p>
      </CardBody>
    </Card>
  );
}
