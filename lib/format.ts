export function formatCurrency(
  value: number,
  currency = "USD",
  compact = false
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(value);
}

export function formatCurrencyMillions(valueInMillions: number): string {
  const abs = Math.abs(valueInMillions);
  const sign = valueInMillions < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}T`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}B`;
  return `${sign}$${abs.toFixed(1)}M`;
}

export function formatPercent(value: number | null, decimals = 1): string {
  if (value === null || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number | null, decimals = 2): string {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toFixed(decimals);
}

export function formatMultiple(value: number | null, decimals = 1): string {
  if (value === null || Number.isNaN(value)) return "—";
  return `${value.toFixed(decimals)}x`;
}

export function formatCompactShares(valueInMillions: number): string {
  if (valueInMillions >= 1000) return `${(valueInMillions / 1000).toFixed(2)}B`;
  return `${valueInMillions.toFixed(0)}M`;
}

export function signPrefix(value: number): string {
  return value > 0 ? "+" : "";
}
