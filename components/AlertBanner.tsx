import { cn } from "@/lib/utils/cn";
import { AlertSeverity } from "@/lib/types";

const severityStyles: Record<AlertSeverity, string> = {
  info: "bg-accent-light border-accent/30 text-accent",
  warning: "bg-warn-light border-warn/30 text-warn-dark",
  critical: "bg-loss-light border-loss/30 text-loss-dark",
};

export function AlertBanner({
  severity,
  message,
}: {
  severity: AlertSeverity;
  message: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 text-xs font-medium",
        severityStyles[severity]
      )}
    >
      {message}
    </div>
  );
}
