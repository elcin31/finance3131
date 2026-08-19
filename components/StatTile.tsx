import { cn } from "@/lib/utils/cn";

export function StatTile({
  label,
  value,
  delta,
  deltaTone = "neutral",
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-3">
      <p className="text-2xs font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg font-semibold text-ink-900">
        {value}
      </p>
      {delta && (
        <p
          className={cn(
            "mt-0.5 text-2xs font-medium",
            deltaTone === "positive" && "text-gain",
            deltaTone === "negative" && "text-loss",
            deltaTone === "neutral" && "text-ink-400"
          )}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
