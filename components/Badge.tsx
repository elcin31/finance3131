import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

export type BadgeTone =
  | "positive"
  | "negative"
  | "neutral"
  | "warning"
  | "critical";

const toneClasses: Record<BadgeTone, string> = {
  positive: "bg-gain-light text-gain-dark",
  negative: "bg-loss-light text-loss-dark",
  neutral: "bg-ink-100 text-ink-600",
  warning: "bg-warn-light text-warn-dark",
  critical: "bg-loss-light text-loss-dark",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
