"use client";

import { useRouter } from "next/navigation";
import { CompanyProfile } from "@/lib/types";

export function CompanySelector({
  companies,
  activeTicker,
}: {
  companies: CompanyProfile[];
  activeTicker: string;
}) {
  const router = useRouter();

  return (
    <select
      value={activeTicker}
      onChange={(e) => router.push(`/company/${e.target.value}`)}
      className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-800 outline-none focus:border-accent"
    >
      {companies.map((c) => (
        <option key={c.ticker} value={c.ticker}>
          {c.ticker} — {c.name}
        </option>
      ))}
    </select>
  );
}
